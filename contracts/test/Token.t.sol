// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../src/Token.sol";

contract TokenTest is Test {
    Token token;
    address user1;
    address user2;
    address user3;
    uint256 initialSupply = 1000 * 10**10;

    function setUp() public {
        token = new Token(initialSupply);
        user1 = address(0x1);
        user2 = address(0x2);
        user3 = address(0x3);

        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
        vm.deal(user3, 100 ether);

        token.transfer(user1, 100 * 10**10);
    }

    function testInitialSupply() public view {
        assertEq(token.totalSupply(), initialSupply);
    }

    function testBalanceOf() public view {
        assertEq(token.balanceOf(address(this)), 900 * 10**10);
        assertEq(token.balanceOf(user1), 100 * 10**10);
    }

    function testTransfer() public {
        vm.startPrank(user1);
        token.transfer(user2, 50 * 10**10);
        vm.stopPrank();

        assertEq(token.balanceOf(user1), 50 * 10**10);
        assertEq(token.balanceOf(user2), 50 * 10**10);
    }

    function testTransferFailure() public {
        vm.startPrank(user1);
        vm.expectRevert(abi.encodePacked("ERC20: transfer amount exceeds balance"));
        token.transfer(user2, 200 * 10**10);
        vm.stopPrank();
    }

    function testApproveAndTransferFrom() public {
        vm.startPrank(user1);
        token.approve(user2, 50 * 10**10);
        vm.stopPrank();

        vm.startPrank(user2);
        token.transferFrom(user1, user3, 50 * 10**10);
        vm.stopPrank();

        assertEq(token.balanceOf(user1), 50 * 10**10);
        assertEq(token.balanceOf(user3), 50 * 10**10);
    }

    function testBuyToken() public {
        vm.startPrank(user2);
        token.buyToken{value: 1 ether}();
        vm.stopPrank();

        // Si le prix du jeton est de 1 et que les décimales sont 10, alors 1 ether achète 1 * 10**18 jetons
        assertEq(token.balanceOf(user2), 1 * 10**18);
    }

    function testBuyTokenFailure() public {
        vm.startPrank(user2);
        vm.expectRevert(abi.encodePacked("ETH amount must be greater than 0"));
        token.buyToken{value: 0 ether}();
        vm.stopPrank();
    }

    function testSellToken() public {
        uint256 initialuser2Balance = user2.balance;

        vm.startPrank(user2);
        token.buyToken{value: 1 ether}();
        token.sellToken(1 * 10**18);
        vm.stopPrank();

        assertEq(token.balanceOf(user2), 0);
        assertEq(user2.balance, initialuser2Balance);
    }

    function testSellTokenFailure() public {
        vm.startPrank(user2);
        vm.expectRevert(abi.encodePacked("ERC20: burn amount exceeds balance"));
        token.sellToken(1 * 10**10);
        vm.stopPrank();
    }
}