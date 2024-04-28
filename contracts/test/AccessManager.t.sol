// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "../script/00_DeployAccessManager.s.sol";
import "../src/libraries/Roles.sol";

contract AccessManagerTest is Test {
    AccessManager public accessManager;
    address public admin;
    address public scriptAdmin;
    address public accessManagersuperAdmin = 0x00000000000000000000000000000000000000a0;
    address public accessManagersuperAdmin2 = 0x00000000000000000000000000000000000000A1;
    address MOCK_ADDR_1 = 0x0000000000000000000000000000000000000001;
    uint256 fork;
    string SEPOLIA_RPC_URL = vm.envString("SEPOLIA_RPC");

    function setUp() public {
        fork = vm.createFork(SEPOLIA_RPC_URL);
        vm.selectFork(fork);
        admin = address(this);
        scriptAdmin = 0x98B6388f0acFa325f1d93438A647E1e4Cfb156f2;
        // Setup Access Manager
        AccessManagerDeploymentScript accessManagerScript = new AccessManagerDeploymentScript();
        accessManager = AccessManager(accessManagerScript.deployForTest(accessManagersuperAdmin));
        vm.prank(accessManagersuperAdmin);
        accessManager.grantRole(Roles.ADMIN_ROLE, scriptAdmin, 0);
    }

    function testAccessManagerAccess() public {
        // revertData is the encoded data for the AccessManagerUnauthorizedAccount event
        bytes memory revertData = abi.encodeWithSelector(
            bytes4(keccak256("AccessManagerUnauthorizedAccount(address,uint64)")),
            accessManagersuperAdmin2,
            0
        );
        // Only a super admin can grant roles. So accessManagersuperAdmin2 cannot grant super admin role to MOCK_ADDR_1
        vm.expectRevert(revertData);
        vm.prank(accessManagersuperAdmin2);
        accessManager.grantRole(Roles.ADMIN_ROLE, MOCK_ADDR_1, 0);

        // Now accessManagersuperAdmin can grant super admin role to MOCK_ADDR_1
        vm.prank(accessManagersuperAdmin);
        accessManager.grantRole(Roles.ADMIN_ROLE, MOCK_ADDR_1, 0);
    }
}