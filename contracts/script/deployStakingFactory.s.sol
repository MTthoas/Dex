// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/StakingFactory.sol";

contract DeployStakingFactory is Script {
    function run() external {
        vm.startBroadcast();
        StakingFactory factory = new StakingFactory();
        vm.stopBroadcast();

        console.log("StakingFactory deployed to:", address(factory));
    }
}
