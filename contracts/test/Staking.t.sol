// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/Staking.sol";
import "../src/GensToken.sol";

contract StakingTest is Test {
    GensToken token;
    Staking staking;
    address user = address(0x123);

    function setUp() public {
        token = new GensToken(); 
        staking = new Staking(token);
        token.transfer(user, 100 ether); 
    }

    function testStake() public {
        vm.startPrank(user);
        token.approve(address(staking), 50 ether);
        staking.stake(50 ether);

        assertEq(staking.stakedAmount(user), 50 ether);
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

        assertEq(staking.stakedAmount(user), 0);
        assertEq(token.balanceOf(user), 100 ether);
        assertEq(token.balanceOf(address(staking)), 0);
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
}