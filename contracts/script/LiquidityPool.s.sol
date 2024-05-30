// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'forge-std/Script.sol';
import '../src/LiquidityPoolV2.sol';
import '../test/mock/MockERC20.sol';
import '@openzeppelin/contracts-upgradeable/access/manager/AccessManagerUpgradeable.sol';
import '../src/LiquidityPoolFactoryV2.sol';

contract DeployAndInteractWithLiquidityPool is Script {
    LiquidityPoolFactory factory;
    LiquidityPoolV2 liquidityPool;
    MockERC20 tokenA;
    MockERC20 tokenB;
    AccessManagerUpgradeable accessManager;
    address admin;

    function setUp() public {
        admin = vm.envAddress('ADMIN_ADDRESS');
    }

    function run() public {
        vm.startBroadcast(admin);

        // Deploy the AccessManager contract
        accessManager = new AccessManagerUpgradeable();
        accessManager.initialize(admin);

        // Deploy mock ERC20 tokens
        tokenA = new MockERC20();
        tokenA.initialize('Token A', 'TKA');
        tokenB = new MockERC20();
        tokenB.initialize('Token B', 'TKB');

        // Mint some tokens to the admin for testing
        tokenA.mint(admin, 1000 wei);
        tokenB.mint(admin, 1000 wei);

        // Deploy the LiquidityPoolFactory contract
        factory = new LiquidityPoolFactory();
        factory.initialize(address(accessManager));

        // Grant necessary permissions to the admin
        accessManager.grantRole(accessManager.ADMIN_ROLE(), admin, 0);
        accessManager.grantRole(1, admin, 0); // Assuming 1 is the roleId for liquidity operations

        // Create a new liquidity pool using the factory
        factory.createPool(address(tokenA), address(tokenB), address(accessManager));
        address poolAddress = factory.getPool(address(tokenA), address(tokenB));
        liquidityPool = LiquidityPoolV2(poolAddress);

        // Grant the liquidity operation role to the admin for the new pool
        accessManager.grantRole(1, admin, 0); // Assuming 1 is the roleId for liquidity operations

        // Set the function roles for the LiquidityPoolV2 contract
        bytes4[] memory selectors = new bytes4[](3);
        selectors[0] = liquidityPool.addLiquidity.selector; // Assuming 1 is the roleId for liquidity operations
        selectors[1] = liquidityPool.removeLiquidity.selector; // Assuming 1 is the roleId for liquidity operations
        selectors[2] = liquidityPool.swap.selector; // Assuming 1 is the roleId for liquidity operations

        // Set the target function role for the LiquidityPoolV2 contract, setTargetFunctionRole is a function in AccessManagerUpgradeable contract that allows to set the role for a specific function in a contract
        accessManager.setTargetFunctionRole(address(liquidityPool), selectors, 1);

        vm.stopBroadcast();

        // Once the setup is complete, run the test functions
        testAddLiquidity();
        testSwap();
        testRemoveLiquidity();
    }

    function testAddLiquidity() internal {
        vm.startBroadcast(admin);

        uint256 tokenAAmount = 100 wei;
        uint256 tokenBAmount = 100 wei;

        // Approve tokens for the liquidity pool
        tokenA.approve(address(liquidityPool), tokenAAmount);
        tokenB.approve(address(liquidityPool), tokenBAmount);

        // Add liquidity
        liquidityPool.addLiquidity(tokenAAmount, tokenBAmount);

        // Check the reserves
        (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        require(reserveA == tokenAAmount, 'Reserve A mismatch');
        require(reserveB == tokenBAmount, 'Reserve B mismatch');

        vm.stopBroadcast();
    }

    function testSwap() internal {
        vm.startBroadcast(admin);

        uint256 amountIn = 10 wei;
        uint256 minAmountOut = 1 wei; // Lowering the minimum amount to avoid revert, should be set based on the expected output :)

        // Approve tokens for the liquidity pool
        tokenA.approve(address(liquidityPool), amountIn);

        // Get reserves before swap
        (uint256 reserveABefore, uint256 reserveBBefore) = liquidityPool.getReserves();
        console.log('Reserves before swap:');
        console.log('Reserve A:', reserveABefore);
        console.log('Reserve B:', reserveBBefore);

        // Perform the swap
        try liquidityPool.swap(address(tokenA), amountIn, minAmountOut, admin) {
            // Get reserves after swap
            (uint256 reserveAAfter, uint256 reserveBAfter) = liquidityPool.getReserves();
            console.log('Reserves after swap:');
            console.log('Reserve A:', reserveAAfter);
            console.log('Reserve B:', reserveBAfter);

            console.log('Swapped', amountIn);
            console.log('Received', minAmountOut);
        } catch Error(string memory reason) {
            console.log('Swap failed:', reason);
        }

        vm.stopBroadcast();
    }

    function testRemoveLiquidity() internal {
        vm.startBroadcast(admin);

        // Approve liquidity tokens for the liquidity pool
        uint256 liquidityTokens = 50 wei;

        // Remove liquidity
        liquidityPool.removeLiquidity(liquidityTokens);

        // Check the updated reserves
        (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        console.log('Reserve A:', reserveA);
        console.log('Reserve B:', reserveB);

        vm.stopBroadcast();
    }
}
