// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/UserRegistry.sol";

contract UserRegistryTest is Test {
    UserRegistry public userRegistry;
    address public owner;
    address public user1;
    address public user2;
    address public nonOwner;

    function setUp() public {
        userRegistry = new UserRegistry();
        owner = userRegistry.owner();
        user1 = address(0x1234);
        user2 = address(0x5678);
        nonOwner = address(0x9876);
    }
    
    // Events to log
    event UserRegistered(address indexed userAddress, uint256 userId);
    event UserBanned(address indexed userAddress, uint256 userId);
    event UserUnbanned(address indexed userAddress, uint256 userId);

    function testRegisterUser() public {
        vm.prank(user1);
        userRegistry.registerUser("Alice");

        assertEq(userRegistry.isRegisteredUser(user1), true);
        assertEq(userRegistry.getUserId(user1), 1);
    }

    function testRegisterDuplicateUser() public {
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.expectRevert("User already registered");
        userRegistry.registerUser("Alice");
        vm.stopPrank();
    }

    function testBanUser() public {
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.prank(userRegistry.owner());
        userRegistry.banUser(user1);

        assertEq(userRegistry.isUserBanned(user1), true);
    }

    function testUnbanUser() public {
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.prank(userRegistry.owner());
        userRegistry.banUser(user1);
        userRegistry.unbanUser(user1);

        assertEq(userRegistry.isUserBanned(user1), false);
    }

    function testTransferUserId() public {
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.prank(userRegistry.owner());
        userRegistry.transferUserId(user1, user2);

        assertEq(userRegistry.isRegisteredUser(user1), false);
        assertEq(userRegistry.isRegisteredUser(user2), true);
        assertEq(userRegistry.getUserId(user2), 1);
    }

    function testOwnerTransfer() public {
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.startPrank(user2);
        userRegistry.registerUser("Bob");
        vm.stopPrank();

        vm.prank(owner);
        userRegistry.transferOwnership(user1);
        assertEq(userRegistry.owner(), user1);

        vm.startPrank(user1);
        userRegistry.banUser(user2);
        vm.stopPrank();
    }

    function testEnumerableSetOperations() public {
        vm.startPrank(user1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.startPrank(user2);
        userRegistry.registerUser("Bob");
        vm.stopPrank();

        uint256[] memory userIds = userRegistry.getRegisteredUserIds();
        assertEq(userIds.length, 2);
        assertEq(userIds[0], 1);
        assertEq(userIds[1], 2);
    }

    function testEventEmissions() public {
        vm.startPrank(user1);
        expectEmitUserRegistered(user1, 1);
        userRegistry.registerUser("Alice");
        vm.stopPrank();

        vm.prank(owner);
        expectEmitUserBanned(user1, 1);
        userRegistry.banUser(user1);

        vm.prank(owner);
        expectEmitUserUnbanned(user1, 1);
        userRegistry.unbanUser(user1);
    }

    function expectEmitUserRegistered(address userAddress, uint256 userId) internal {
        // expectEmit(bool success, bool indexed, bool anonymous, bool data)
        vm.expectEmit(true, true, true, true);
        emit UserRegistered(userAddress, userId);
    }

    function expectEmitUserBanned(address userAddress, uint256 userId) internal {
        vm.expectEmit(true, true, true, true);
        emit UserBanned(userAddress, userId);
    }

    function expectEmitUserUnbanned(address userAddress, uint256 userId) internal {
        vm.expectEmit(true, true, true, true);
        emit UserUnbanned(userAddress, userId);
    }
}