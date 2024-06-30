// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/token/Token.sol";
import "../src/token/LiquidityPoolToken.sol";
import "../src/LiquidityPool.sol";

contract LiquidityPoolTest is Test {
    Token tokenA;
    Token tokenB;
    LiquidityToken liquidityToken;
    LiquidityPool liquidityPool;
    address owner = address(0x123);
    address addr1 = address(0x456);
    address addr2 = address(0x789);

    function setUp() public {
        tokenA = new Token("TokenA", "TKA");
        tokenB = new Token("TokenB", "TKB");
        liquidityToken = new LiquidityToken();

        liquidityPool = new LiquidityPool(owner);

        // Ensure the owner calls the initialize function
        vm.prank(owner);
        liquidityPool.initialize(address(tokenA), address(tokenB), address(liquidityToken), 30, 10);

        // Mint and approve tokens
        tokenA.mint(addr1, 1000 ether);
        tokenB.mint(addr1, 1000 ether);
        vm.prank(addr1);
        tokenA.approve(address(liquidityPool), 1000 ether);
        vm.prank(addr1);
        tokenB.approve(address(liquidityPool), 1000 ether);

        tokenA.mint(addr2, 1000 ether);
        tokenB.mint(addr2, 1000 ether);
        vm.prank(addr2);
        tokenA.approve(address(liquidityPool), 1000 ether);
        vm.prank(addr2);
        tokenB.approve(address(liquidityPool), 1000 ether);
    }

    function testDeployment() public {
        assertEq(liquidityPool.owner(), owner);
        assertEq(address(liquidityPool.tokenA()), address(tokenA));
        assertEq(address(liquidityPool.tokenB()), address(tokenB));
        assertEq(address(liquidityPool.liquidityToken()), address(liquidityToken));
    }

    function testAddLiquidity() public {
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        assertEq(tokenA.balanceOf(address(liquidityPool)), 100 ether);
        assertEq(tokenB.balanceOf(address(liquidityPool)), 100 ether);
    }

    function testRemoveLiquidity() public {
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        vm.prank(addr1);
        liquidityPool.removeLiquidity(10 ether);

        uint256 expectedTokenABalance = 90 ether;
        uint256 expectedTokenBBalance = 90 ether;
        uint256 actualTokenABalance = tokenA.balanceOf(address(liquidityPool));
        uint256 actualTokenBBalance = tokenB.balanceOf(address(liquidityPool));

        // Allow a small margin of error
        uint256 tolerance = 1 wei;

        assertTrue(
            actualTokenABalance >= expectedTokenABalance - tolerance &&
                actualTokenABalance <= expectedTokenABalance + tolerance,
            string(abi.encodePacked("Token A balance mismatch: ", actualTokenABalance))
        );

        assertTrue(
            actualTokenBBalance >= expectedTokenBBalance - tolerance &&
                actualTokenBBalance <= expectedTokenBBalance + tolerance,
            string(abi.encodePacked("Token B balance mismatch: ", actualTokenBBalance))
        );
    }

    function testSwap() public {
        vm.prank(addr1);
        liquidityPool.addLiquidity(100 ether, 100 ether);

        vm.prank(addr2);
        liquidityPool.swap(address(tokenA), 10 ether, 1);

        assertGt(tokenB.balanceOf(addr2), 0);
    }
}
