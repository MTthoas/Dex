export const stakingAbi = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_stakingToken', type: 'address', internalType: 'address' },
    ],
  },
  {
    type: 'function',
    name: 'claimRewards',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getStakedAmount',
    stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
    outputs: [{ type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getStakingStats',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'stakedAmount', type: 'uint256', internalType: 'uint256' },
      { name: 'rewardRate', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'pendingRewards',
    stateMutability: 'view',
    inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
    outputs: [{ type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'rewardRatePerDay',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'stake',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'stakes',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address', internalType: 'address' }],
    outputs: [
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
      { name: 'rewardDebt', type: 'uint256', internalType: 'uint256' },
      { name: 'lastStakedTime', type: 'uint256', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'stakingToken',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address', internalType: 'contract Token' }],
  },
  {
    type: 'function',
    name: 'totalStaked',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256', internalType: 'uint256' }],
  },
  {
    type: 'function',
    name: 'unstake',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_amount', type: 'uint256', internalType: 'uint256' }],
    outputs: [],
  },
  {
    type: 'event',
    name: 'RewardsClaimed',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'rewardAmount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RewardsUpdated',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'rewardDebt', type: 'uint256', indexed: false, internalType: 'uint256' },
      { name: 'accumulatedReward', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Staked',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Unstaked',
    inputs: [
      { name: 'user', type: 'address', indexed: true, internalType: 'address' },
      { name: 'amount', type: 'uint256', indexed: false, internalType: 'uint256' },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'ReentrancyGuardReentrantCall',
    inputs: [],
  },
] as const;