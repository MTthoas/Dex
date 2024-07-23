import { GenxAddress, liquidityFactoryAddress, StakingFactoryAddress, TokenManagerAddress, UserRegistryAddress } from "@/abi/address";
import { defineConfig } from '@wagmi/cli';
import { react } from '@wagmi/cli/plugins';
import { Address } from 'viem';


export default defineConfig(() => {
  return {
    out: "src/hook/WagmiGenerated.ts",
    contracts: [
    {
      name: "StakingContract",
      "abi":[
         {
            "type":"constructor",
            "inputs":[
               {
                  "name":"_stakingToken",
                  "type":"address",
                  "internalType":"address"
               },
               {
                  "name":"_admin",
                  "type":"address",
                  "internalType":"address"
               }
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "claimRewards",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getStakedAmount",
            inputs: [
              {
                name: "_user",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            "stateMutability":"nonpayable"
         },
         {
            "type":"function",
            "name":"getReserve",
            "inputs":[
               
            ],
            "outputs":[
               {
                  "name":"",
                  "type":"uint256",
                  "internalType":"uint256"
               }
            ],
            "stateMutability":"view"
         },
          {
            type: "function",
            name: "pendingRewards",
            inputs: [
              {
                name: "_user",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "rewardRatePerDay",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            "stateMutability":"view"
         },
         {
            "type":"function",
            "name":"initialize",
            "inputs":[
               {
                  "name":"_initialRewardReserve",
                  "type":"uint256",
                  "internalType":"uint256"
               }
            ],
            "outputs":[
               
            ],
            "stateMutability":"nonpayable"
         },
         {
            "type":"function",
            "name":"isInitialized",
            "inputs":[
               
            ],
            "outputs":[
               {
                  "name":"",
                  "type":"bool",
                  "internalType":"bool"
               }
            ],
            "stateMutability":"view"
         },
          {
            type: "function",
            name: "stake",
            inputs: [
              {
                name: "_amount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "stakes",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "amount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "rewardDebt",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "lastStakedTime",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "stakingToken",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "contract Token",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "totalStaked",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "unstake",
            inputs: [
              {
                name: "_amount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "event",
            name: "RewardsClaimed",
            inputs: [
              {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rewardAmount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RewardsUpdated",
            inputs: [
              {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rewardDebt",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "accumulatedReward",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "Staked",
            inputs: [
              {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "Unstaked",
            inputs: [
              {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "ReentrancyGuardReentrantCall",
            inputs: [],
          },
        ],
      },
      {
        name: "StakingFactoryContract",
        address: StakingFactoryAddress,
        abi : [
            {
                "type":"function",
                "name":"createStakingContract",
                "inputs":[
                   {
                      "name":"_stakingToken",
                      "type":"address",
                      "internalType":"address"
                   },
                   {
                      "name":"_admin",
                      "type":"address",
                      "internalType":"address"
                   }
                ],
                "outputs":[
                   {
                      "name":"",
                      "type":"address",
                      "internalType":"address"
                   }
                ],
                "stateMutability":"nonpayable"
             },
             {
                "type":"function",
                "name":"getAllStakingContracts",
                "inputs":[
                   
                ],
                "outputs":[
                   {
                      "name":"",
                      "type":"tuple[]",
                      "internalType":"struct StakingFactory.StakingInfo[]",
                      "components":[
                         {
                            "name":"stakingContract",
                            "type":"address",
                            "internalType":"address"
                         },
                         {
                            "name":"stakingToken",
                            "type":"address",
                            "internalType":"address"
                         }
                      ]
                   }
                ],
                "stateMutability":"view"
             },
             {
                "type":"function",
                "name":"getAllStakingStats",
                "inputs":[
                   
                ],
                "outputs":[
                   {
                      "name":"totalStaked",
                      "type":"uint256",
                      "internalType":"uint256"
                   },
                   {
                      "name":"totalRewardRate",
                      "type":"uint256",
                      "internalType":"uint256"
                   }
                ],
                "stateMutability":"view"
             },
             {
                "type":"function",
                "name":"stakingContracts",
                "inputs":[
                   {
                      "name":"",
                      "type":"uint256",
                      "internalType":"uint256"
                   }
                ],
                "outputs":[
                   {
                      "name":"stakingContract",
                      "type":"address",
                      "internalType":"address"
                   },
                   {
                      "name":"stakingToken",
                      "type":"address",
                      "internalType":"address"
                   }
                ],
                "stateMutability":"view"
             },
             {
                "type":"event",
                "name":"StakingContractCreated",
                "inputs":[
                   {
                      "name":"stakingContract",
                      "type":"address",
                      "indexed":true,
                      "internalType":"address"
                   },
                   {
                      "name":"stakingToken",
                      "type":"address",
                      "indexed":true,
                      "internalType":"address"
                   }
                ],
                "anonymous":false
             },
             {
                "type":"error",
                "name":"ReentrancyGuardReentrantCall",
                "inputs":[
                   
                ]
             }
        ]
    },
    {
      name: "TokenContract",
      abi: [
        {
          "type": "constructor",
          "inputs": [
              {
                name: "_stakingToken",
                type: "address",
                internalType: "address",
              },
              {
                name: "_initialRewardReserve",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getAllStakingContracts",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address[]",
                internalType: "address[]",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getAllStakingStats",
            inputs: [],
            outputs: [
              {
                name: "totalStaked",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "totalRewardRate",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "stakingContracts",
            inputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "event",
            name: "StakingContractCreated",
            inputs: [
              {
                name: "stakingContract",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "ReentrancyGuardReentrantCall",
            inputs: [],
          },
        ],
      },
      {
        name: "TokenContract",
        address: GenxAddress as Address,
        abi: [
          {
            type: "constructor",
            inputs: [
              {
                name: "name",
                type: "string",
                internalType: "string",
              },
              {
                name: "symbol",
                type: "string",
                internalType: "string",
              },
              {
                name: "initialSupply",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "allowance",
            inputs: [
              {
                name: "owner",
                type: "address",
                internalType: "address",
              },
              {
                name: "spender",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "approve",
            inputs: [
              {
                name: "spender",
                type: "address",
                internalType: "address",
              },
              {
                name: "value",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "balanceOf",
            inputs: [
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "burn",
            inputs: [
              {
                name: "from",
                type: "address",
                internalType: "address",
              },
              {
                name: "amount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "decimals",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "mint",
            inputs: [
              {
                name: "to",
                type: "address",
                internalType: "address",
              },
              {
                name: "amount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "name",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "symbol",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "string",
                internalType: "string",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "totalSupply",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "transfer",
            inputs: [
              {
                name: "to",
                type: "address",
                internalType: "address",
              },
              {
                name: "value",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "transferFrom",
            inputs: [
              {
                name: "from",
                type: "address",
                internalType: "address",
              },
              {
                name: "to",
                type: "address",
                internalType: "address",
              },
              {
                name: "value",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "event",
            name: "Approval",
            inputs: [
              {
                name: "owner",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "spender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "value",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "Transfer",
            inputs: [
              {
                name: "from",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "to",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "value",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "ERC20InsufficientAllowance",
            inputs: [
              {
                name: "spender",
                type: "address",
                internalType: "address",
              },
              {
                name: "allowance",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "needed",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            type: "error",
            name: "ERC20InsufficientBalance",
            inputs: [
              {
                name: "sender",
                type: "address",
                internalType: "address",
              },
              {
                name: "balance",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "needed",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            type: "error",
            name: "ERC20InvalidApprover",
            inputs: [
              {
                name: "approver",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "ERC20InvalidReceiver",
            inputs: [
              {
                name: "receiver",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "ERC20InvalidSender",
            inputs: [
              {
                name: "sender",
                type: "address",
                internalType: "address",
              },
            ],
          },
          {
            type: "error",
            name: "ERC20InvalidSpender",
            inputs: [
              {
                name: "spender",
                type: "address",
                internalType: "address",
              },
            ],
          },
        ],
      },
      {
        name: "LiquidityPool",
        abi: [
          {
            type: "constructor",
            inputs: [
              {
                name: "_tokenA",
                type: "address",
                internalType: "address",
              },
              {
                name: "_tokenB",
                type: "address",
                internalType: "address",
              },
              {
                name: "_liquidityToken",
                type: "address",
                internalType: "address",
              },
              {
                name: "_platformFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "_minimumLiquidity",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "_admin",
                type: "address",
                internalType: "address",
              },
              {
                name: "_admin2",
                type: "address",
                internalType: "address",
              },
              {
                name: "_admin3",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "ADMIN_ROLE",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "DEFAULT_ADMIN_ROLE",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "addLiquidity",
            inputs: [
              {
                name: "tokenAAmount",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "tokenBAmount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "calculateRewards",
            inputs: [
              {
                name: "user",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "rewardA",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "rewardB",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "claimRewards",
            inputs: [],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getAmountOut",
            inputs: [
              {
                name: "amountIn",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "tokenIn",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getPair",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getPrice",
            inputs: [
              {
                name: "tokenIn",
                type: "address",
                internalType: "address",
              },
              {
                name: "amountIn",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getReserves",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getRoleAdmin",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "grantRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "hasRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "liquidityToken",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "contract LiquidityToken",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "platformFee",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "removeLiquidity",
            inputs: [
              {
                name: "liquidity",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "renounceRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "callerConfirmation",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "revokeRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "supportsInterface",
            inputs: [
              {
                name: "interfaceId",
                type: "bytes4",
                internalType: "bytes4",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "swap",
            inputs: [
              {
                name: "tokenIn",
                type: "address",
                internalType: "address",
              },
              {
                name: "amountIn",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "minAmountOut",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "tokenA",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "contract Token",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "tokenB",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "contract Token",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "updatePlatformFee",
            inputs: [
              {
                name: "_platformFee",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "userLiquidity",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "amountTokenA",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "amountTokenB",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "liquidity",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "timestamp",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "userRewardsA",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "userRewardsB",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "event",
            name: "LiquidityAdded",
            inputs: [
              {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "amountTokenA",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "amountTokenB",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "LiquidityRemoved",
            inputs: [
              {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "amountTokenA",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "amountTokenB",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RewardClaimed",
            inputs: [
              {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "rewardAmountA",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "rewardAmountB",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleAdminChanged",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "previousAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "newAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleGranted",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleRevoked",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "Swap",
            inputs: [
              {
                name: "user",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "tokenIn",
                type: "address",
                indexed: false,
                internalType: "address",
              },
              {
                name: "amountIn",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
              {
                name: "tokenOut",
                type: "address",
                indexed: false,
                internalType: "address",
              },
              {
                name: "amountOut",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "AccessControlBadConfirmation",
            inputs: [],
          },
          {
            type: "error",
            name: "AccessControlUnauthorizedAccount",
            inputs: [
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
              {
                name: "neededRole",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
          {
            type: "error",
            name: "MathOverflowedMulDiv",
            inputs: [],
          },
          {
            type: "error",
            name: "ReentrancyGuardReentrantCall",
            inputs: [],
          },
        ],
      },
      {
        name: "LiquidityPoolFactory",
        address: liquidityFactoryAddress as Address,
        abi: [
          {
            type: "constructor",
            inputs: [
              {
                name: "_liquidityToken",
                type: "address",
                internalType: "address",
              },
              {
                name: "admin",
                type: "address",
                internalType: "address",
              },
              {
                name: "admin2",
                type: "address",
                internalType: "address",
              },
              {
                name: "admin3",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "ADMIN_ROLE",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "DEFAULT_ADMIN_ROLE",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "allPools",
            inputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "allPoolsAddress",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address[]",
                internalType: "address[]",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "allPoolsLength",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "createPool",
            inputs: [
              {
                name: "tokenA",
                type: "address",
                internalType: "address",
              },
              {
                name: "tokenB",
                type: "address",
                internalType: "address",
              },
              {
                name: "poolOwner",
                type: "address",
                internalType: "address",
              },
              {
                name: "platformFee",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "admin2",
                type: "address",
                internalType: "address",
              },
              {
                name: "admin3",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "pool",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getPool",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getPoolAddress",
            inputs: [
              {
                name: "tokenA",
                type: "address",
                internalType: "address",
              },
              {
                name: "tokenB",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getPoolAddressByIndex",
            inputs: [
              {
                name: "index",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getRoleAdmin",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "grantRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "hasRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "isPoolPairAlreadyExists",
            inputs: [
              {
                name: "tokenA",
                type: "address",
                internalType: "address",
              },
              {
                name: "tokenB",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "liquidityToken",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "address",
                internalType: "contract LiquidityToken",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "renounceRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "callerConfirmation",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "revokeRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "supportsInterface",
            inputs: [
              {
                name: "interfaceId",
                type: "bytes4",
                internalType: "bytes4",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "event",
            name: "PoolCreated",
            inputs: [
              {
                name: "tokenA",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "tokenB",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "poolAddress",
                type: "address",
                indexed: false,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleAdminChanged",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "previousAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "newAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleGranted",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleRevoked",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "AccessControlBadConfirmation",
            inputs: [],
          },
          {
            type: "error",
            name: "AccessControlUnauthorizedAccount",
            inputs: [
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
              {
                name: "neededRole",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
          {
            type: "error",
            name: "ReentrancyGuardReentrantCall",
            inputs: [],
          },
        ],
      },
      {
        name: "TokenManager",
        address: TokenManagerAddress as Address,
        abi: [
          {
            type: "constructor",
            inputs: [
              {
                name: "_admin",
                type: "address",
                internalType: "address",
              },
              {
                name: "_admin2",
                type: "address",
                internalType: "address",
              },
              {
                name: "_admin3",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "ADMIN_ROLE",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "DEFAULT_ADMIN_ROLE",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "delistToken",
            inputs: [
              {
                name: "_tokenAddress",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getListedTokens",
            inputs: [],
            outputs: [
              {
                name: "tokens",
                type: "address[]",
                internalType: "address[]",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getRoleAdmin",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getTokenInfo",
            inputs: [
              {
                name: "_tokenAddress",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "name",
                type: "string",
                internalType: "string",
              },
              {
                name: "symbol",
                type: "string",
                internalType: "string",
              },
              {
                name: "decimals",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "grantRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "hasRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "listToken",
            inputs: [
              {
                name: "_tokenAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_name",
                type: "string",
                internalType: "string",
              },
              {
                name: "_symbol",
                type: "string",
                internalType: "string",
              },
              {
                name: "_decimals",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "renounceRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "callerConfirmation",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "revokeRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "supportsInterface",
            inputs: [
              {
                name: "interfaceId",
                type: "bytes4",
                internalType: "bytes4",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "tokenInfos",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "name",
                type: "string",
                internalType: "string",
              },
              {
                name: "symbol",
                type: "string",
                internalType: "string",
              },
              {
                name: "decimals",
                type: "uint8",
                internalType: "uint8",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "event",
            name: "RoleAdminChanged",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "previousAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "newAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleGranted",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleRevoked",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "TokenDelisted",
            inputs: [
              {
                name: "tokenAddress",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "TokenListed",
            inputs: [
              {
                name: "tokenAddress",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "name",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "symbol",
                type: "string",
                indexed: false,
                internalType: "string",
              },
              {
                name: "decimals",
                type: "uint8",
                indexed: false,
                internalType: "uint8",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "AccessControlBadConfirmation",
            inputs: [],
          },
          {
            type: "error",
            name: "AccessControlUnauthorizedAccount",
            inputs: [
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
              {
                name: "neededRole",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
        ],
      },
      {
        name: "UserRegistry",
        address: UserRegistryAddress as Address,
        abi: [
          {
            type: "constructor",
            inputs: [
              {
                name: "_admin",
                type: "address",
                internalType: "address",
              },
              {
                name: "_admin2",
                type: "address",
                internalType: "address",
              },
              {
                name: "_admin3",
                type: "address",
                internalType: "address",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "ADMIN_ROLE",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "DEFAULT_ADMIN_ROLE",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "banUser",
            inputs: [
              {
                name: "_userAddress",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "getRegisteredUserIds",
            inputs: [],
            outputs: [
              {
                name: "",
                type: "uint256[]",
                internalType: "uint256[]",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getRoleAdmin",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "getUserId",
            inputs: [
              {
                name: "_address",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "grantRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "hasRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "isRegisteredUser",
            inputs: [
              {
                name: "_address",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "isUserBanned",
            inputs: [
              {
                name: "_userAddress",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "registerUser",
            inputs: [
              {
                name: "_name",
                type: "string",
                internalType: "string",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "renounceRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "callerConfirmation",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "revokeRole",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "supportsInterface",
            inputs: [
              {
                name: "interfaceId",
                type: "bytes4",
                internalType: "bytes4",
              },
            ],
            outputs: [
              {
                name: "",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "function",
            name: "transferUserId",
            inputs: [
              {
                name: "_oldAddress",
                type: "address",
                internalType: "address",
              },
              {
                name: "_newAddress",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "unbanUser",
            inputs: [
              {
                name: "_userAddress",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "",
                type: "uint256",
                internalType: "uint256",
              },
            ],
            stateMutability: "nonpayable",
          },
          {
            type: "function",
            name: "users",
            inputs: [
              {
                name: "",
                type: "address",
                internalType: "address",
              },
            ],
            outputs: [
              {
                name: "id",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "name",
                type: "string",
                internalType: "string",
              },
              {
                name: "isBanned",
                type: "bool",
                internalType: "bool",
              },
            ],
            stateMutability: "view",
          },
          {
            type: "event",
            name: "RoleAdminChanged",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "previousAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "newAdminRole",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleGranted",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "RoleRevoked",
            inputs: [
              {
                name: "role",
                type: "bytes32",
                indexed: true,
                internalType: "bytes32",
              },
              {
                name: "account",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "sender",
                type: "address",
                indexed: true,
                internalType: "address",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "UserBanned",
            inputs: [
              {
                name: "userAddress",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "userId",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "UserRegistered",
            inputs: [
              {
                name: "userAddress",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "userId",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "event",
            name: "UserUnbanned",
            inputs: [
              {
                name: "userAddress",
                type: "address",
                indexed: true,
                internalType: "address",
              },
              {
                name: "userId",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
              },
            ],
            anonymous: false,
          },
          {
            type: "error",
            name: "AccessControlBadConfirmation",
            inputs: [],
          },
          {
            type: "error",
            name: "AccessControlUnauthorizedAccount",
            inputs: [
              {
                name: "account",
                type: "address",
                internalType: "address",
              },
              {
                name: "neededRole",
                type: "bytes32",
                internalType: "bytes32",
              },
            ],
          },
          {
            type: "error",
            name: "ReentrancyGuardReentrantCall",
            inputs: [],
          },
        ],
      },
    ],
    plugins: [react()],
  };
});
