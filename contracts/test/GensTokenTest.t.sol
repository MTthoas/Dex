// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/GensToken.sol";

contract GensTokenTest is Test {
    GensToken public token;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        token = new GensToken();
        token.initialize("Genesis", "GENX");
        owner = address(this);
        user1 = address(0x123);
        user2 = address(0x456);
    }

    function testInitialize() public {
        assertEq(token.name(), "GensToken");
        assertEq(token.symbol(), "GENS");
    }

    function testMint() public {
        token.mint(owner, 1000);
        assertEq(token.balanceOf(owner), 1000);
    }

    function testMintToAnotherAddress() public {
        token.mint(user1, 500);
        assertEq(token.balanceOf(user1), 500);
    }

    function testFailMintToZeroAddress() public {
        token.mint(address(0), 1000);
    }

    function testMultipleMints() public {
        token.mint(owner, 1000);
        token.mint(owner, 2000);
        assertEq(token.balanceOf(owner), 3000);
    }

    function testTransfer() public {
        token.mint(owner, 1000);
        token.transfer(user1, 500);
        assertEq(token.balanceOf(owner), 500);
        assertEq(token.balanceOf(user1), 500);
    }

    function testFailTransferMoreThanBalance() public {
        token.mint(owner, 1000);
        token.transfer(user1, 1500);
    }

    function testApproveAndTransferFrom() public {
        token.mint(owner, 1000);
        token.approve(user1, 500);
        assertEq(token.allowance(owner, user1), 500);

        vm.prank(user1);
        token.transferFrom(owner, user2, 300);
        assertEq(token.balanceOf(owner), 700);
        assertEq(token.balanceOf(user2), 300);
        assertEq(token.allowance(owner, user1), 200);
    }

    function testFailTransferFromWithoutApproval() public {
        token.mint(owner, 1000);
        vm.prank(user1);
        token.transferFrom(owner, user2, 300);
    }
}
