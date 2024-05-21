// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is ReentrancyGuard {
    IERC20 public token;

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
    event RewardsClaimed(address indexed user, uint256 reward);

    constructor(IERC20 _token) {
        token = _token;
    }

    // Stake tokens
    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot stake 0 tokens");

        Stake storage userStake = stakes[msg.sender];
        _updateRewards(msg.sender);

        token.transferFrom(msg.sender, address(this), _amount);

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
        token.transfer(msg.sender, _amount);
        totalStaked -= _amount;

        emit Unstaked(msg.sender, _amount);
    }

    // Claim rewards
    function claimRewards() external nonReentrant {
        _updateRewards(msg.sender);
        Stake storage userStake = stakes[msg.sender];

        uint256 reward = userStake.rewardDebt;
        userStake.rewardDebt = 0;
        token.transfer(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    // View function to see pending rewards for a user
    function pendingRewards(address _user) external view returns (uint256) {
        Stake storage userStake = stakes[_user];
        uint256 accumulatedReward = _calculateReward(userStake.amount, block.timestamp - userStake.lastStakedTime);
        return userStake.rewardDebt + accumulatedReward;
    }

    // View function to see staked amount for a user
    function stakedAmount(address _user) external view returns (uint256) {
        return stakes[_user].amount;
    }

    // Internal function to update rewards for a user
    function _updateRewards(address _user) internal {
        Stake storage userStake = stakes[_user];
        if (userStake.amount > 0) {
            uint256 accumulatedReward = _calculateReward(userStake.amount, block.timestamp - userStake.lastStakedTime);
            userStake.rewardDebt += accumulatedReward;
            userStake.lastStakedTime = block.timestamp;
        }
    }

    // Internal function to calculate reward based on staked amount and time duration
    function _calculateReward(uint256 _amount, uint256 _duration) internal view returns (uint256) {
        return (_amount * rewardRatePerDay * _duration) / (24 * 60 * 60 * 10000); // 10000 basis points in 1%
    }
}