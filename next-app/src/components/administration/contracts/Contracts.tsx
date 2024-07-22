"use client";

import { liquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
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
import { useAccount, useReadContract } from "wagmi";

const Contracts = () => {
  const { address, chainId } = useAccount();
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signer = getSigner(chainId);

  const FactoryContract = useFactoryContract({
    address: liquidityFactoryAddress,
    chainId,
  });

  const { data: allPoolsLength } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsLength",
    address: liquidityFactoryAddress,
    chainId,
  });

  console.log(allPoolsLength);

  const handleCreatePool = async () => {
    if (!ethers.isAddress(tokenA) || !ethers.isAddress(tokenB)) {
      toast.error("Invalid address format");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const tx = await FactoryContract.createPool(
        tokenA as Address,
        tokenB as Address,
        address,
        30,
        address,
        address
      );
      await tx.wait();
      toast.success("Pool created successfully");
      setShowModal(false); // Close the modal after creating the pool
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
              onClick={() => setShowModal(true)}
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
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
              onClick={() => setShowModal(false)}
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
    </div>
  );
};

export default Contracts;
