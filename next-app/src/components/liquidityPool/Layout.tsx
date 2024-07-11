"use client";
import AddPoolModal from "@/components/liquidityPool/AddPoolModal";
import LiquidityPoolList from "@/components/liquidityPool/LiquidityPoolList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { getPools } from "@/hook/pools.hook";
import { getTokens } from "@/hook/tokens.hook";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useFetchTokensPairsByAddressList } from "../../hook/useFetchTokenPairs";
import { useAccount, useReadContract } from "wagmi";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { liquidityFactoryAddress } from "@/abi/address";
// Connect pools in to doo to display in the UI

export type TokenPair = {
  id: number;
  address: string;
  tokenA: string;
  tokenB: string;
};

export default function Layout({ tokens }: { tokens: any }) {
  const { address, chainId } = useAccount();
  const [showModal, setShowModal] = useState(false);
  // Use tanstack/react-query to fetch data from the server

  const { data: listOfAddress } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsAddress",
    address: liquidityFactoryAddress as `0x${string}`,
    chainId,
  });

  console.log("listOfAddress", listOfAddress);
  const pairs = useFetchTokensPairsByAddressList(listOfAddress, chainId);

  return (
    <div className="w-full flex justify-center ">
      <div className="w-2/3">
        <div className="my-12 flex justify-between items-center ">
          <h1 className="text-3xl font-semibold">List of Pools</h1>
          <Button
            onClick={() => setShowModal(true)}
            size="lg"
            className="flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Pool
          </Button>
        </div>
        {showModal && <AddPoolModal />}

        <div className="grid grid-row gap-4">
          <LiquidityPoolList pairs={pairs} />
        </div>
      </div>
    </div>
  );
}
