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

    address feeTo = address(0x1234);
    uint256 feeRate = 30; // 0.3%

    function setUp() public {
        token0 = new Token("Token0", "TK0");
        token1 = new Token("Token1", "TK1");
        pool = new LiquidityPool(address(token0), address(token1), feeTo, feeRate);
    }

    function testInitialSetup() public view {
        assertEq(pool.token0(), address(token0));
        assertEq(pool.token1(), address(token1));
        assertEq(pool.feeTo(), feeTo);
        assertEq(pool.feeRate(), feeRate);
        assertEq(pool.reserve0(), 0);
        assertEq(pool.reserve1(), 0);
        assertEq(pool.totalSupply(), 0);
    }

    function testAddLiquidity() public {
        uint256 amount0 = 100 ether;
        uint256 amount1 = 200 ether;

        token0.approve(address(pool), amount0);
        token1.approve(address(pool), amount1);

        pool.addLiquidity(amount0, amount1);

        assertEq(pool.balanceOf(address(this)), Math.sqrt(amount0 * amount1));
        assertEq(pool.totalSupply(), Math.sqrt(amount0 * amount1));
        assertEq(pool.reserve0(), amount0);
        assertEq(pool.reserve1(), amount1);
    }

    function testRemoveLiquidity() public {
        uint256 amount0 = 100 ether;
        uint256 amount1 = 200 ether;

        token0.approve(address(pool), amount0);
        token1.approve(address(pool), amount1);

        pool.addLiquidity(amount0, amount1);
        uint256 liquidity = pool.balanceOf(address(this));

        pool.removeLiquidity(liquidity);

        assertEq(token0.balanceOf(address(this)), 1000000 ether);
        assertEq(token1.balanceOf(address(this)), 1000000 ether);
        assertEq(pool.totalSupply(), 0);
        assertEq(pool.reserve0(), 0);
        assertEq(pool.reserve1(), 0);
    }

    function testSwap() public {
        uint256 initialAmount0 = 100 ether; // Initial amount of token0 to add as liquidity
        uint256 initialAmount1 = 200 ether; // Initial amount of token1 to add as liquidity

        // Approve the liquidity pool contract to spend initialAmount0 of token0
        token0.approve(address(pool), initialAmount0);
        // Approve the liquidity pool contract to spend initialAmount1 of token1
        token1.approve(address(pool), initialAmount1);

        // Add liquidity to the pool with initial amounts of token0 and token1
        pool.addLiquidity(initialAmount0, initialAmount1);

        // Define the amounts to swap out from the pool
        uint256 amount0Out = 10 ether; // Amount of token0 to swap out
        uint256 amount1Out = 20 ether; // Amount of token1 to swap out

        // Perform the swap operation, taking out amount0Out of token0 and sending to the caller
        pool.swap(amount0Out, 0, address(this));
        // Perform the swap operation, taking out amount1Out of token1 and sending to the caller
        pool.swap(0, amount1Out, address(this));

        // Calculate the fees for the swaps
        uint256 fee0 = (amount0Out * feeRate) / 10000; // Fee for swapping out amount0Out
        uint256 fee1 = (amount1Out * feeRate) / 10000; // Fee for swapping out amount1Out

        // Initial balance of token0 for this contract is 1,000,000 ether
        // Subtract initial liquidity added (100 ether) and add swapped amount (10 ether) minus fee
        uint256 expectedToken0Balance = 1000000 ether - initialAmount0 + (amount0Out - fee0);

        // Initial balance of token1 for this contract is 1,000,000 ether
        // Subtract initial liquidity added (200 ether) and add swapped amount (20 ether) minus fee
        uint256 expectedToken1Balance = 1000000 ether - initialAmount1 + (amount1Out - fee1);

        // Assert the final balances of token0 and token1 in this contract after swaps
        assertEq(token0.balanceOf(address(this)), expectedToken0Balance);
        assertEq(token1.balanceOf(address(this)), expectedToken1Balance);

        // Calculate the expected reserves of token0 and token1 in the liquidity pool after swaps
        uint256 expectedReserve0 = initialAmount0 - amount0Out; // Subtract swapped amount
        uint256 expectedReserve1 = initialAmount1 - amount1Out; // Subtract swapped amount

        // Assert the final reserves of token0 and token1 in the liquidity pool after swaps
        assertEq(pool.reserve0(), expectedReserve0);
        assertEq(pool.reserve1(), expectedReserve1);
    }

    function testSetFeeTo() public {
        address newFeeTo = address(0x5678);

        vm.prank(feeTo);
        pool.setFeeTo(newFeeTo);

        assertEq(pool.feeTo(), newFeeTo);
    }

    function testSetFeeRate() public {
        uint256 newFeeRate = 50; // 0.5%

        vm.prank(feeTo);
        pool.setFeeRate(newFeeRate);

        assertEq(pool.feeRate(), newFeeRate);
    }
}
