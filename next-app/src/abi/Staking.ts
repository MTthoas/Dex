export const stakingAbi = [
   {
     type: 'constructor',
     stateMutability: 'nonpayable',
     inputs: [
       { name: '_token', type: 'address', internalType: 'contract GensToken' },
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
     name: 'stakedAmount',
     stateMutability: 'view',
     inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
     outputs: [{ type: 'uint256', internalType: 'uint256' }],
   },
   {
     type: 'function',
     name: 'stakes',
     stateMutability: 'view',
     inputs: [{ name: '', type: 'address', internalType: 'address' }],
     outputs: [
       { type: 'uint256', name: 'amount', internalType: 'uint256' },
       { type: 'uint256', name: 'rewardDebt', internalType: 'uint256' },
       { type: 'uint256', name: 'lastStakedTime', internalType: 'uint256' },
     ],
   },
   {
     type: 'function',
     name: 'token',
     stateMutability: 'view',
     inputs: [],
     outputs: [{ type: 'address', internalType: 'contract GensToken' }],
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
     name: 'Initialized',
     inputs: [{ type: 'uint64', name: 'version', indexed: false, internalType: 'uint64' }],
     anonymous: false,
   },
   {
     type: 'event',
     name: 'Staked',
     inputs: [
       { type: 'address', name: 'user', indexed: true, internalType: 'address' },
       { type: 'uint256', name: 'amount', indexed: false, internalType: 'uint256' },
     ],
     anonymous: false,
   },
   {
     type: 'event',
     name: 'Unstaked',
     inputs: [
       { type: 'address', name: 'user', indexed: true, internalType: 'address' },
       { type: 'uint256', name: 'amount', indexed: false, internalType: 'uint256' },
     ],
     anonymous: false,
   },
   {
     type: 'error',
     name: 'InvalidInitialization',
     inputs: [],
   },
   {
     type: 'error',
     name: 'NotInitializing',
     inputs: [],
   },
   {
     type: 'error',
     name: 'ReentrancyGuardReentrantCall',
     inputs: [],
   },
 ] as const;
 