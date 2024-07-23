// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../../src/token/Token.sol";
import "../../src/token/LiquidityPoolToken.sol";
import "../../src/LiquidityPool.sol";
import "../../src/LiquidityPoolFactory.sol";

contract SwapTest is Script {
    Token tokenA;
    Token tokenB;
    LiquidityToken liquidityToken;
    LiquidityPool liquidityPool;
    address admin;
    address admin2;
    address admin3;
    address user = address(0x2);

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
        admin2 = vm.envAddress("ADMIN_ADDRESS2");
        admin3 = vm.envAddress("ADMIN_ADDRESS3");
    }

    function run() external {
        vm.startBroadcast(admin);

        tokenA = new Token("TokenA", "TKA", 10000000 * 10 ** 18);
        tokenB = new Token("TokenB", "TKB", 10000000 * 10 ** 18);
        liquidityToken = new LiquidityToken();
        liquidityPool = new LiquidityPool(
            address(tokenA),
            address(tokenB),
            address(liquidityToken),
            30,
            10, // Setting a low minimum liquidity to avoid the initial liquidity error
            admin,
            admin2,
            admin3
        );

        // Mint tokens to user
        tokenA.mint(user, 1000 * 10 ** 18);
        tokenB.mint(user, 1000 * 10 ** 18);

        // Broadcast approvals from user
        tokenA.approve(address(liquidityPool), 1000 * 10 ** 18);
        tokenB.approve(address(liquidityPool), 1000 * 10 ** 18);

        // Add initial liquidity
        liquidityPool.addLiquidity(500 * 10 ** 18, 500 * 10 ** 18);

        vm.stopBroadcast();

        // Call the swap test function
        testSwap();
    }

    function testSwap() public {
        vm.startPrank(user);

        // Approve tokenA for swap
        tokenA.approve(address(liquidityPool), 100 * 10 ** 18);

        // Get initial reserves before swap
        (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        console.log("Initial reserves - TokenA: ", reserveA, " TokenB: ", reserveB);

        // Perform the swap
        uint256 amountIn = 100 * 10 ** 18;
        uint256 minAmountOut = liquidityPool.getAmountOut(amountIn, address(tokenA));
        liquidityPool.swap(address(tokenA), amountIn, minAmountOut);

        // Get reserves after swap
        (reserveA, reserveB) = liquidityPool.getReserves();
        console.log("Reserves after swap - TokenA: ", reserveA, " TokenB: ", reserveB);

        // Check the user's balance of tokenB after swap
        uint256 userBalanceB = tokenB.balanceOf(user);
        console.log("User's balance of TokenB after swap: ", userBalanceB);

        vm.stopPrank();
    }
}
