// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Staking.sol";

contract StakingFactory is ReentrancyGuard{
   address[] public stakingContracts;

   event StakingContractCreated(address indexed stakingContract);

   /**
   * @notice Create a new staking contract.
   * @param _stakingToken Address of the staking token.
   * @param _initialRewardReserve Initial reward reserve for the staking contract.
   * @return Address of the new staking contract.
   */
   function createStakingContract(address _stakingToken, uint256 _initialRewardReserve) external nonReentrant returns (address) {
      require(_stakingToken != address(0), "StakingFactory: invalid staking token address");
      require(_initialRewardReserve > 0, "StakingFactory: invalid initial reward reserve");

      Staking staking = new Staking(_stakingToken, _initialRewardReserve);

      stakingContracts.push(address(staking));
      emit StakingContractCreated(address(staking));
      return address(staking);
   }

   /**
   * @notice Get all staking contracts.
   * @return Array of staking contract addresses.
   */
   function getAllStakingContracts() external view returns (address[] memory) {
      return stakingContracts;
   }

   /**
   * @notice Get all staking stats.
   * @return totalStaked Total staked amount.
   * @return totalRewardRate Total reward rate.
   */
   function getAllStakingStats() external view returns (uint256 totalStaked, uint256 totalRewardRate) {
      totalStaked = 0;
      totalRewardRate = 0;
      for (uint i = 0; i < stakingContracts.length; i++) {
         (uint256 staked, uint256 rewardRate, ) = Staking(stakingContracts[i]).getStakingStats();
         totalStaked += staked;
         totalRewardRate += rewardRate;
      }
      return (totalStaked, totalRewardRate);
   }
}