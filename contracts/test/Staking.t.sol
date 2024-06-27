// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Staking.sol";
import "../src/GensToken.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract StakingTest is Test {
    GensToken token;
    Staking staking;
    address user = address(0x123);

    // Déclaration de l'événement RewardsClaimed
    event RewardsClaimed(address indexed user, uint256 rewardAmount);

    function setUp() public {
        token = new GensToken();
        staking = new Staking();
        staking.initialize(address(token)); // Initialisation du staking avec le token ERC20
        token.transfer(user, 100 ether); 
    }

    function testStake() public {
        vm.startPrank(user);
        token.approve(address(staking), 50 ether);
        staking.stake(50 ether);

        assertEq(staking.getStakedAmount(user), 50 ether);
        assertEq(token.balanceOf(user), 50 ether);
        assertEq(token.balanceOf(address(staking)), 50 ether);
        vm.stopPrank();
    }

    function testUnstake() public {
        vm.startPrank(user);
        token.approve(address(staking), 50 ether);
        staking.stake(50 ether);
        
        vm.warp(block.timestamp + 1 days);

        staking.unstake(50 ether);

        assertEq(staking.getStakedAmount(user), 0);
        assertEq(token.balanceOf(user), 100 ether);
        assertEq(token.balanceOf(address(staking)), 0);
        vm.stopPrank();
    }

    function testClaimRewards() public {
        vm.startPrank(user);
        token.approve(address(staking), 50 ether);
        staking.stake(50 ether);

        vm.warp(block.timestamp + 1 days);

        uint256 pendingRewards = staking.pendingRewards(user);
        assert(pendingRewards > 0); // Vérifie qu'il y a des récompenses en attente

        vm.expectEmit(true, true, true, true);
        emit RewardsClaimed(user, pendingRewards);
        staking.claimRewards();

        uint256 userBalanceAfter = token.balanceOf(user);
        assertEq(userBalanceAfter, 50 ether + pendingRewards); // Vérifie que les récompenses ont été ajoutées au solde de l'utilisateur

        vm.stopPrank();
    }

    function testPendingRewards() public {
        vm.startPrank(user);
        token.approve(address(staking), 50 ether);
        staking.stake(50 ether);

        vm.warp(block.timestamp + 1 days);

        uint256 pending = staking.pendingRewards(user);
        assertEq(pending, 50 ether * 100 / 10000); // 1% of 50 ether
        vm.stopPrank();
    }

    function testGetStakingStats() public {
        vm.startPrank(user);
        token.approve(address(staking), 50 ether);
        staking.stake(50 ether);

        (uint256 stakedAmount, uint256 rewardRate) = staking.getStakingStats();
        
        assertEq(stakedAmount, 50 ether);
        assertEq(rewardRate, 100);

        vm.stopPrank();
    }
}