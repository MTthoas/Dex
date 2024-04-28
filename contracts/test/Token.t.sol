// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "ds-test/test.sol";
import "../src/Token.sol";

contract TokenTest is DSTest {
    Token token;
    address deployer;

    function setUp() public {
        deployer = address(this);
        token = new Token(1000); 
    }

    function testInitialBalance() public {
        assertEq(token.balanceOf(deployer), 1000);
    }

    function testTransfer() public {
        token.transfer(address(1), 100);
        assertEq(token.balanceOf(address(1)), 100);
    }

}
