pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "forge-std/Test.sol";
import "../src/LiquidityPool.sol";
import "../src/GensToken.sol";

contract LiquidityPoolTest is Test {
    LiquidityPool pool;
    GensToken gensToken;

    receive() external payable {} // Without this, the contract can't receive Ether

    function setUp() public {
        gensToken = new GensToken();
        pool = new LiquidityPool(address(gensToken));
        gensToken.approve(address(pool), type(uint256).max);
    }

    function testApprovals() public view {
        uint256 approvedAmount = gensToken.allowance(address(this), address(pool));
        assertEq(approvedAmount, type(uint256).max, "Approval not set correctly");
    }

    function testAddLiquidity() public {
        uint256 gensAmount = 1_000 * 10 ** gensToken.decimals();
        uint256 ethAmount = 1 ether;

        // Log balances before transaction
        console.log("ETH Balance before:", address(this).balance);
        console.log("GENS Token Balance before:", gensToken.balanceOf(address(this)));

        // Ensure the testing account has enough Ether
        vm.deal(address(this), ethAmount);

        // Check and log Ether balance to ensure vm.deal worked
        console.log("ETH Balance after vm.deal:", address(this).balance);

        // Add liquidity
        pool.addLiquidity{value: ethAmount}(gensAmount);

        // Log balances after transaction
        console.log("ETH Balance after addLiquidity:", address(this).balance);

        // Check that the GENS token balance has decreased
        assertEq(
            gensToken.balanceOf(address(this)),
            1_000_000_000 * 10 ** gensToken.decimals() - gensAmount,
            "GENS token balance not decreased"
        );
    }

    function testRemoveLiquidity() public {
        uint256 gensAmount = 1_000 * 10 ** gensToken.decimals();
        uint256 ethAmount = 1 ether;

        // Add liquidity
        vm.deal(address(this), ethAmount);
        pool.addLiquidity{value: ethAmount}(gensAmount);

        uint256 liquidityTokens = pool.balanceOf(address(this));
        console.log("Liquidity Tokens Owned:", liquidityTokens);

        // Assuming the test wants to remove all liquidity:
        uint256 liquidityAmount = liquidityTokens; // Update this if not removing all

        console.log("ETH Balance before removeLiquidity:", address(this).balance);
        console.log("ETH Reserve before removeLiquidity:", pool.ethReserve());
        console.log("GENS Reserve before removeLiquidity:", pool.gensReserve());

        // Remove liquidity
        pool.removeLiquidity(liquidityAmount);

        console.log("ETH Balance after removeLiquidity:", address(this).balance);
        console.log("ETH Reserve after removeLiquidity:", pool.ethReserve());
        console.log("GENS Reserve after removeLiquidity:", pool.gensReserve());

        // Check that the liquidity pool balance is 0
        assertEq(pool.balanceOf(address(this)), 0, "Liquidity pool balance not 0");

        // Check that the liquidity pool reserves are 0
        assertEq(pool.ethReserve(), 0, "ETH reserve not 0");
        assertEq(pool.gensReserve(), 0, "GENS reserve not 0");

        // Check that the testing account has received the correct amount of Ether
        assertEq(address(this).balance, ethAmount, "ETH balance not as expected");

        // Check that the testing account has received the correct amount of GENS tokens
        assertEq(
            gensToken.balanceOf(address(this)),
            1_000_000_000 * 10 ** gensToken.decimals(),
            "The testing account did not receive the correct amount of GENS tokens"
        );

        // Check that the liquidity pool has the correct amount of GENS tokens
        assertEq(gensToken.balanceOf(address(pool)), 0, "The liquidity pool still has GENS tokens");

        // Check that the liquidity pool has the correct amount of Ether
        assertEq(address(pool).balance, 0, "The liquidity pool still has Ether");

        // Check that the liquidity pool has the correct amount of liquidity tokens
        assertEq(pool.totalSupply(), 0, "The liquidity pool still has liquidity tokens");
    }

    function testGetReserves() public {
        uint256 gensAmount = 1_000 * 10 ** gensToken.decimals();
        uint256 ethAmount = 1 ether;

        // Add liquidity
        vm.deal(address(this), ethAmount);
        pool.addLiquidity{value: ethAmount}(gensAmount);

        (uint256 ethReserve, uint256 gensReserve) = pool.getReserves();

        assertEq(ethReserve, ethAmount, "ETH reserve not as expected");
        assertEq(gensReserve, gensAmount, "GENS reserve not as expected");
    }
}
