// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/GensToken.sol";
import "../src/LiquidityPool.sol";
import "../src/LiquidityPoolFactory.sol";
import "../src/Staking.sol";

contract DeployContracts is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy GensToken
        GensToken gensToken = new GensToken();
        console.log("GensToken deployed at:", address(gensToken));

        // Deploy LiquidityPool (you can deploy this directly if needed)
        LiquidityPool liquidityPool = new LiquidityPool(address(gensToken));
        console.log("LiquidityPool deployed at:", address(liquidityPool));

        // Deploy LiquidityPoolFactory
        LiquidityPoolFactory liquidityPoolFactory = new LiquidityPoolFactory(address(gensToken));
        console.log("LiquidityPoolFactory deployed at:", address(liquidityPoolFactory));

        // Optionally, create a LiquidityPool through the factory
        liquidityPoolFactory.createLiquidityPool();
        console.log("LiquidityPool created via factory at index 0:", liquidityPoolFactory.allPools(0));

        vm.stopBroadcast();
    }
}
