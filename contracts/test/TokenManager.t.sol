// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/TokenManager.sol";
import "./mock/MockERC20.sol";

contract TokenManagerTest is Test {
    TokenManager public tokenManager;
    MockERC20 public token1;
    MockERC20 public token2;

    function setUp() public {
        tokenManager = new TokenManager(address(this));
        token1 = new MockERC20("Token 1", "TKN1");
        token2 = new MockERC20("Token 2", "TKN2");
    }

    function testListToken() public {
        tokenManager.listToken(address(token1), "Token 1", "TKN1", 18);
        (string memory name, string memory symbol, uint8 decimals) = tokenManager.getTokenInfo(address(token1));
        assertEq(name, "Token 1");
        assertEq(symbol, "TKN1");
        assertEq(decimals, 18);
    }

    function testListTokenTwice() public {
        tokenManager.listToken(address(token1), "Token 1", "TKN1", 18);
        vm.expectRevert("Token already listed");
        tokenManager.listToken(address(token1), "Token 1", "TKN1", 18);
    }

    function testListTokenWithInvalidAddress() public {
        vm.expectRevert("Invalid token address");
        tokenManager.listToken(address(0), "Token 1", "TKN1", 18);
    }

    function testDelistToken() public {
        tokenManager.listToken(address(token1), "Token 1", "TKN1", 18);
        tokenManager.delistToken(address(token1));
        vm.expectRevert("Token not listed");
        tokenManager.getTokenInfo(address(token1));
    }

    function testDelistTokenNotListed() public {
        vm.expectRevert("Token not listed");
        tokenManager.delistToken(address(token1));
    }

    function testGetListedTokens() public {
        tokenManager.listToken(address(token1), "Token 1", "TKN1", 18);
        tokenManager.listToken(address(token2), "Token 2", "TKN2", 18);
        address[] memory listedTokens = tokenManager.getListedTokens();
        assertEq(listedTokens.length, 2);
        assertEq(listedTokens[0], address(token1));
        assertEq(listedTokens[1], address(token2));
    }
}