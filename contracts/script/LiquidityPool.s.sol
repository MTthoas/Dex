// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import 'forge-std/Script.sol';
import '../src/LiquidityPoolV2.sol';
import '../src/LiquidityPoolFactoryV2.sol';
import '../test/mock/MockERC20.sol';

contract DeployAndInteractWithFactory is Script {
    LiquidityPoolFactoryV2 factory;
    LiquidityPoolV2 liquidityPoolImplementation;
    MockERC20 tokenA;
    MockERC20 tokenB;
    address admin;

    function setUp() public {
        admin = vm.envAddress('ADMIN_ADDRESS');
    }

    function run() public {
        vm.startBroadcast(admin);

        // Deploy the LiquidityPoolV2 implementation contract
        liquidityPoolImplementation = new LiquidityPoolV2();
        liquidityPoolImplementation.initialize(address(1), address(1), admin); // Dummy initialization

        // Deploy the LiquidityPoolFactoryV2 contract
        factory = new LiquidityPoolFactoryV2();
        factory.initialize(address(liquidityPoolImplementation), admin);

        // Deploy mock ERC20 tokens
        tokenA = new MockERC20();
        tokenA.initialize('Token A', 'TKA');
        tokenB = new MockERC20();
        tokenB.initialize('Token B', 'TKB');

        // Mint some tokens to the admin for testing
        tokenA.mint(admin, 1000 ether);
        tokenB.mint(admin, 1000 ether);

        // Create a new liquidity pool using the factory
        address newPool = factory.createLiquidityPool(address(tokenA), address(tokenB), admin);
        console.log('New pool address:', newPool);

        // Interact with the new liquidity pool
        LiquidityPoolV2 liquidityPool = LiquidityPoolV2(newPool);

        // Add liquidity
        addLiquidity(liquidityPool, 100 ether, 100 ether);

        // Perform a swap
        performSwap(liquidityPool, address(tokenA), 10 ether, 1 ether);

        // Remove liquidity
        removeLiquidity(liquidityPool, 50 ether);

        vm.stopBroadcast();
    }

    function addLiquidity(LiquidityPoolV2 liquidityPool, uint256 tokenAAmount, uint256 tokenBAmount) internal {
        tokenA.approve(address(liquidityPool), tokenAAmount);
        tokenB.approve(address(liquidityPool), tokenBAmount);
        liquidityPool.addLiquidity(tokenAAmount, tokenBAmount);
    }

    function performSwap(
        LiquidityPoolV2 liquidityPool,
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    ) internal {
        ERC20Upgradeable(tokenIn).approve(address(liquidityPool), amountIn);
        liquidityPool.swap(tokenIn, amountIn, minAmountOut, admin);
    }

    function removeLiquidity(LiquidityPoolV2 liquidityPool, uint256 liquidityTokens) internal {
        liquidityPool.removeLiquidity(liquidityTokens);
    }
}
