export const stakingFactoryAbi = [
    {
      type: 'function',
      name: 'createStakingContract',
      stateMutability: 'nonpayable',
      inputs: [
        { name: '_stakingToken', type: 'address', internalType: 'address' },
        { name: '_admin', type: 'address', internalType: 'address' },
      ],
      outputs: [
        { name: '', type: 'address', internalType: 'address' },
      ],
    },
    {
      type: 'function',
      name: 'getAllStakingContracts',
      stateMutability: 'view',
      inputs: [],
      outputs: [
        { name: '', type: 'address[]', internalType: 'address[]' },
      ],
    },
    {
      type: 'function',
      name: 'getAllStakingStats',
      stateMutability: 'view',
      inputs: [],
      outputs: [
        { name: 'totalStaked', type: 'uint256', internalType: 'uint256' },
        { name: 'totalRewardRate', type: 'uint256', internalType: 'uint256' },
      ],
    },
    {
      type: 'function',
      name: 'stakingContracts',
      stateMutability: 'view',
      inputs: [
        { name: '', type: 'uint256', internalType: 'uint256' },
      ],
      outputs: [
        { name: '', type: 'address', internalType: 'address' },
      ],
    },
    {
      type: 'event',
      name: 'StakingContractCreated',
      inputs: [
        { name: 'stakingContract', type: 'address', indexed: true, internalType: 'address' },
      ],
      anonymous: false,
    },
    {
      type: 'error',
      name: 'ReentrancyGuardReentrantCall',
      inputs: [],
    },
  ] as const;
  