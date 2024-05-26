// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {BaseScript} from "./utils/Base.s.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/access/manager/AccessManager.sol";

contract AccessManagerDeploymentScript is BaseScript {
    /// @dev Instance of an AccessManager
    AccessManager manager;

    address private testRes;
    bool private forTest;

    function run() public broadcast {
        manager = new AccessManager(broadcaster);
        console.log("AccessManager instance deployed at", address(manager), "with the next temporary super admin", broadcaster);
        if (forTest) {
            testRes = address(manager);
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
}
