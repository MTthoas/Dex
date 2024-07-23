"use client";
import { liquidityFactoryAddress, StakingFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { stakingFactoryAbi } from "@/abi/StakingFactory";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFetchTokensPairsByAddressList } from "@/hook/useFetchTokenPairs";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { polygonAmoy } from "viem/chains";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

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

  const { allTokens }: { allTokens: Token[] } =
    useFetchTokensPairsByAddressList(listOfAddress, chainId);

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
