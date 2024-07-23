"use client";

import { liquidityFactoryAddress, StakingFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { stakingFactoryAbi } from "@/abi/StakingFactory";
import {
  getSigner,
  useFactoryContract,
} from "@/components/dashboard/Contracts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ethers } from "ethers";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Address } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

const Contracts = () => {
  const { address, chainId } = useAccount();
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [showModalLiquidity, setShowModalLiquidity] = useState(false);
  const [showModalStaking, setShowModalStaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signer = getSigner(chainId);

  const FactoryContractLiquidity = useFactoryContract({
    address: liquidityFactoryAddress,
    chainId,
  });

  const { writeContractAsync: writeContractAsync } = useWriteContract();

  const { data: allPoolsLength } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsLength",
    address: liquidityFactoryAddress,
    chainId,
  });

  const { data: stakingContracts } = useReadContract({
    abi: stakingFactoryAbi,
    functionName: "getAllStakingContracts",
    address: StakingFactoryAddress,
    chainId: chainId,
  });

  const handleCreatePool = async () => {
    if (!ethers.isAddress(tokenA) || !ethers.isAddress(tokenB)) {
      toast.error("Invalid address format");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const tx = await FactoryContractLiquidity.createPool(
        tokenA as Address,
        tokenB as Address,
        address,
        30,
        address,
        address
      );
      await tx.wait();
      toast.success("Pool created successfully");
      setShowModalLiquidity(false); // Close the modal after creating the pool
    } catch (error) {
      const errorMessage = error.message.match(/execution reverted: "([^"]+)"/);
      if (errorMessage && errorMessage[1]) {
        console.log("Extracted error:", errorMessage[1]);
        toast.error(errorMessage[1]);
      } else {
        console.log("Full error:", error.message);
        toast.error("An error occurred");
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleCreateStaking = async () => {
    if (!address || !selectedToken) {
      toast.error("Address or token not selected");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const tx = await writeContractAsync({
        abi: stakingFactoryAbi,
        functionName: "createStakingContract",
        args: [selectedToken as Address, address as Address],
        address: StakingFactoryAddress as Address,
      });
      await tx.wait();
      toast.success("Staking pool created successfully");
      setShowModalStaking(false); // Close the modal after creating the staking pool
      window.location.reload();
    } catch (error) {
      const errorMessage = error.message.match(/execution reverted: "([^"]+)"/);
      if (errorMessage && errorMessage[1]) {
        console.log("Extracted error:", errorMessage[1]);
        toast.error(errorMessage[1]);
      } else {
        console.log("Full error:", error.message);
        toast.error("An error occurred");
      }
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div>
      <div className="flex mt-3">
        <Card>
          <CardHeader>
            <CardTitle>LiquidityPool Contract Management</CardTitle>
            <CardDescription>
              Manage the liquidity pool factory.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button
              onClick={() => setShowModalLiquidity(true)}
              size="lg"
              className="flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Pool
            </Button>
            <div className="flex flex-col">
              <p> Address : {liquidityFactoryAddress} </p>
              <p> Number of pools : {Number(allPoolsLength)} </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex mt-3">
        <Card>
          <CardHeader>
            <CardTitle>StakingPool Contract Management</CardTitle>
            <CardDescription>
              Manage the staking pool factory.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button
              onClick={() => setShowModalStaking(true)}
              size="lg"
              className="flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Pool
            </Button>
            <div className="flex flex-col">
              <p> Address : {StakingFactoryAddress} </p>
              <p> Number of staking pools : {stakingContracts ? stakingContracts.length : 0} </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModalLiquidity} onOpenChange={setShowModalLiquidity}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Liquidity Pool</DialogTitle>
            <DialogDescription>
              Enter the address of the tokenA and tokenB to create a new pool
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              type="text"
              placeholder="0x... Address of the tokenA"
              onChange={(e) => setTokenA(e.target.value)}
            />
            <Input
              type="text"
              placeholder="0x... Address of the tokenB"
              onChange={(e) => setTokenB(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowModalLiquidity(false)}
              disabled={isLoading} // Disable cancel button when loading
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleCreatePool}
              disabled={isLoading} // Disable confirm button when loading
            >
              {isLoading ? "Loading..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showModalStaking} onOpenChange={setShowModalStaking}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Staking Pool</DialogTitle>
            <DialogDescription>
              Enter the address of the token to create a new staking pool
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-3">
            <Input
              type="text"
              placeholder="0x... Address of the token"
              onChange={(e) => setSelectedToken(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowModalStaking(false)}
              disabled={isLoading} // Disable cancel button when loading
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleCreateStaking}
              disabled={isLoading} // Disable confirm button when loading
            >
              {isLoading ? "Loading..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;