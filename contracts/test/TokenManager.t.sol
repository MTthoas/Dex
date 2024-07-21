// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/TokenManager.sol";

contract TokenManagerTest is Test {
    TokenManager public tokenManager;
    address public admin;
    address public admin2;
    address public admin3;
    address public token1;
    address public token2;
    address public token3;

    function setUp() public {
        admin = address(0x1);
        admin2 = address(0x2);
        admin3 = address(0x3);
        token1 = address(0x4);
        token2 = address(0x5);
        token3 = address(0x6);

        vm.prank(admin);
        tokenManager = new TokenManager(admin, admin2, admin3);
    }

    function testAdminRole() public view {
        assertTrue(tokenManager.hasRole(tokenManager.DEFAULT_ADMIN_ROLE(), admin));
        assertTrue(tokenManager.hasRole(tokenManager.ADMIN_ROLE(), admin));
        assertTrue(tokenManager.hasRole(tokenManager.ADMIN_ROLE(), admin2));
        assertTrue(tokenManager.hasRole(tokenManager.ADMIN_ROLE(), admin3));
    }

    function testListToken() public {
        vm.prank(admin);
        tokenManager.listToken(token1, "Token1", "TK1", 18);

        address[] memory tokens = tokenManager.getListedTokens();
        assertEq(tokens.length, 1);
        assertEq(tokens[0], token1);

        (string memory name, string memory symbol, uint8 decimals) = tokenManager.getTokenInfo(token1);
        assertEq(name, "Token1");
        assertEq(symbol, "TK1");
        assertEq(decimals, 18);
    }

    function testDelistToken() public {
        vm.prank(admin);
        tokenManager.listToken(token1, "Token1", "TK1", 18);

        vm.prank(admin);
        tokenManager.delistToken(token1);

        address[] memory tokens = tokenManager.getListedTokens();
        assertEq(tokens.length, 0);
    }

    function testGetListedTokens() public {
        vm.prank(admin);
        tokenManager.listToken(token1, "Token1", "TK1", 18);
        vm.prank(admin);
        tokenManager.listToken(token2, "Token2", "TK2", 8);

        address[] memory tokens = tokenManager.getListedTokens();
        assertEq(tokens.length, 2);
        assertEq(tokens[0], token1);
        assertEq(tokens[1], token2);
    }

    function testGetTokenInfo() public {
        vm.prank(admin);
        tokenManager.listToken(token1, "Token1", "TK1", 18);

        (string memory name, string memory symbol, uint8 decimals) = tokenManager.getTokenInfo(token1);
        assertEq(name, "Token1");
        assertEq(symbol, "TK1");
        assertEq(decimals, 18);
    }

    function testFailListTokenAlreadyListed() public {
        vm.prank(admin);
        tokenManager.listToken(token1, "Token1", "TK1", 18);
        vm.prank(admin);
        tokenManager.listToken(token1, "Token1", "TK1", 18);
    }

    function testFailDelistUnlistedToken() public {
        vm.prank(admin);
        tokenManager.delistToken(token1);
    }

    function testFailGetTokenInfoUnlistedToken() public view {
        tokenManager.getTokenInfo(token1);
    }

    function testFailListTokenInvalidAddress() public {
        vm.prank(admin);
        tokenManager.listToken(address(0), "Token1", "TK1", 18);
    }
}