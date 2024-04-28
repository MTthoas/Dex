// test/LiquidityPoolFactory.t.sol

pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/LiquidityPoolFactory.sol";
import "../src/GensToken.sol";

contract LiquidityPoolFactoryTest is Test {
    LiquidityPoolFactory factory;
    GensToken gensToken;

    function setUp() public {
        gensToken = new GensToken();
        factory = new LiquidityPoolFactory(address(gensToken));
    }

    function testCreateLiquidityPool() public {
        factory.createLiquidityPool();
        assertEq(factory.getNumberOfPools(), 1, "One pool should be created");

        address createdPoolAddress = factory.allPools(0);
        assertTrue(
            createdPoolAddress != address(0),
            "Pool address should be valid"
        );
    }

    function testCreateMultipleLiquidityPools() public {
        factory.createLiquidityPool();
        factory.createLiquidityPool();
        factory.createLiquidityPool();
        assertEq(
            factory.getNumberOfPools(),
            3,
            "Three pools should be created"
        );
    }

    function testGetPoolAddress() public {
        factory.createLiquidityPool();
        address createdPoolAddress = factory.getPoolAddress(0);
        assertTrue(
            createdPoolAddress != address(0),
            "Pool address should be valid"
        );
    }
}
