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
    address admin1 = address(0x456);
    address admin2 = address(0x789);
    address addr1 = address(0x234);
    address addr2 = address(0x567);


    function setUp() public {
        tokenA = new Token("TokenA", "TKA", 10000 ether);
        tokenB = new Token("TokenB", "TKB", 10000 ether);
        vm.prank(owner);
        liquidityToken = new LiquidityToken();
        vm.prank(owner);
        liquidityPool = new LiquidityPool(address(tokenA), address(tokenB), address(liquidityToken), 30, 10, owner, admin1, admin2);

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

    function testDeployment() public view {
        assertEq(liquidityPool.platformFee(), 30);
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
            actualTokenABalance >= expectedTokenABalance - tolerance
                && actualTokenABalance <= expectedTokenABalance + tolerance,
            string(abi.encodePacked("Token A balance mismatch: ", actualTokenABalance))
        );

        assertTrue(
            actualTokenBBalance >= expectedTokenBBalance - tolerance
                && actualTokenBBalance <= expectedTokenBBalance + tolerance,
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

    function testGrantRole() public {
        vm.prank(owner);
        liquidityPool.grantRole(keccak256("ADMIN_ROLE"), addr1);
        assertTrue(liquidityPool.hasRole(keccak256("ADMIN_ROLE"), addr1));

        assertEq(liquidityPool.platformFee(), 30);
        vm.prank(addr1);
        liquidityPool.updatePlatformFee(20);
        assertEq(liquidityPool.platformFee(), 20);

        vm.prank(owner);
        liquidityPool.revokeRole(keccak256("ADMIN_ROLE"), addr1);
        assertTrue(!liquidityPool.hasRole(keccak256("ADMIN_ROLE"), addr1));
    }
}
