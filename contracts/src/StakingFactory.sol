// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Staking.sol";

contract StakingFactory {
   address[] public stakingContracts;
   address public immutable stakingImplementation;

   event StakingContractCreated(address indexed stakingContract);
   
   constructor() {
      stakingImplementation = address(new Staking());
   }

   // Create a new staking contract
   function createStakingContract(address _stakingToken) external returns (address) {
      address clone = Clones.clone(stakingImplementation);
      Staking(clone).initialize(_stakingToken);
      stakingContracts.push(clone);
      emit StakingContractCreated(clone);
      return clone;
   }

   // Get all staking contracts
   function getAllStakingContracts() external view returns (address[] memory) {
      return stakingContracts;
   }

   // Get all staking stats
   function getAllStakingStats() external view returns (uint256 totalStaked, uint256 totalRewardRate) {
      totalStaked = 0;
      totalRewardRate = 0;
      for (uint i = 0; i < stakingContracts.length; i++) {
         (uint256 staked, uint256 rewardRate) = Staking(stakingContracts[i]).getStakingStats();
         totalStaked += staked;
         totalRewardRate += rewardRate;
      }
      return (totalStaked, totalRewardRate);
   }
}