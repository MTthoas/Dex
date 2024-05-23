// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/LiquidityPoolFactory.sol";
import "./mock/Token.t.sol";


contract LiquidityPoolFactoryTest is Test {
    Token token0;
    Token token1;
    Token token2;
    LiquidityPoolFactory factory;

    function setUp() public {
        token0 = new Token("Token0", "TK0");
        token1 = new Token("Token1", "TK1");
        token2 = new Token("Token2", "TK2");
        factory = new LiquidityPoolFactory();
    }

    function testCreatePool() public {
        address pool = factory.createPool(address(token0), address(token1));

        assertEq(factory.getPool(address(token0), address(token1)), pool);
        assertEq(factory.getPool(address(token1), address(token0)), pool);
        assertEq(factory.allPoolsLength(), 1);
    }

    function testCreatePoolRevertIdenticalAddresses() public {
        vm.expectRevert("IDENTICAL_ADDRESSES");
        factory.createPool(address(token0), address(token0));
    }

    function testCreatePoolRevertZeroAddress() public {
        vm.expectRevert("ZERO_ADDRESS");
        factory.createPool(address(0), address(token1));
    }

    function testCreatePoolRevertPoolExists() public {
        factory.createPool(address(token0), address(token1));
        vm.expectRevert("POOL_EXISTS");
        factory.createPool(address(token0), address(token1));
    }

    function testCreateMultiplePools() public {
        factory.createPool(address(token0), address(token1));
        factory.createPool(address(token1), address(token2));

        assertEq(factory.allPoolsLength(), 2);
        assertEq(factory.getPool(address(token0), address(token1)) != address(0), true);
        assertEq(factory.getPool(address(token1), address(token2)) != address(0), true);
    }
}
