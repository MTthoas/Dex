// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../src/Token.sol";

contract TokenTest is Test {
    Token token;
    address alice;
    address bob;
    address charlie;
    uint256 initialSupply = 1000 * 10**10;

    function setUp() public {
        token = new Token(initialSupply);
        alice = address(0x1);
        bob = address(0x2);
        charlie = address(0x3);

        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(charlie, 100 ether);

        token.transfer(alice, 100 * 10**10);
    }

    function testInitialSupply() public view {
        assertEq(token.totalSupply(), initialSupply);
    }

    function testBalanceOf() public view {
        assertEq(token.balanceOf(address(this)), 900 * 10**10);
        assertEq(token.balanceOf(alice), 100 * 10**10);
    }

    function testTransfer() public {
        vm.startPrank(alice);
        token.transfer(bob, 50 * 10**10);
        vm.stopPrank();

        assertEq(token.balanceOf(alice), 50 * 10**10);
        assertEq(token.balanceOf(bob), 50 * 10**10);
    }

    function testTransferFailure() public {
        vm.startPrank(alice);
        vm.expectRevert(abi.encodePacked("ERC20: transfer amount exceeds balance"));
        token.transfer(bob, 200 * 10**10);
        vm.stopPrank();
    }

    function testApproveAndTransferFrom() public {
        vm.startPrank(alice);
        token.approve(bob, 50 * 10**10);
        vm.stopPrank();

        vm.startPrank(bob);
        token.transferFrom(alice, charlie, 50 * 10**10);
        vm.stopPrank();

        assertEq(token.balanceOf(alice), 50 * 10**10);
        assertEq(token.balanceOf(charlie), 50 * 10**10);
    }

    function testBuyToken() public {
        vm.startPrank(bob);
        token.buyToken{value: 1 ether}();
        vm.stopPrank();

        // Si le prix du jeton est de 1 et que les décimales sont 10, alors 1 ether achète 1 * 10**18 jetons
        assertEq(token.balanceOf(bob), 1 * 10**18);
    }

    function testBuyTokenFailure() public {
        vm.startPrank(bob);
        vm.expectRevert(abi.encodePacked("ETH amount must be greater than 0"));
        token.buyToken{value: 0 ether}();
        vm.stopPrank();
    }

    function testSellToken() public {
        uint256 initialBobBalance = bob.balance;

        vm.startPrank(bob);
        token.buyToken{value: 1 ether}();
        token.sellToken(1 * 10**18); // Ajustez ce montant en fonction de la conversion correcte
        vm.stopPrank();

        assertEq(token.balanceOf(bob), 0);
        assertEq(bob.balance, initialBobBalance);
    }

    function testSellTokenFailure() public {
        vm.startPrank(bob);
        vm.expectRevert(abi.encodePacked("ERC20: burn amount exceeds balance"));
        token.sellToken(1 * 10**10);
        vm.stopPrank();
    }
}