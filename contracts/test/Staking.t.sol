// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Staking.sol";
import "../src/token/Token.sol";

contract StakingTest is Test {
    Staking public staking;
    Token public token;
    address public admin = address(0x123);
    address public user = address(0x456);

    function setUp() public {
        token = new Token("Staking Token", "STK", 1000 ether); // Provide name, symbol, and initial supply
        staking = new Staking(address(token), admin);
        token.mint(user, 1000 ether); // Mint 1000 tokens for the user
    }

    function testInitialize() public {
        vm.prank(admin);
        staking.initialize(500 ether); // Initialize with 500 tokens in reward reserve

        bool initialized = staking.isInitialized();
        assertTrue(initialized, "Staking contract should be initialized");
    }

    function testStake() public {
        vm.prank(admin);
        staking.initialize(500 ether);

        vm.prank(user);
        token.approve(address(staking), 100 ether); // Approve 100 tokens for staking

        vm.prank(user);
        staking.stake(100 ether);

        uint256 stakedAmount = staking.getStakedAmount(user);
        assertEq(stakedAmount, 100 ether, "Staked amount should be 100 tokens");

        (uint256 totalStaked,,) = staking.getStakingStats(); // Correct access to the tuple return value
        assertEq(totalStaked, 100 ether, "Total staked amount should be 100 tokens");
    }

    function testUnstake() public {
        vm.prank(admin);
        staking.initialize(500 ether);

        vm.prank(user);
        token.approve(address(staking), 100 ether);

        vm.prank(user);
        staking.stake(100 ether);

        vm.prank(user);
        staking.unstake(50 ether);

        uint256 stakedAmount = staking.getStakedAmount(user);
        assertEq(stakedAmount, 50 ether, "Staked amount should be 50 tokens");

        (uint256 totalStaked,,) = staking.getStakingStats();
        assertEq(totalStaked, 50 ether, "Total staked amount should be 50 tokens");
    }

    function testClaimRewards() public {
        vm.prank(admin);
        staking.initialize(500 ether);

        vm.prank(user);
        token.approve(address(staking), 100 ether);

        vm.prank(user);
        staking.stake(100 ether);

        // Fast forward time by 1 day (86400 seconds)
        vm.warp(block.timestamp + 86400);

        vm.prank(user);
        staking.claimRewards();

        uint256 rewardBalance = token.balanceOf(user);
        assertGt(rewardBalance, 0, "Reward balance should be greater than 0");

        (, , uint256 rewardReserve) = staking.getStakingStats();
        assertLt(rewardReserve, 500 ether, "Reward reserve should be less than initial");
    }

    function testPendingRewards() public {
        vm.prank(admin);
        staking.initialize(500 ether);

        vm.prank(user);
        token.approve(address(staking), 100 ether);

        vm.prank(user);
        staking.stake(100 ether);

        // Fast forward time by 1 day (86400 seconds)
        vm.warp(block.timestamp + 86400);

        uint256 pendingRewards = staking.pendingRewards(user);
        assertGt(pendingRewards, 0, "Pending rewards should be greater than 0");
    }
}
