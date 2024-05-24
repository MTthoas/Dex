// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/GensToken.sol";

contract GensTokenTest is Test {
    GensToken gensToken;

    function setUp() public {
        gensToken = new GensToken();
    }

    function testInitialMint() public view {
        // Test that all tokens are minted to the deployer (address(this) in tests)
        uint256 expectedSupply = 1_000_000_000 * 10 ** gensToken.decimals();
        assertEq(gensToken.balanceOf(address(this)), expectedSupply, "Initial minting failed");
    }

    function testSymbol() public view {
        assertEq(gensToken.symbol(), "GEN", "Symbol is incorrect");
    }

    function testName() public view {
        assertEq(gensToken.name(), "Geness", "Name is incorrect");
    }

    function testDecimals() public view {
        assertEq(gensToken.decimals(), 18, "Decimals is incorrect");
    }
}
