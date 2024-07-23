import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { ethers, parseUnits, formatUnits, formatEther } from "ethers";
import { stakingAbi } from "../../abi/Staking";
import { tokenAbi } from "../../abi/ERC20Upgradeable";
import { useEthersProvider, useEthersSigner } from "../../config/ethers";
import {
  useReadTokenContractBalanceOf,
  useReadStakingContractGetStakedAmount,
  useReadStakingContractPendingRewards,
  useWriteStakingContractStake,
  useReadStakingContractGetReserve,
} from "@/hook/WagmiGenerated";
import { Address } from "viem";
import { StakingAddress } from "@/abi/address";

export default function StakingCard() {
  const stakingAddress = StakingAddress;
  const { address: addressUser, isConnected } = useAccount();

  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const [amount, setAmount] = useState("");
  const { writeContract } = useWriteContract();
  const tokenAddress= "0x7427f3B01878A8857fC883e8425C623588fEE954";

  const balanceAbi = useReadTokenContractBalanceOf({
    args: [addressUser as Address],
  });
  const { data: balance, refetch: refetchBalance } = balanceAbi;

  const stakedDataAbi = useReadStakingContractGetStakedAmount({
    args: [addressUser as Address],
  });
  const { data: stakedData, refetch: refetchStakedData } = stakedDataAbi;

  const pendingRewardsAbi = useReadStakingContractPendingRewards({
    args: [addressUser as Address],
  });
  const { data: pendingRewards, refetch: refetchPendingRewards } = pendingRewardsAbi;

  const reserveAbi = useReadStakingContractGetReserve({
    address: stakingAddress as Address,
  })
  const { data: reserve, refetch: refetchReserve } = reserveAbi;

  const handleApprove = async () => {
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
    const tx = await tokenContract.approve(
      stakingAddress,
      ethers.parseUnits(amount || "0", 18)
    );
    await tx.wait();
  };

  const handleStake = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleApprove();
    const tx = await writeContract({
      abi: stakingAbi,
      address: stakingAddress,
      functionName: "stake",
      args: [parseUnits(amount, 18)],
    });
  };

  const handleUnstake = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tx = await writeContract({
      abi: stakingAbi,
      address: stakingAddress,
      functionName: "unstake",
      args: [parseUnits(amount, 18)],
    });
  };

  const handleClaim = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tx = await writeContract({
      abi: stakingAbi,
      address: stakingAddress,
      functionName: "claimRewards",
      args: [],
    });
  };

  // to refresh the data automatically
  const refreshData = async () => {
    await refetchBalance();
    await refetchStakedData();
    await refetchPendingRewards();
    await refetchReserve();
  };

  useEffect(() => {
    if (isConnected) {
      refreshData();
    }
  }, [isConnected]);

  return (
    <Card className="bg-secondary text-white rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>Stake GEN Tokens</CardTitle>
        <CardDescription>
          Enter the amount to stake your GEN tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleStake}>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount of Tokens</Label>
            <Input
              id="amount"
              name="amount"
              placeholder="0.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex flex-row-reverse space-x-reverse space-x-6 justify-between">
              {balance !== undefined && (
                <span className="text-xs">
                  Balance: {parseFloat(formatEther(balance)).toFixed(2)} GEN
                </span>
              )}
              {stakedData !== undefined && (
                <span className="text-xs">
                  Staked: {parseFloat(formatEther(stakedData)).toFixed(2)}
                </span>
              )}
              {pendingRewards !== undefined && (
                <span className="text-xs">
                  Earn: {parseFloat(formatEther(pendingRewards)).toFixed(2)}
                </span>
              )}
              {reserve !== undefined && (
                <span className="text-xs">
                  Reserve: {parseFloat(formatEther(reserve)).toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <CardFooter className="flex flex-col space-y-2 mt-4">
            {isConnected ? (
              <>
                <div className="flex space-x-2 w-full">
                  <Button className="w-full" type="submit">
                    Stake Tokens
                  </Button>
                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleUnstake}
                  >
                    Unstake Tokens
                  </Button>
                </div>
                <Button className="w-full" type="button" onClick={handleClaim}>
                  Claim Rewards
                </Button>
              </>
            ) : (
              <span className="text-xs text-red-500">
                Please connect your wallet to stake/unstake tokens.
              </span>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
