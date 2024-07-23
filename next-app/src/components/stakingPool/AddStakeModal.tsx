"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import { useAccount, useWriteContract } from "wagmi";
import { stakingFactoryAbi } from "@/abi/StakingFactory";
import { useState, useEffect } from "react";
import { Address } from "viem";
import { StakingFactoryAddress } from "@/abi/address";
import { liquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { polygonAmoy } from "viem/chains";
import { useReadContract } from "wagmi";
import { useFetchTokensPairsByAddressList } from "@/hook/useFetchTokenPairs";


// Define the Token type
interface Token {
  token: string;
  address: string;
  totalSupply: bigint;
}

export default function StakingFactoryModalAddStake() {
  const { writeContractAsync: writeContractAsync } = useWriteContract();
  const [selectedToken, setSelectedToken] = useState<string>("");
  const account = useAccount();
  const { address: addressUser } = account;
  const chainId = account.chainId ? account.chainId : polygonAmoy.id;

  const { data: listOfAddress } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsAddress",
    address: liquidityFactoryAddress,
    chainId,
  });

  const { allTokens }: { allTokens: Token[] } = useFetchTokensPairsByAddressList(
    listOfAddress,
    chainId
  );

  useEffect(() => {
    if (allTokens && allTokens.length > 0) {
      setSelectedToken(allTokens[0].address); // Default to the first token's address
    }
  }, [allTokens]);

  const handleCreate = async () => {
    if (!addressUser || !selectedToken) return;
    try {
      const tx = await writeContractAsync({
        abi: stakingFactoryAbi,
        functionName: "createStakingContract",
        args: [selectedToken as Address, addressUser as Address],
        address: StakingFactoryAddress as Address,
      });
      await tx;

      window.location.reload();
    } catch (error) {
      console.error("Transaction failed", error);
    }
  };  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-8 ml-2 bg-white text-black">Create Staking Pool</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Staking Pool</DialogTitle>
          <DialogDescription>Set up the new Staking Pool</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="token" className="text-right">
              Token
            </Label>
            <select
              id="token"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="col-span-3"
            >
              {allTokens.map((token, index) => (
                <option key={index} value={token.address}>
                  {token.token}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="addressUser" className="text-right">
              Address of the admin
            </Label>
            <Input
              id="addressUser"
              placeholder="0x..."
              value={addressUser || ""}
              className="col-span-3"
              readOnly
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Create it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}