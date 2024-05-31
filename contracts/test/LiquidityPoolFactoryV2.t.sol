// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'forge-std/Test.sol';
import '../src/LiquidityPoolFactoryV2.sol';
import '../src/LiquidityPoolV2.sol';
import './mock/MockERC20.sol';

contract LiquidityPoolFactoryV2Test is Test {
    LiquidityPoolFactoryV2 factory;
    LiquidityPoolV2 liquidityPoolImplementation;
    MockERC20 tokenA;
    MockERC20 tokenB;

    address admin = address(1);
    address user = address(2);

    function setUp() public {
        // Deploy mock ERC20 tokens
        tokenA = new MockERC20();
        tokenA.initialize('Token A', 'TKA');
        tokenB = new MockERC20();
        tokenB.initialize('Token B', 'TKB');

        console.log('Admin address: %s', address(admin));

        // Deploy the liquidity pool implementation
        liquidityPoolImplementation = new LiquidityPoolV2();
        liquidityPoolImplementation.initialize(address(tokenA), address(tokenB), address(admin));

        // Deploy the factory contract
        factory = new LiquidityPoolFactoryV2();
        factory.initialize(address(liquidityPoolImplementation), address(admin));

        vm.prank(admin);
        factory.setAuthority(address(admin));
    }

    function testCreateLiquidityPool() public {
        vm.prank(admin);
        address pool = factory.createLiquidityPool(address(tokenA), address(tokenB), address(admin));

        // Verify that the pool address is stored correctly
        assertEq(factory.getPool(address(tokenA), address(tokenB)), pool);
        assertEq(factory.getPool(address(tokenB), address(tokenA)), pool);
        assertEq(factory.allPools(0), pool);
    }
}
