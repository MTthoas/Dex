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

    address feeTo;
    uint256 feeRate;

    function setUp() public {
        token0 = new Token("Token0", "TK0");
        token1 = new Token("Token1", "TK1");
        feeTo = address(this);
        feeRate = 30;
        pool = new LiquidityPool(address(token0), address(token1), feeTo, feeRate);
    }

    function testAddLiquidity() public {
        uint256 amount0 = 1000 * 10 ** token0.decimals();
        uint256 amount1 = 1000 * 10 ** token1.decimals();

        token0.approve(address(pool), amount0);
        token1.approve(address(pool), amount1);

        pool.addLiquidity(amount0, amount1);

        assertEq(pool.balanceOf(address(this)), Math.sqrt(amount0 * amount1));
        assertEq(pool.totalSupply(), Math.sqrt(amount0 * amount1));
        assertEq(token0.balanceOf(address(pool)), amount0);
        assertEq(token1.balanceOf(address(pool)), amount1);
    }

    function testRemoveLiquidity() public {
        uint256 amount0 = 1000 * 10 ** token0.decimals();
        uint256 amount1 = 1000 * 10 ** token1.decimals();

        token0.approve(address(pool), amount0);
        token1.approve(address(pool), amount1);

        pool.addLiquidity(amount0, amount1);

        uint256 liquidity = pool.balanceOf(address(this));

        pool.removeLiquidity(liquidity);

        assertEq(pool.balanceOf(address(this)), 0);
        assertEq(pool.totalSupply(), 0);
        assertEq(token0.balanceOf(address(this)), amount0);
        assertEq(token1.balanceOf(address(this)), amount1);
    }

    function testSwap() public {
        uint256 amount0 = 1000 * 10 ** token0.decimals();
        uint256 amount1 = 1000 * 10 ** token1.decimals();

        token0.approve(address(pool), amount0);
        token1.approve(address(pool), amount1);

        pool.addLiquidity(amount0, amount1);

        uint256 amount0Out = 100 * 10 ** token0.decimals();
        uint256 amount1Out = 50 * 10 ** token1.decimals();

        token0.transfer(address(pool), amount0Out);
        token1.transfer(address(pool), amount1Out);

        uint256 fee0 = (amount0Out * feeRate) / 10000;
        uint256 fee1 = (amount1Out * feeRate) / 10000;

        pool.swap(amount0Out - fee0, amount1Out - fee1, address(this));

        assertEq(token0.balanceOf(address(pool)), amount0 + amount0Out - fee0);
        assertEq(token1.balanceOf(address(pool)), amount1 + amount1Out - fee1);

        assertEq(token0.balanceOf(feeTo), fee0);
        assertEq(token1.balanceOf(feeTo), fee1);
    }

    function testSetFeeTo() public {
        address newFeeTo = address(0x123);
        pool.setFeeTo(newFeeTo);
        assertEq(pool.feeTo(), newFeeTo);
    }

    function testSetFeeRate() public {
        uint256 newFeeRate = 50;
        pool.setFeeRate(newFeeRate);
        assertEq(pool.feeRate(), newFeeRate);
    }

    function testSetFeeRateTooHigh() public {
        vm.expectRevert("FEE_RATE_TOO_HIGH");
        pool.setFeeRate(1001);
    }
}
