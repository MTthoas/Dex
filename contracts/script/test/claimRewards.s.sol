// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../../src/token/Token.sol";
import "../../src/token/LiquidityPoolToken.sol";
import "../../src/LiquidityPool.sol";
import "../../src/LiquidityPoolFactory.sol";

contract LiquidityPoolTest is Script {
    Token tokenA;
    Token tokenB;
    LiquidityToken liquidityToken;
    LiquidityPool liquidityPool;
    address admin;
    address admin2;
    address admin3;
    address user = address(0x2);

    function setUp() public {
        admin = vm.envAddress("ADMIN_ADDRESS");
        admin2 = vm.envAddress("ADMIN_ADDRESS2");
        admin3 = vm.envAddress("ADMIN_ADDRESS3");
    }

    function run() external {
        vm.startBroadcast(admin);

        tokenA = new Token("TokenA", "TKA", 10000000 * 10 ** 18);
        tokenB = new Token("TokenB", "TKB", 10000000 * 10 ** 18);
        liquidityToken = new LiquidityToken();
        liquidityPool = new LiquidityPool(
            address(tokenA),
            address(tokenB),
            address(liquidityToken),
            30,
            10, // Setting a low minimum liquidity to avoid the initial liquidity error
            admin,
            admin2,
            admin3
        );

        // Mint tokens to user
        tokenA.mint(user, 1000 * 10 ** 18);
        tokenB.mint(user, 1000 * 10 ** 18);

        // Broadcast approvals from user
        tokenA.approve(address(liquidityPool), 1000 * 10 ** 18);
        tokenB.approve(address(liquidityPool), 1000 * 10 ** 18);

        vm.stopBroadcast();

        // Call test functions
        testAddAndRemoveLiquidity();
        // testRewards();
    }

    function testAddAndRemoveLiquidity() public {
        vm.startPrank(user);

        // Get balance of tokenA and tokenB
        uint256 balanceA = tokenA.balanceOf(user);
        uint256 balanceB = tokenB.balanceOf(user);

        console.log("Balance of TokenA: ", balanceA);
        console.log("Balance of TokenB: ", balanceB);

        // Approve transfer of tokens
        tokenA.approve(address(liquidityPool), 100 * 10 ** 18);
        tokenB.approve(address(liquidityPool), 100 * 10 ** 18);

        // Add liquidity
        liquidityPool.addLiquidity(100 * 10 ** 18, 100 * 10 ** 18);

        // Get reserves after adding liquidity
        (uint256 reserveA, uint256 reserveB) = liquidityPool.getReserves();
        console.log("ReserveA: ", reserveA);
        console.log("ReserveB: ", reserveB);

        // Remove liquidity
        uint256 liquidityToRemove = liquidityToken.balanceOf(user) / 2;
        liquidityPool.removeLiquidity(liquidityToRemove);

        // Get reserves after removing liquidity
        (reserveA, reserveB) = liquidityPool.getReserves();
        console.log("ReserveA after removal: ", reserveA);
        console.log("ReserveB after removal: ", reserveB);

        vm.stopPrank();
    }

    function testRewards() public {
        vm.startPrank(user);

        // Approve transfer of tokens
        tokenA.approve(address(liquidityPool), 100 * 10 ** 18);
        tokenB.approve(address(liquidityPool), 100 * 10 ** 18);

        // Add liquidity
        liquidityPool.addLiquidity(100 * 10 ** 18, 100 * 10 ** 18);

        // Get initial rewards
        uint256 initialReward = liquidityPool.calculateRewards(user);
        console.log("Initial rewards: ", initialReward);

        // Perform some actions to accumulate rewards
        // For simplicity, let's add more liquidity
        tokenA.approve(address(liquidityPool), 50 * 10 ** 18);
        tokenB.approve(address(liquidityPool), 50 * 10 ** 18);
        liquidityPool.addLiquidity(50 * 10 ** 18, 50 * 10 ** 18);

        // Get accumulated rewards
        uint256 accumulatedReward = liquidityPool.calculateRewards(user);
        console.log("Accumulated rewards: ", accumulatedReward);

        // Claim rewards
        liquidityPool.claimRewards();

        // Get rewards after claiming
        uint256 postClaimReward = liquidityPool.calculateRewards(user);
        console.log("Rewards after claiming: ", postClaimReward);

        // Verify that the rewards have been claimed correctly
        require(postClaimReward == 0, "Rewards not claimed properly");

        vm.stopPrank();
    }
}
