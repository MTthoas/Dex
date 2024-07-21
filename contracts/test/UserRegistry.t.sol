// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/UserRegistry.sol";

contract UserRegistryTest is Test {
    UserRegistry public userRegistry;
    address public admin;
    address public admin2;
    address public admin3;
    address public user1;
    address public user2;
    address public user3;

    function setUp() public {
        admin = address(0x1);
        admin2 = address(0x2);
        admin3 = address(0x3);
        user1 = address(0x4);
        user2 = address(0x5);
        user3 = address(0x6);

        vm.prank(admin);
        userRegistry = new UserRegistry(admin, admin2, admin3);
    }

    function testAdminRole() view public {
        assertTrue(userRegistry.hasRole(userRegistry.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(userRegistry.hasRole(userRegistry.ADMIN_ROLE(), admin));
        assertTrue(userRegistry.hasRole(userRegistry.ADMIN_ROLE(), admin2));
        assertTrue(userRegistry.hasRole(userRegistry.ADMIN_ROLE(), admin3));
    }

    function testRegisterUser() public {
        vm.prank(admin);
        uint256 userId = userRegistry.registerUser("User1");
        assertEq(userId, 1);
        assertTrue(userRegistry.isRegisteredUser(admin));
        assertEq(userRegistry.getUserId(admin), 1);
        uint256[] memory userIds = userRegistry.getRegisteredUserIds();
        assertEq(userIds.length, 1);
        assertEq(userIds[0], 1);
    }

    function testBanUser() public {
        vm.prank(admin);
        userRegistry.registerUser("User1");
        vm.prank(admin);
        userRegistry.banUser(admin);
        assertTrue(userRegistry.isUserBanned(admin));
    }

    function testUnbanUser() public {
        vm.prank(admin);
        userRegistry.registerUser("User1");
        vm.prank(admin);
        userRegistry.banUser(admin);
        vm.prank(admin);
        userRegistry.unbanUser(admin);
        assertFalse(userRegistry.isUserBanned(admin));
    }

    function testTransferUserId() public {
        vm.prank(admin);
        userRegistry.registerUser("User1");
        vm.prank(admin);
        uint256 userId = userRegistry.transferUserId(admin, user1);
        assertEq(userId, 1);
        assertFalse(userRegistry.isRegisteredUser(admin));
        assertTrue(userRegistry.isRegisteredUser(user1));
        assertEq(userRegistry.getUserId(user1), 1);
    }

    function testFailRegisterAlreadyRegisteredUser() public {
        vm.prank(admin);
        userRegistry.registerUser("User1");
        vm.prank(admin);
        userRegistry.registerUser("User1");
    }

    function testFailBanUnregisteredUser() public {
        vm.prank(admin);
        userRegistry.banUser(user1);
    }

    function testFailUnbanUnregisteredUser() public {
        vm.prank(admin);
        userRegistry.unbanUser(user1);
    }

    function testFailTransferUserIdToRegisteredAddress() public {
        vm.prank(admin);
        userRegistry.registerUser("User1");
        vm.prank(admin2);
        userRegistry.registerUser("User2");
        vm.prank(admin);
        userRegistry.transferUserId(admin, admin2);
    }
}
