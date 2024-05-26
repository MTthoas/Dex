// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseScript} from "./utils/Base.s.sol";
import {AccessManagerHelpers} from "./utils/AccessManagerHelpers.s.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/access/manager/AccessManager.sol";
import "../src/libraries/Roles.sol";
import "../src/LiquidityPoolFactory.sol";
import "../src/UserRegistry.sol";

contract DeployAllContractsScript is BaseScript, AccessManagerHelpers {
    AccessManager accessManagerInstance;
    LiquidityPoolFactory liquidityPoolFactoryInstance;
    UserRegistry userRegistryInstance;

    address private testRes;
    bool private forTest;

    function run() public broadcast {
        if (forTest) {
            accessManagerInstance = new AccessManager(broadcaster);
            console.log(
                "AccessManager instance deployed at",
                address(accessManagerInstance),
                "with the next temporary super admin",
                broadcaster
            );
            testRes = address(accessManagerInstance);
        } else {
            console.log("---Start of the deployment---");
            accessManagerInstance = new AccessManager(broadcaster);
            console.log("AccessManager instance deployed at", address(accessManagerInstance), "with super admin", broadcaster);

            liquidityPoolFactoryInstance = new LiquidityPoolFactory(broadcaster, 300); // temporary feeTo and feeRate
            console.log("LiquidityPoolFactory instance deployed at", address(liquidityPoolFactoryInstance));

            userRegistryInstance = new UserRegistry();
            console.log("UserRegistry instance deployed at", address(userRegistryInstance));

            console.log("---End of the deployment---");
        }
    }

    function deployForTest(address _initialSuperAdmin) public returns (address _testRes) {
        forTest = true;
        broadcaster = _initialSuperAdmin;
        run();
        _testRes = testRes;
        // Reset the variables for the next test
        forTest = false;
        testRes = address(0);
        broadcaster = address(0);
    }

    // Deploy the all contracts.
    // Then Restrict functions
    // Then assign roles
}
