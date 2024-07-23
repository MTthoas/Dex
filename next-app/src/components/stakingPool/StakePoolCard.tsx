"use client";
import { ContractsOwnerAddress } from "@/abi/address";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/context";
import { postTransaction } from "@/hook/transactions.hook";
import {
  useReadStakingContractGetReserve,
  useReadStakingContractGetStakedAmount,
  useReadStakingContractIsInitialized,
  useReadStakingContractPendingRewards,
} from "@/hook/WagmiGenerated";
import { useMutation } from "@tanstack/react-query";
import { ethers, formatEther, parseUnits } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { tokenAbi } from "../../abi/ERC20Upgradeable";
import { stakingAbi } from "../../abi/Staking";
import { useEthersProvider, useEthersSigner } from "../../config/ethers";
import StakingFactoryModalInitializeStake from "./InitializeStakeModal";

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
  const { writeContractAsync: writeContractAsync } = useWriteContract();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState({
    approve: false,
    stake: false,
    unstake: false,
    claim: false,
    initialize: false,
  });

  const { data: isInitializedData, refetch: fetchInitializationStatus } =
    useReadStakingContractIsInitialized({
      address: addressContract as Address,
    });

  const { data: Symbol } = useReadContract({
    abi: tokenAbi,
    address: addressToken as Address,
    functionName: "symbol",
  });

  console.log(Symbol);

  const mutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
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
    if (
      isConnected &&
      ContractsOwnerAddress.some(
        (addr) => addr.toLowerCase() === addressUser?.toLowerCase()
      )
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isConnected, addressUser]);

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
    setLoading((prev) => ({ ...prev, approve: true }));
    try {
      const tokenContract = new ethers.Contract(addressToken, tokenAbi, signer);
      const tx = await tokenContract.approve(
        addressContract,
        ethers.parseUnits(amount || "0", 18)
      );
      await tx.wait();
    } catch (error) {
      console.error("Approval failed", error);
    } finally {
      setLoading((prev) => ({ ...prev, approve: false }));
    }
  };

  const handleStake = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!amount) return;
    setLoading((prev) => ({ ...prev, stake: true }));
    try {
      await handleApprove();
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await writeContractAsync({
        abi: stakingAbi,
        functionName: "stake",
        address: addressContract as Address,
        args: [parsedAmount],
      });
      await tx.wait();
      refreshData();

      mutation.mutate({
        amount: parseFloat(amount),
        created_at: new Date().toISOString(),
        from: addressUser as string,
        to: addressContract as string,
        amount_a: parseFloat(amount),
        amount_b: 0,
        symbol_a: Symbol,
        symbol_b: "",
        hash: tx.hash,
        type: "Stake",
        updated_at: new Date().toISOString(),
      });

      toast.success("Stake successful!", {
        description:
          "Transaction hash : https://amoy.polygonscan.com/tx/" + tx.hash,
      });
    } catch (error) {
      console.error("Stake failed", error);
    } finally {
      setLoading((prev) => ({ ...prev, stake: false }));
    }
  };

  const handleUnstake = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!amount) return;
    setLoading((prev) => ({ ...prev, unstake: true }));
    try {
      await handleApprove();
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await writeContractAsync({
        abi: stakingAbi,
        address: addressContract as Address,
        functionName: "unstake",
        args: [parsedAmount],
      });
      await tx.wait();

      mutation.mutate({
        amount: parseFloat(amount),
        created_at: new Date().toISOString(),
        from: addressContract as string,
        to: addressUser as string,
        amount_a: parseFloat(amount),
        amount_b: 0,
        symbol_a: Symbol,
        symbol_b: "",
        hash: tx.hash,
        type: "Unstake",
        updated_at: new Date().toISOString(),
      });

      toast.success("Unstake successful!", {
        description:
          "Transaction hash : https://amoy.polygonscan.com/tx/" + tx.hash,
      });

      refreshData();
    } catch (error) {
      console.error("Unstake failed", error);
    } finally {
      setLoading((prev) => ({ ...prev, unstake: false }));
    }
  };

  const handleClaim = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, claim: true }));
    try {
      const tx = await writeContractAsync({
        abi: stakingAbi,
        address: addressContract as Address,
        functionName: "claimRewards",
        args: [],
      });
      await tx.wait();

      mutation.mutate({
        amount: parseFloat(amount),
        created_at: new Date().toISOString(),
        from: addressContract as string,
        to: addressUser as string,
        amount_a: parseFloat(amount),
        amount_b: 0,
        symbol_a: Symbol,
        symbol_b: "",
        hash: tx.hash,
        type: "Claim",
        updated_at: new Date().toISOString(),
      });

      toast.success("Claim successful!", {
        description:
          "Transaction hash : https://amoy.polygonscan.com/tx/" + tx.hash,
      });

      refreshData();
    } catch (error) {
      console.error("Claim failed", error);
    } finally {
      setLoading((prev) => ({ ...prev, claim: false }));
    }
  };

  const handleInitialize = async () => {
    if (!amount) return;
    setLoading((prev) => ({ ...prev, initialize: true }));
    try {
      await handleApprove();
      const tx = await writeContractAsync({
        abi: stakingAbi,
        address: addressContract as Address,
        functionName: "initialize",
        args: [parseUnits(amount, 18)],
      });
      await tx.wait();
      fetchInitializationStatus();
    } catch (error) {
      console.error("Initialization failed", error);
    } finally {
      setLoading((prev) => ({ ...prev, initialize: false }));
    }
  };

  const getAllTokenBalances = async () => {
    if (!addressUser || !isConnected) return {};
    const tokenContract = new ethers.Contract(addressToken, tokenAbi, provider);
    const balance = await tokenContract.balanceOf(addressUser);
    return { [addressToken]: balance };
  };

  const refreshData = async () => {
    await refetchStakedData();
    await refetchPendingRewards();
    await refetchReserve();
    fetchInitializationStatus();

    const balances = await getAllTokenBalances();
    console.log("balances", balances);
    setTokenBalances(balances);
  };

  return (
    <Card className="bg-secondary rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>Stake Tokens</CardTitle>
        <CardDescription>Contract Address: {addressContract}</CardDescription>
        <CardDescription>Token Address: {addressToken}</CardDescription>
        <CardDescription>Symbol: {Symbol}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isInitialized === false && isAdmin === true && (
          <StakingFactoryModalInitializeStake
            onInitialize={handleInitialize}
            reserved={amount}
            setReserved={setAmount}
          />
        )}
        {isInitialized === false && isAdmin === false && (
          <span className="text-xs text-red-500">
            Contract is not initialized yet.
          </span>
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
              <div className="flex flex-row-reverse space-x-reverse space-x-3 justify-between">
                {tokenBalances[addressToken] !== undefined && (
                  <span className="text-xs">
                    Balance:{" "}
                    {parseFloat(
                      formatEther(tokenBalances[addressToken])
                    ).toFixed(1)}
                    {" " + Symbol}
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
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={loading.stake}
                    >
                      {loading.stake ? "Staking..." : "Stake Tokens"}
                    </Button>
                    <Button
                      className="w-full"
                      type="button"
                      onClick={handleUnstake}
                      disabled={loading.unstake}
                    >
                      {loading.unstake ? "Unstaking..." : "Unstake Tokens"}
                    </Button>
                  </div>
                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleClaim}
                    disabled={loading.claim}
                  >
                    {loading.claim ? "Claiming..." : "Claim Rewards"}
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
