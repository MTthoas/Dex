import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { ethers } from 'ethers';
import { stakingAbi } from '../../abi/Staking';
import { tokenAbi } from '../../abi/ERC20Upgradeable';
import { useEthersProvider, useEthersSigner } from '../../config/ethers';

export default function StakingCard() {
  const tokenAddress = process.env.NEXT_PUBLIC_GENX_ADDRESS as `0x${string}`;
  const stakingAddress = process.env.NEXT_PUBLIC_STAKING_ADDRESS as `0x${string}`;
  const { address: addressUser, isConnected } = useAccount();

  const provider = useEthersProvider();
  const signer = useEthersSigner();
  const [amount, setAmount] = useState("");
  const { writeContract } = useWriteContract();

  const { data: balance } = useReadContract({
    abi: tokenAbi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [addressUser],
  });

  const { data: stakedData } = useReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'getStakedAmount',
    args: [addressUser as `0x${string}`],
  });

  const { data: pendingRewards } = useReadContract({
    abi: stakingAbi,
    address: stakingAddress,
    functionName: 'pendingRewards',
    args: [addressUser as `0x${string}`],
  });

  const handleApprove = async () => {
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
    const tx = await tokenContract.approve(stakingAddress, ethers.parseUnits(amount || "0", 18));
    await tx.wait();
    console.log("Approved:", tx.hash);
  };

  const handleStake = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleApprove();
    const tx = await writeContract({
      abi: stakingAbi,
      address: stakingAddress,
      functionName: 'stake',
      args: [amount ? BigInt(amount) : BigInt(0)],
    });
  };

  const handleUnstake = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const tx = await writeContract({
      abi: stakingAbi,
      address: stakingAddress,
      functionName: 'unstake',
      args: [amount ? BigInt(amount) : BigInt(0)],
    });
  };
  

  useEffect(() => {
    if (balance !== undefined) {
      console.log("Balance:", balance);
    }
    if (addressUser !== undefined) {
      console.log("Adresse:", addressUser);
    }
    if (tokenAddress !== undefined) {
      console.log("Adresse du token:", tokenAddress);
    }
    if (stakingAddress !== undefined) {
      console.log("Adresse du staking:", stakingAddress);
    }
    if (stakedData !== undefined) {
      console.log("Staked:", stakedData.toString());
    }
    if (pendingRewards !== undefined) {
      console.log("Pending rewards:", pendingRewards.toString());
    }
  }, [balance, addressUser, tokenAddress, stakingAddress, stakedData, pendingRewards]);

  return (
    <Card className="bg-secondary text-white rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle>Stake GEN Tokens</CardTitle>
        <CardDescription>Enter the amount to stake your GEN tokens.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleStake}>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount of Tokens</Label>
            <Input id="amount" name="amount" placeholder="0.00" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="flex flex-row-reverse space-x-reverse space-x-6 justify-between">
            <span className="text-xs">Balance: {balance ? balance.toString() : "0"} GEN</span>
            <span className="text-xs">Staked: {stakedData ? stakedData.toString() : "0"}</span>
            <span className="text-xs">Earn: {pendingRewards ? pendingRewards.toString() : "0"}</span>
          </div>
        </div>
          <CardFooter className="flex space-x-2">
            {isConnected ? (
              <>
                <Button className="w-full" type="submit">
                  Stake Tokens
                </Button>
                <Button className="w-full" type="button" onClick={handleUnstake}>
                  Unstake Tokens
                </Button>
              </>
            ) : (
              <span className="text-xs text-red-500">Please connect your wallet to stake/unstake tokens.</span>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}