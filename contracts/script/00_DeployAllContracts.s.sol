// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseScript} from "./utils/Base.s.sol";
import {AccessManagerHelpers} from "./utils/AccessManagerHelpers.s.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/access/manager/AccessManager.sol";
import "../src/libraries/Roles.sol";

import "../src/LiquidityPoolFactory.sol";
import "../src/LiquidityPool.sol";

contract DeployAllContractsScript is BaseScript, AccessManagerHelpers {
    /// @dev Instance of contracts
    AccessManager manager;
    LiquidityPoolV2 liquidityPool;
    LiquidityPoolFactoryV2 liquidityPoolFactory;

    address private testRes;
    bool private forTest;

    function run() public broadcast {
        if (forTest) {
            manager = new AccessManager(broadcaster);
            console.log(
                "AccessManager instance deployed at",
                address(manager),
                "with the next temporary super admin",
                broadcaster
            );
            testRes = address(manager);
        } else {
            manager = new AccessManager(broadcaster);
            liquidityPool = new LiquidityPoolV2();
            liquidityPoolFactory = new LiquidityPoolFactoryV2();
            liquidityPoolFactory.initialize(address(liquidityPool), msg.sender);

            console.log("AccessManager instance deployed at", address(manager), "with super admin", broadcaster);
            console.log("LiquidityPoolFactory instance deployed at", address(liquidityPoolFactory));
            console.log("LiquidityPool instance deployed at", address(liquidityPool));
        }
    }

    function deployForTest(address _deployer) public returns (address _testRes) {
        forTest = true;
        broadcaster = _deployer;
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
