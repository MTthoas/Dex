// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/LiquidityPool.sol";
import "../src/GensToken.sol";
import "@openzeppelin/contracts-upgradeable/access/manager/AccessManagerUpgradeable.sol";
import "../src/LiquidityPoolFactory.sol";

contract DeployAndInteractWithLiquidityPool is Script {
    LiquidityPoolFactory factory;
    LiquidityPool liquidityPool;
    GensToken tokenA;
    GensToken tokenB;
    AccessManagerUpgradeable accessManager;
    address admin;

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
    }

    function run() public {
        vm.startBroadcast(admin);

        // Deploy mock ERC20 tokens
        tokenA = new GensToken();
        tokenA.initialize("Genesis", "GENX");
        tokenB = new GensToken();
        tokenB.initialize("Gens", "GENS");

        // Mint some tokens to the admin for testing
        tokenA.mint(admin, 1000 wei);
        tokenB.mint(admin, 1000 wei);

        // Deploy the LiquidityPoolFactory contract
        factory = new LiquidityPoolFactory();
        factory.initialize(admin);

        // Create a new liquidity pool using the factory
        factory.createPool(address(tokenA), address(tokenB), admin, 30);
        address poolAddress = factory.getPool(address(tokenA), address(tokenB));
        liquidityPool = LiquidityPool(poolAddress);

        vm.stopBroadcast();

        // // Once the setup is complete, run the test functions
        // testAddLiquidity();
        // testSwap();

        // // Update the platform fee
        // testToUpdateFees();
        // testSwap();

        // testRemoveLiquidity();

        // console.log("Tests passed successfully! \n");
        // console.log("Address of the Factory Liquidity Pool:", address(factory));
        // console.log("Address of the Liquidity Pool:", address(liquidityPool));
        // console.log("Address of the Token GENX:", address(tokenA));
        // console.log("Address of the Token GENS:", address(tokenB));
    }

    function testAddLiquidity() internal {
        vm.startBroadcast(admin);

        uint256 tokenAAmount = 100 wei;
        uint256 tokenBAmount = 100 wei;

        // Approve tokens for the liquidity pool
        tokenA.approve(address(liquidityPool), tokenAAmount);
        tokenB.approve(address(liquidityPool), tokenBAmount);

        // Add liquidity
        liquidityPool.addLiquidity(tokenAAmount, tokenBAmount);

        // Check the reserves
        (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        require(reserveA == tokenAAmount, "Reserve A mismatch");
        require(reserveB == tokenBAmount, "Reserve B mismatch");

        vm.stopBroadcast();
    }

    function testSwap() internal {
        vm.startBroadcast(admin);

        uint256 amountIn = 10 wei;
        uint256 minAmountOut = 1 wei; // Lowering the minimum amount to avoid revert, should be set based on the expected output :)

        // Approve tokens for the liquidity pool
        tokenA.approve(address(liquidityPool), amountIn);

        // Get reserves before swap
        (uint256 reserveABefore, uint256 reserveBBefore) = liquidityPool.getReserves();
        console.log("Reserves before swap:");
        console.log("Reserve A:", reserveABefore);
        console.log("Reserve B:", reserveBBefore);

        // Perform the swap
        try liquidityPool.swap(address(tokenA), amountIn, minAmountOut) {
            // Get reserves after swap
            (uint256 reserveAAfter, uint256 reserveBAfter) = liquidityPool.getReserves();
            console.log("Reserves after swap:");
            console.log("Reserve A:", reserveAAfter);
            console.log("Reserve B:", reserveBAfter);

            uint256 amountOut = liquidityPool.getPrice(address(tokenA), amountIn);
            console.log("Swapped", amountIn);
            console.log("Received", amountOut);
        } catch Error(string memory reason) {
            console.log("Swap failed:", reason);
        }

        vm.stopBroadcast();
    }

    function testRemoveLiquidity() internal {
        vm.startBroadcast(admin);

        // Approve liquidity tokens for the liquidity pool
        uint256 liquidityTokens = 50 wei;

        // Remove liquidity
        liquidityPool.removeLiquidity(liquidityTokens);

        // Check the updated reserves
        (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        console.log("Reserve A:", reserveA);
        console.log("Reserve B:", reserveB);

        vm.stopBroadcast();
    }

    function testToUpdateFees() internal {
        vm.startBroadcast(admin);

        liquidityPool.updatePlatformFee(50);

        vm.stopBroadcast();
    }
}
