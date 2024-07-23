"use client";
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
import { useAccount, useWriteContract } from "wagmi";
import { ethers, parseUnits, formatEther } from "ethers";
import { stakingAbi } from "../../abi/Staking";
import { AdminWallet } from "@/abi/address";
import { tokenAbi } from "../../abi/ERC20Upgradeable";
import { useEthersProvider, useEthersSigner } from "../../config/ethers";
import {
  useReadTokenContractBalanceOf,
  useReadStakingContractGetStakedAmount,
  useReadStakingContractPendingRewards,
  useReadStakingContractIsInitialized,
  useReadStakingContractGetReserve,
} from "@/hook/WagmiGenerated";
import { Address } from "viem";
import StakingFactoryModalInitializeStake from "./InitializeStakeModal";
import { parse } from "path";

interface StakePoolCardProps {
  addressContract: string;
  addressToken: string;
}

const StakePoolCard: React.FC<StakePoolCardProps> = ({
  addressContract,
  addressToken,
}) => {
  const { address: addressUser, isConnected } = useAccount();
  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const [amount, setAmount] = useState("");
  const [reserved, setReserved] = useState("");
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [tokenBalances, setTokenBalances] = useState<{ [key: string]: string }>(
    {}
  );
  const { writeContract } = useWriteContract();
  const { writeContractAsync: writeContractAsync } = useWriteContract();
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: isInitializedData, refetch: fetchInitializationStatus } =
    useReadStakingContractIsInitialized({
      address: addressContract as Address,
    });

  useEffect(() => {
    if (isConnected) {
      refreshData();
    }
  }, [isConnected]);

  useEffect(() => {
    if (isInitializedData !== undefined) {
      setIsInitialized(isInitializedData);
    }
  }, [isInitializedData]);

  useEffect(() => {
    if (isConnected && addressUser?.toLowerCase() === AdminWallet.toLowerCase()) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isConnected, addressUser]);

  const balanceAbi = useReadTokenContractBalanceOf({
    args: [addressUser as Address],
    address: addressToken as Address,
  });
  const { data: balance, refetch: refetchBalance } = balanceAbi;

  const stakedDataAbi = useReadStakingContractGetStakedAmount({
    args: [addressUser as Address],
    address: addressContract as Address,
  });
  const { data: stakedData, refetch: refetchStakedData } = stakedDataAbi;

  const pendingRewardsAbi = useReadStakingContractPendingRewards({
    args: [addressUser as Address],
    address: addressContract as Address,
  });
  const { data: pendingRewards, refetch: refetchPendingRewards } =
    pendingRewardsAbi;

  const reserveAbi = useReadStakingContractGetReserve({
    address: addressContract as Address,
  });
  const { data: reserve, refetch: refetchReserve } = reserveAbi;

  const handleApprove = async () => {
    const tokenContract = new ethers.Contract(addressToken, tokenAbi, signer);
    const tx = await tokenContract.approve(
      addressContract,
      ethers.parseUnits(amount || "0", 18)
    );
    await tx.wait();
  };

  const handleStake = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount) return;
    try {
      await handleApprove();
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await writeContractAsync({
        abi: stakingAbi,
        functionName: "stake",
        address: addressContract as Address,
        args: [parsedAmount],
      });
      await tx;
      refreshData();
      window.location.reload();
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  const handleUnstake = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!amount) return;
    await handleApprove();
    const parsedAmount = ethers.parseUnits(amount, 18);
    const tx = await writeContractAsync({
      abi: stakingAbi,
      address: addressContract as Address,
      functionName: "unstake",
      args: [parsedAmount],
    });
    await tx;
    refreshData();
    window.location.reload();
  };

  const handleClaim = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const tx = await writeContractAsync({
        abi: stakingAbi,
        address: addressContract as Address,
        functionName: "claimRewards",
        args: [],
      });
      await tx;
      refreshData();
      window.location.reload();
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  const handleInitialize = async () => {
    console.log("Initializing with amount:", amount);
    if (!amount) return;
    try {
      await handleApprove();
      const tx = await writeContractAsync({
        abi: stakingAbi,
        address: addressContract as Address,
        functionName: "initialize",
        args: [parseUnits(amount, 18)],
      });
      await tx;
      fetchInitializationStatus();
      window.location.reload();
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };

  const getAllTokenBalances = async () => {
    if (!addressUser || !isConnected) return {};
    const tokenContract = new ethers.Contract(addressToken, tokenAbi, provider);
    const balance = await tokenContract.balanceOf(addressUser);
    return { [addressToken]: balance };
  };

  const refreshData = async () => {
    await refetchBalance();
    await refetchStakedData();
    await refetchPendingRewards();
    await refetchReserve();
    fetchInitializationStatus();

    const balances = await getAllTokenBalances();
    setTokenBalances(balances);
  };

  return (
    <Card className="bg-secondary text-white rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>Stake Tokens</CardTitle>
        <CardDescription>Contract Address: {addressContract}</CardDescription>
        <CardDescription>Token Address: {addressToken}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isInitialized === false && isAdmin === true && (
          <StakingFactoryModalInitializeStake
            onInitialize={handleInitialize}
            reserved={amount}
            setReserved={setAmount}
          />
        )}
        {isInitialized === true && (
          <form onSubmit={handleStake}>
            <div className="space-y-2">
              <Label htmlFor={`amount-${addressContract}`}>
                Amount of Tokens
              </Label>
              <Input
                id={`amount-${addressContract}`}
                name="amount"
                placeholder="0.00"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="flex flex-row-reverse space-x-reverse space-x-6 justify-between">
                {balance !== undefined && (
                  <span className="text-xs">
                    Balance: {parseFloat(formatEther(balance)).toFixed(2)}
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
                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleClaim}
                  >
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
        )}
      </CardContent>
    </Card>
  );
};

export default StakePoolCard;