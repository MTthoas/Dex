// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/UserRegistry.sol";

contract UserRegistryTest is Test {
    UserRegistry public userRegistry;

    function setUp() public {
        userRegistry = new UserRegistry();
    }

    function testRegisterUser() public {
        address user1 = address(0x1234);
        vm.prank(user1);
        userRegistry.registerUser("Alice");

        assertEq(userRegistry.isRegisteredUser(user1), true);
        assertEq(userRegistry.getUserId(user1), 1);
    }

    function testRegisterDuplicateUser() public {
        address user1 = address(0x1234);
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.expectRevert("User already registered");
        userRegistry.registerUser("Alice");
        vm.stopPrank();
    }

    function testBanUser() public {
        address user1 = address(0x1234);
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.prank(userRegistry.owner());
        userRegistry.banUser(user1);

        assertEq(userRegistry.isUserBanned(user1), true);
    }

    function testUnbanUser() public {
        address user1 = address(0x1234);
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.prank(userRegistry.owner());
        userRegistry.banUser(user1);
        userRegistry.unbanUser(user1);

        assertEq(userRegistry.isUserBanned(user1), false);
    }

    function testTransferUserId() public {
        address user1 = address(0x1234);
        address user2 = address(0x5678);
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.prank(userRegistry.owner());
        userRegistry.transferUserId(user1, user2);

        assertEq(userRegistry.isRegisteredUser(user1), false);
        assertEq(userRegistry.isRegisteredUser(user2), true);
        assertEq(userRegistry.getUserId(user2), 1);
    }
}