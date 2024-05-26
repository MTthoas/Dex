// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/GensToken.sol";
import "../src/LiquidityPoolFactory.sol";

contract DeployContracts is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy GensToken
        GensToken gensTokenInstance = new GensToken();
        console.log("GensToken instance deployed at", address(gensTokenInstance));

        // Deploy LiquidityPoolFactory
        LiquidityPoolFactory factory = new LiquidityPoolFactory(msg.sender, 300); // temporary feeTo and feeRate
        console.log("LiquidityPoolFactory deployed at:", address(factory));

        vm.stopBroadcast();
    }
}
