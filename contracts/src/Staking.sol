// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./token/Token.sol";

/**
 * @title Staking
 * @dev A contract for staking tokens and earning rewards.
 */
contract Staking is ReentrancyGuard {
    Token public stakingToken;
    uint256 public rewardReserve;

    struct Stake {
        uint256 amount; // Amount of tokens staked by the user
        uint256 rewardDebt; // Accumulated reward debt for the user
        uint256 lastStakedTime; // Timestamp of the last stake action by the user
    }

    mapping(address => Stake) public stakes; // Mapping of user addresses to their stakes
    uint256 public rewardRatePerDay = 100; // 1% per 24 hours (100 basis points)
    uint256 public totalStaked; // Total amount of tokens staked across all users

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsUpdated(address indexed user, uint256 rewardDebt, uint256 accumulatedReward);
    event RewardsClaimed(address indexed user, uint256 rewardAmount);

    constructor(address _stakingToken, address _admin) {
        stakingToken = Token(_stakingToken);
        admin = _admin;
    }

    bool initialized=false;
    address admin;

    function initialize(uint256 _initialRewardReserve) external {
        require(msg.sender == admin, "Only admin can initialize");
        require(!initialized, "Staking contract already initialized");
        require(_initialRewardReserve > 0, "Invalid initial reward reserve");

        rewardReserve = _initialRewardReserve;
        initialized = true;
    }

    function isInitialized() public view returns (bool) {
        return initialized;
    }

    /**
     * @notice Stake tokens into the staking contract.
     * @param _amount Amount of tokens to stake.
     */
    function stake(uint256 _amount) external nonReentrant {
        require(initialized, "Staking contract not initialized");
        require(_amount > 0, "Cannot stake 0 tokens");

        Stake storage userStake = stakes[msg.sender];
        _updateRewards(msg.sender);

        stakingToken.transferFrom(msg.sender, address(this), _amount);

        userStake.amount += _amount;
        userStake.lastStakedTime = block.timestamp;
        totalStaked += _amount;

        emit Staked(msg.sender, _amount);
    }

    /**
     * @notice Unstake tokens and claim accumulated rewards.
     * @param _amount Amount of tokens to unstake.
     */
    function unstake(uint256 _amount) external nonReentrant {
        require (initialized);
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= _amount, "Insufficient staked amount");

        _updateRewards(msg.sender);

        userStake.amount -= _amount;
        stakingToken.transfer(msg.sender, _amount);
        totalStaked -= _amount;

        emit Unstaked(msg.sender, _amount);
    }

    /**
     * @notice Claim accumulated rewards.
     */
    function claimRewards() external nonReentrant {
        require (initialized);
        Stake storage userStake = stakes[msg.sender];
        require(rewardReserve > 0, "No rewards in reserve");
        _updateRewards(msg.sender);

        uint256 accumulatedReward = userStake.rewardDebt;
        require(accumulatedReward > 0, "No rewards to claim");
        require(rewardReserve >= accumulatedReward, "Not enough rewards in reserve");

        // Reset rewardDebt to 0 before transferring rewards
        userStake.rewardDebt = 0;
        rewardReserve -= accumulatedReward;
        stakingToken.transfer(msg.sender, accumulatedReward);

        // Update lastStakedTime to avoid recalculating the same rewards
        userStake.lastStakedTime = block.timestamp;

        emit RewardsClaimed(msg.sender, accumulatedReward);
    }

    /**
     * @notice View function to see pending rewards for a user.
     * @param _user Address of the user.
     * @return Pending reward amount.
     */
    function pendingRewards(address _user) external view returns (uint256) {
        require (initialized);
        Stake storage userStake = stakes[_user];
        uint256 accumulatedReward = _calculateReward(userStake.amount, block.timestamp - userStake.lastStakedTime);
        return userStake.rewardDebt + accumulatedReward;
    }

    /**
     * @notice View function to see the staked amount for a user.
     * @param _user Address of the user.
     * @return Amount of tokens staked.
     */
    function getStakedAmount(address _user) external view returns (uint256) {
        require (initialized);
        return stakes[_user].amount;
    }

    /**
     * @notice View function to see the reserve of the pool.
     * @return Amount of reserve.
     */
    function getReserve() external view returns (uint256) {
        require (initialized);
        return rewardReserve;
    }

    /**
     * @notice Internal function to update rewards for a user.
     * @param _user Address of the user.
     */
    function _updateRewards(address _user) internal {
        Stake storage userStake = stakes[_user];
        if (userStake.amount > 0) {
            uint256 accumulatedReward = _calculateReward(userStake.amount, block.timestamp - userStake.lastStakedTime);
            userStake.rewardDebt += accumulatedReward;
            userStake.lastStakedTime = block.timestamp;

            emit RewardsUpdated(_user, userStake.rewardDebt, accumulatedReward);
        }
    }

    /**
     * @notice Internal function to calculate reward based on staked amount and time duration.
     * @param _amount Amount of tokens staked.
     * @param _duration Time duration in seconds.
     * @return Calculated reward amount.
     */
    function _calculateReward(uint256 _amount, uint256 _duration) internal view returns (uint256) {
        return (_amount * rewardRatePerDay * _duration) / (24 * 60 * 60) / 10000; // 10000 basis points in 1%
    }

    // View function to see staking stats
    function getStakingStats() public view returns (uint256 stakedAmount, uint256 rewardRate, uint256 reserve) {
        require (initialized);
        stakedAmount = totalStaked;
        rewardRate = rewardRatePerDay;
        reserve = rewardReserve;
        return (stakedAmount, rewardRate, reserve);
    }
}
