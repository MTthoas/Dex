// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import "../script/01_DeployAccessManager.s.sol";
import "../src/libraries/Roles.sol";

contract AccessManagerTest is Test {
    AccessManager public accessManager;

    address public deployer = 0x00000000000000000000000000000000000000D1;
    address public admin = 0x00000000000000000000000000000000000000a0;
    address public user = 0x0000000000000000000000000000000000000001;
    uint256 fork;
    string SEPOLIA_RPC_URL = vm.envString("API_KEY_ALCHEMY_SEPOLIA");

    function setUp() public {
        fork = vm.createFork(SEPOLIA_RPC_URL);
        vm.selectFork(fork);

        AccessManagerDeploymentScript accessManagerScript = new AccessManagerDeploymentScript();
        accessManager = AccessManager(accessManagerScript.deployForTest(deployer));

        // Grant the admin role to the deployer
        vm.prank(deployer);
        accessManager.grantRole(Roles.ADMIN_ROLE, admin, 0);

        // Remove admin role from the deployer
        vm.prank(admin);
        accessManager.revokeRole(Roles.ADMIN_ROLE, deployer);
    }

    function testAccessManagerAccess() public {
        // revertData is the encoded data for the AccessManagerUnauthorizedAccount event
        bytes memory revertData = abi.encodeWithSelector(
            bytes4(keccak256("AccessManagerUnauthorizedAccount(address,uint64)")), deployer, 0
        );

        // Deployer should not be able to grant the admin role
        vm.prank(deployer);
        vm.expectRevert(revertData);
        accessManager.grantRole(Roles.ADMIN_ROLE, user, 0);

        // Deployer should not be able to revoke the admin role
        vm.prank(deployer);
        vm.expectRevert(revertData);
        accessManager.revokeRole(Roles.ADMIN_ROLE, admin);

        // Admin should be able to grant the admin role
        vm.prank(admin);
        accessManager.grantRole(Roles.ADMIN_ROLE, user, 0);

        // Admin should be able to revoke the admin role
        vm.prank(admin);
        accessManager.revokeRole(Roles.ADMIN_ROLE, user);
    }
}
