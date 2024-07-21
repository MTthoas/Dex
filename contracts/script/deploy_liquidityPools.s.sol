// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/Test.sol";
import "../src/token/Token.sol";
import "../src/token/LiquidityPoolToken.sol";
import "../src/LiquidityPool.sol";
import "../src/LiquidityPoolFactory.sol";

contract LiquidityPoolTest is Script, Test {
    Token tokenA;
    Token tokenB;
    LiquidityPoolFactory factory;
    address admin;
    address admin2;
    address admin3;

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
        admin2 = vm.envAddress("ADMIN_ADDRESS2");
        admin3 = vm.envAddress("ADMIN_ADDRESS3");
    }

    function run() external {
        vm.startBroadcast(admin);

        tokenA = new Token("GENX", "GENX", 10000000 * 10 ** 18);
        tokenB = new Token("GENS", "GENS", 10000000 * 10 ** 18);

        // Deploy factory
        factory = new LiquidityPoolFactory(address(new LiquidityToken()), admin, admin2, admin3);

        // Create liquidity pool via factory
        address poolAddress = factory.createPool(address(tokenA), address(tokenB), admin, 30, admin2, admin3);
        LiquidityPool liquidityPool = LiquidityPool(poolAddress);

        // Mint tokens to admin
        tokenA.mint(admin, 1000 * 10 ** 18);
        tokenB.mint(admin, 1000 * 10 ** 18);

        tokenA.approve(address(liquidityPool), 1000 * 10 ** 18);
        tokenB.approve(address(liquidityPool), 1000 * 10 ** 18);

        liquidityPool.addLiquidity(500 * 10 ** 18, 500 * 10 ** 18);

        vm.stopBroadcast();

        // Call the remove liquidity test function
        testRemoveLiquidity(liquidityPool);
    }

    function testRemoveLiquidity(LiquidityPool liquidityPool) public {
        vm.startPrank(admin);

        // Get initial balances before removal
        uint256 initialBalanceA = tokenA.balanceOf(admin);
        uint256 initialBalanceB = tokenB.balanceOf(admin);
        uint256 initialLiquidityBalance = liquidityPool.liquidityToken().balanceOf(admin);

        console.log("Initial admin balance of TokenA: ", initialBalanceA);
        console.log("Initial admin balance of TokenB: ", initialBalanceB);
        console.log("Initial admin liquidity tokens: ", initialLiquidityBalance);

        // Verify user's total liquidity info
        (uint256 totalLiquidity, uint256 totalTokenA, uint256 totalTokenB, uint256 timeRemaining) = liquidityPool
            .getUserLiquidityInfo(admin);
        console.log("User's total liquidity tokens: ", totalLiquidity);
        console.log("User's total TokenA deposited: ", totalTokenA);
        console.log("User's total TokenB deposited: ", totalTokenB);
        console.log("Time remaining to add/remove liquidity: ", timeRemaining);

        // Attempt to remove liquidity before 2 hours have passed
        uint256 liquidityToRemove = initialLiquidityBalance / 2; // Remove half the liquidity
        try liquidityPool.removeLiquidity(totalTokenA / 2, totalTokenB / 2) {
            revert("User was able to remove liquidity before 2 hours");
        } catch Error(string memory reason) {
            console.log("User was unable to remove liquidity before 2 hours: ", reason);
        }

        // Fast forward time by 2 hours
        vm.warp(block.timestamp + 2 hours);

        // Get the current liquidity info before removal
        (totalLiquidity, totalTokenA, totalTokenB, ) = liquidityPool.getUserLiquidityInfo(admin);

        // Reserves
        (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        console.log("Reserves before removal - TokenA: ", reserveA, " TokenB: ", reserveB);

        // Calculate the amounts to remove
        uint256 amountTokenAtoRemove = totalTokenA / 2;
        uint256 amountTokenBtoRemove = totalTokenB / 2;

        // Remove liquidity after 2 hours
        liquidityPool.removeLiquidity(amountTokenAtoRemove, amountTokenBtoRemove);

        // Get balances after removal
        uint256 finalBalanceA = tokenA.balanceOf(admin);
        uint256 finalBalanceB = tokenB.balanceOf(admin);
        uint256 finalLiquidityBalance = liquidityPool.liquidityToken().balanceOf(admin);

        console.log("Final admin balance of TokenA: ", finalBalanceA);
        console.log("Final admin balance of TokenB: ", finalBalanceB);
        console.log("Final admin liquidity tokens: ", finalLiquidityBalance);

        // Verify user's total liquidity info after removal
        (totalLiquidity, totalTokenA, totalTokenB, timeRemaining) = liquidityPool.getUserLiquidityInfo(admin);
        console.log("User's total liquidity tokens after removal: ", totalLiquidity);
        console.log("User's total TokenA deposited after removal: ", totalTokenA);
        console.log("User's total TokenB deposited after removal: ", totalTokenB);
        console.log("Time remaining to add/remove liquidity: ", timeRemaining);

        // // // Get reserves after removal
        // (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        // console.log("Reserves after removal - TokenA: ", reserveA, " TokenB: ", reserveB);

        vm.stopPrank();
    }
}
