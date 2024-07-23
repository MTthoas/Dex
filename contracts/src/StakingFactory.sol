// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Staking.sol";
import "./token/Token.sol";

contract StakingFactory is ReentrancyGuard {
   struct StakingInfo {
      address stakingContract;
      address stakingToken;
   }

   StakingInfo[] public stakingContracts;

   event StakingContractCreated(address indexed stakingContract, address indexed stakingToken);

   /**
   * @notice Create a new staking contract.
   * @param _stakingToken Address of the staking token.
   * @param _admin Address of the admin of the new staking contract.
   * @return Address of the new staking contract.
   */
   function createStakingContract(address _stakingToken, address _admin) external nonReentrant returns (address) {
      require(_stakingToken != address(0), "StakingFactory: invalid staking token address");

      Staking staking = new Staking(_stakingToken, _admin);

      stakingContracts.push(StakingInfo({
         stakingContract: address(staking),
         stakingToken: _stakingToken
      }));
      emit StakingContractCreated(address(staking), _stakingToken);
      return address(staking);
   }

   /**
   * @notice Get all staking contracts.
   * @return Array of staking contract addresses and their associated token addresses.
   */
   function getAllStakingContracts() external view returns (StakingInfo[] memory) {
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
         (uint256 staked, uint256 rewardRate, ) = Staking(stakingContracts[i].stakingContract).getStakingStats();
         totalStaked += staked;
         totalRewardRate += rewardRate;
      }
      return (totalStaked, totalRewardRate);
   }
}