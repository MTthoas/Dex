// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../src/Staking.sol";

contract ERC20Mock is IERC20 {
    string public constant name = "MockToken";
    string public constant symbol = "MTK";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 initialSupply) {
        totalSupply = initialSupply;
        balanceOf[msg.sender] = initialSupply;
    }

    function transfer(address recipient, uint256 amount) external override returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        require(balanceOf[sender] >= amount, "Insufficient balance");
        require(allowance[sender][msg.sender] >= amount, "Allowance exceeded");
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        allowance[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }
}

contract StakingTest is Test {
    ERC20Mock token;
    Staking staking;
    address user = address(0x123);

    function setUp() public {
        token = new ERC20Mock(1000 ether); // Mint 1000 tokens to the deployer
        staking = new Staking(IERC20(address(token)));
        token.transfer(user, 100 ether); // Transfer 100 tokens to user
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
        assertEq(token.balanceOf(user), 50 ether);
        assertEq(token.balanceOf(address(staking)), 0);
        vm.stopPrank();
    }

    function testClaimRewards() public {
        vm.startPrank(user);
        token.approve(address(staking), 50 ether);
        staking.stake(50 ether);
        
        vm.warp(block.timestamp + 1 days);

        uint256 pending = staking.pendingRewards(user);
        staking.claimRewards();

        assertEq(staking.pendingRewards(user), 0);
        assertEq(token.balanceOf(user), 50 ether + pending);
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
