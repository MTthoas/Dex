// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./token/Token.sol";

contract Staking is ReentrancyGuard {
    Token public stakingToken;

    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakedTime;
    }

    mapping(address => Stake) public stakes;
    uint256 public rewardRatePerDay = 100; // 1% per 24 hours (100 basis points)
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsUpdated(address indexed user, uint256 rewardDebt, uint256 accumulatedReward);
    event RewardsClaimed(address indexed user, uint256 rewardAmount);

    constructor(address _stakingToken) {
        stakingToken = Token(_stakingToken);
        rewardRatePerDay = 100;
    }

    // Stake tokens
    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot stake 0 tokens");

        Stake storage userStake = stakes[msg.sender];
        _updateRewards(msg.sender);

        stakingToken.transferFrom(msg.sender, address(this), _amount);

        userStake.amount += _amount;
        userStake.lastStakedTime = block.timestamp;
        totalStaked += _amount;

        emit Staked(msg.sender, _amount);
    }

    // Unstake tokens and claim rewards
    function unstake(uint256 _amount) external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= _amount, "Insufficient staked amount");

        _updateRewards(msg.sender);

        userStake.amount -= _amount;
        stakingToken.transfer(msg.sender, _amount);
        totalStaked -= _amount;

        emit Unstaked(msg.sender, _amount);
    }

    // Claim rewards
    function claimRewards() external nonReentrant {
        Stake storage userStake = stakes[msg.sender];
        _updateRewards(msg.sender);

        uint256 accumulatedReward = userStake.rewardDebt;
        require(accumulatedReward > 0, "No rewards to claim");

        userStake.rewardDebt = 0;
        stakingToken.transfer(msg.sender, accumulatedReward);

        emit RewardsClaimed(msg.sender, accumulatedReward);
    }

    // View function to see pending rewards for a user
    function pendingRewards(address _user) external view returns (uint256) {
        Stake storage userStake = stakes[_user];
        uint256 accumulatedReward = _calculateReward(userStake.amount, block.timestamp - userStake.lastStakedTime);
        return userStake.rewardDebt + accumulatedReward;
    }

    // View function to see staked amount for a user
    function getStakedAmount(address _user) external view returns (uint256) {
        return stakes[_user].amount;
    }

    // Internal function to update rewards for a user
    function _updateRewards(address _user) internal {
        Stake storage userStake = stakes[_user];
        if (userStake.amount > 0) {
            uint256 accumulatedReward = _calculateReward(userStake.amount, block.timestamp - userStake.lastStakedTime);
            userStake.rewardDebt += accumulatedReward;
            userStake.lastStakedTime = block.timestamp;

            emit RewardsUpdated(_user, userStake.rewardDebt, accumulatedReward);
        }
    }

    // Internal function to calculate reward based on staked amount and time duration
    function _calculateReward(uint256 _amount, uint256 _duration) internal view returns (uint256) {
        return (_amount * rewardRatePerDay * _duration) / (24 * 60 * 60) / 10000; // 10000 basis points in 1%
    }

    // View function to see staking stats
    function getStakingStats() public view returns (uint256 stakedAmount, uint256 rewardRate) {
        stakedAmount = totalStaked;
        rewardRate = rewardRatePerDay;
        return (stakedAmount, rewardRate);
    }
}