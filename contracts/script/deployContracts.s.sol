// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/GensToken.sol";
//import "../src/LiquidityPool.sol";
//import "../src/LiquidityPoolFactory.sol";

contract DeployContracts is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy GensToken
        GensToken gensTokenInstance = new GensToken();
        console.log("GensToken instance deployed at", address(gensTokenInstance));

        vm.stopBroadcast();
    }
}
