// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/LiquidityPool.sol";
import "./mock/Token.t.sol";


contract LiquidityPoolTest is Test {
    Token token0;
    Token token1;
    LiquidityPool pool;
    address user;

    function setUp() public {
        token0 = new Token("Token0", "TK0");
        token1 = new Token("Token1", "TK1");
        pool = new LiquidityPool(address(token0), address(token1));
        user = address(0x123);

        // Fund the user with some tokens
        token0.transfer(user, 1000 * 10 ** token0.decimals());
        token1.transfer(user, 1000 * 10 ** token1.decimals());
    }

    function testAddLiquidity() public {
        uint256 amount0 = 100 * 10 ** token0.decimals();
        uint256 amount1 = 100 * 10 ** token1.decimals();

        vm.startPrank(user);
        token0.approve(address(pool), amount0);
        token1.approve(address(pool), amount1);

        uint256 liquidity = pool.addLiquidity(amount0, amount1);

        assertEq(pool.balanceOf(user), liquidity);
        assertEq(token0.balanceOf(address(pool)), amount0);
        assertEq(token1.balanceOf(address(pool)), amount1);

        vm.stopPrank();
    }

    function testRemoveLiquidity() public {
        uint256 amount0 = 100 * 10 ** token0.decimals();
        uint256 amount1 = 100 * 10 ** token1.decimals();

        vm.startPrank(user);
        token0.approve(address(pool), amount0);
        token1.approve(address(pool), amount1);

        uint256 liquidity = pool.addLiquidity(amount0, amount1);

        pool.removeLiquidity(liquidity);

        assertEq(pool.balanceOf(user), 0);
        assertEq(token0.balanceOf(address(pool)), 0);
        assertEq(token1.balanceOf(address(pool)), 0);

        vm.stopPrank();
    }

    function testSwap() public {
        uint256 amount0 = 100 * 10 ** token0.decimals();
        uint256 amount1 = 100 * 10 ** token1.decimals();

        vm.startPrank(user);
        token0.approve(address(pool), amount0);
        token1.approve(address(pool), amount1);

        pool.addLiquidity(amount0, amount1);

        uint256 swapAmount0Out = 10 * 10 ** token0.decimals();

        pool.swap(swapAmount0Out, 0, user);

        assertEq(token0.balanceOf(user), 910 * 10 ** token0.decimals());
        assertEq(token0.balanceOf(address(pool)), 90 * 10 ** token0.decimals());

        vm.stopPrank();
    }
}
