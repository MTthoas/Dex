import { defineConfig, loadEnv } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import { Address } from 'viem'


export default defineConfig(() => {
    const env = loadEnv({
        mode: process.env.NODE_ENV,
        envDir: process.cwd(),
    })
    return {
    out: 'src/hook/WagmiGenerated.ts',
    contracts: [
    {
      name: "StakingContract",
      address: env.NEXT_PUBLIC_STAKING_ADDRESS as Address,
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
                  "name":"_initialRewardReserve",
                  "type":"uint256",
                  "internalType":"uint256"
               }
            ],
            "stateMutability":"nonpayable"
         },
         {
            "type":"function",
            "name":"claimRewards",
            "inputs":[
               
            ],
            "outputs":[
               
            ],
            "stateMutability":"nonpayable"
         },
         {
            "type":"function",
            "name":"getStakedAmount",
            "inputs":[
               {
                  "name":"_user",
                  "type":"address",
                  "internalType":"address"
               }
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
            "type":"function",
            "name":"getStakingStats",
            "inputs":[
               
            ],
            "outputs":[
               {
                  "name":"stakedAmount",
                  "type":"uint256",
                  "internalType":"uint256"
               },
               {
                  "name":"rewardRate",
                  "type":"uint256",
                  "internalType":"uint256"
               },
               {
                  "name":"reserve",
                  "type":"uint256",
                  "internalType":"uint256"
               }
            ],
            "stateMutability":"view"
         },
         {
            "type":"function",
            "name":"pendingRewards",
            "inputs":[
               {
                  "name":"_user",
                  "type":"address",
                  "internalType":"address"
               }
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
            "type":"function",
            "name":"rewardRatePerDay",
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
            "type":"function",
            "name":"rewardReserve",
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
            "type":"function",
            "name":"stake",
            "inputs":[
               {
                  "name":"_amount",
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
            "name":"stakes",
            "inputs":[
               {
                  "name":"",
                  "type":"address",
                  "internalType":"address"
               }
            ],
            "outputs":[
               {
                  "name":"amount",
                  "type":"uint256",
                  "internalType":"uint256"
               },
               {
                  "name":"rewardDebt",
                  "type":"uint256",
                  "internalType":"uint256"
               },
               {
                  "name":"lastStakedTime",
                  "type":"uint256",
                  "internalType":"uint256"
               }
            ],
            "stateMutability":"view"
         },
         {
            "type":"function",
            "name":"stakingToken",
            "inputs":[
               
            ],
            "outputs":[
               {
                  "name":"",
                  "type":"address",
                  "internalType":"contract Token"
               }
            ],
            "stateMutability":"view"
         },
         {
            "type":"function",
            "name":"totalStaked",
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
            "type":"function",
            "name":"unstake",
            "inputs":[
               {
                  "name":"_amount",
                  "type":"uint256",
                  "internalType":"uint256"
               }
            ],
            "outputs":[
               
            ],
            "stateMutability":"nonpayable"
         },
         {
            "type":"event",
            "name":"RewardsClaimed",
            "inputs":[
               {
                  "name":"user",
                  "type":"address",
                  "indexed":true,
                  "internalType":"address"
               },
               {
                  "name":"rewardAmount",
                  "type":"uint256",
                  "indexed":false,
                  "internalType":"uint256"
               }
            ],
            "anonymous":false
         },
         {
            "type":"event",
            "name":"RewardsUpdated",
            "inputs":[
               {
                  "name":"user",
                  "type":"address",
                  "indexed":true,
                  "internalType":"address"
               },
               {
                  "name":"rewardDebt",
                  "type":"uint256",
                  "indexed":false,
                  "internalType":"uint256"
               },
               {
                  "name":"accumulatedReward",
                  "type":"uint256",
                  "indexed":false,
                  "internalType":"uint256"
               }
            ],
            "anonymous":false
         },
         {
            "type":"event",
            "name":"Staked",
            "inputs":[
               {
                  "name":"user",
                  "type":"address",
                  "indexed":true,
                  "internalType":"address"
               },
               {
                  "name":"amount",
                  "type":"uint256",
                  "indexed":false,
                  "internalType":"uint256"
               }
            ],
            "anonymous":false
         },
         {
            "type":"event",
            "name":"Unstaked",
            "inputs":[
               {
                  "name":"user",
                  "type":"address",
                  "indexed":true,
                  "internalType":"address"
               },
               {
                  "name":"amount",
                  "type":"uint256",
                  "indexed":false,
                  "internalType":"uint256"
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
        name: "StakingFactoryContract",
        address: env.NEXT_PUBLIC_STAKING_FACTORY_ADDRESS as Address,
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
                        "name":"_initialRewardReserve",
                        "type":"uint256",
                        "internalType":"uint256"
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
                        "type":"address[]",
                        "internalType":"address[]"
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
                        "name":"",
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
      address: env.NEXT_PUBLIC_GENX_ADDRESS as Address,
      abi: [
        {
          "type": "constructor",
          "inputs": [
              {
                  "name": "name",
                  "type": "string",
                  "internalType": "string"
              },
              {
                  "name": "symbol",
                  "type": "string",
                  "internalType": "string"
              },
              {
                  "name": "initialSupply",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "stateMutability": "nonpayable"
      },
      {
          "type": "function",
          "name": "allowance",
          "inputs": [
              {
                  "name": "owner",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "spender",
                  "type": "address",
                  "internalType": "address"
              }
          ],
          "outputs": [
              {
                  "name": "",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "stateMutability": "view"
      },
      {
          "type": "function",
          "name": "approve",
          "inputs": [
              {
                  "name": "spender",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "value",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "outputs": [
              {
                  "name": "",
                  "type": "bool",
                  "internalType": "bool"
              }
          ],
          "stateMutability": "nonpayable"
      },
      {
          "type": "function",
          "name": "balanceOf",
          "inputs": [
              {
                  "name": "account",
                  "type": "address",
                  "internalType": "address"
              }
          ],
          "outputs": [
              {
                  "name": "",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "stateMutability": "view"
      },
      {
          "type": "function",
          "name": "burn",
          "inputs": [
              {
                  "name": "from",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "amount",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
      },
      {
          "type": "function",
          "name": "decimals",
          "inputs": [],
          "outputs": [
              {
                  "name": "",
                  "type": "uint8",
                  "internalType": "uint8"
              }
          ],
          "stateMutability": "view"
      },
      {
          "type": "function",
          "name": "mint",
          "inputs": [
              {
                  "name": "to",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "amount",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
      },
      {
          "type": "function",
          "name": "name",
          "inputs": [],
          "outputs": [
              {
                  "name": "",
                  "type": "string",
                  "internalType": "string"
              }
          ],
          "stateMutability": "view"
      },
      {
          "type": "function",
          "name": "symbol",
          "inputs": [],
          "outputs": [
              {
                  "name": "",
                  "type": "string",
                  "internalType": "string"
              }
          ],
          "stateMutability": "view"
      },
      {
          "type": "function",
          "name": "totalSupply",
          "inputs": [],
          "outputs": [
              {
                  "name": "",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "stateMutability": "view"
      },
      {
          "type": "function",
          "name": "transfer",
          "inputs": [
              {
                  "name": "to",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "value",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "outputs": [
              {
                  "name": "",
                  "type": "bool",
                  "internalType": "bool"
              }
          ],
          "stateMutability": "nonpayable"
      },
      {
          "type": "function",
          "name": "transferFrom",
          "inputs": [
              {
                  "name": "from",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "to",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "value",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ],
          "outputs": [
              {
                  "name": "",
                  "type": "bool",
                  "internalType": "bool"
              }
          ],
          "stateMutability": "nonpayable"
      },
      {
          "type": "event",
          "name": "Approval",
          "inputs": [
              {
                  "name": "owner",
                  "type": "address",
                  "indexed": true,
                  "internalType": "address"
              },
              {
                  "name": "spender",
                  "type": "address",
                  "indexed": true,
                  "internalType": "address"
              },
              {
                  "name": "value",
                  "type": "uint256",
                  "indexed": false,
                  "internalType": "uint256"
              }
          ],
          "anonymous": false
      },
      {
          "type": "event",
          "name": "Transfer",
          "inputs": [
              {
                  "name": "from",
                  "type": "address",
                  "indexed": true,
                  "internalType": "address"
              },
              {
                  "name": "to",
                  "type": "address",
                  "indexed": true,
                  "internalType": "address"
              },
              {
                  "name": "value",
                  "type": "uint256",
                  "indexed": false,
                  "internalType": "uint256"
              }
          ],
          "anonymous": false
      },
      {
          "type": "error",
          "name": "ERC20InsufficientAllowance",
          "inputs": [
              {
                  "name": "spender",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "allowance",
                  "type": "uint256",
                  "internalType": "uint256"
              },
              {
                  "name": "needed",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ]
      },
      {
          "type": "error",
          "name": "ERC20InsufficientBalance",
          "inputs": [
              {
                  "name": "sender",
                  "type": "address",
                  "internalType": "address"
              },
              {
                  "name": "balance",
                  "type": "uint256",
                  "internalType": "uint256"
              },
              {
                  "name": "needed",
                  "type": "uint256",
                  "internalType": "uint256"
              }
          ]
      },
      {
          "type": "error",
          "name": "ERC20InvalidApprover",
          "inputs": [
              {
                  "name": "approver",
                  "type": "address",
                  "internalType": "address"
              }
          ]
      },
      {
          "type": "error",
          "name": "ERC20InvalidReceiver",
          "inputs": [
              {
                  "name": "receiver",
                  "type": "address",
                  "internalType": "address"
              }
          ]
      },
      {
          "type": "error",
          "name": "ERC20InvalidSender",
          "inputs": [
              {
                  "name": "sender",
                  "type": "address",
                  "internalType": "address"
              }
          ]
      },
      {
          "type": "error",
          "name": "ERC20InvalidSpender",
          "inputs": [
              {
                  "name": "spender",
                  "type": "address",
                  "internalType": "address"
              }
          ]
      }
      ]
    }
  ],
  plugins: [react()],
}})
