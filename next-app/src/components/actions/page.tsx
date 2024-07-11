"use client";
import { liquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import SendCard from "@/components/actions/send/page";
import SwapCard from "@/components/actions/swap/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chains } from "@/context";
import { useFetchTokensPairsByAddressList } from "@/hook/useFetchTokenPairs";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useChainId, useReadContract } from "wagmi";

export function findChainWithStringValue(value: string) {
  return chains.find((token) => token.value === value);
}

export default function ActionPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [cryptoSelected, setCryptoSelected] = useState("Amoy");
  const [balance, setBalance] = useState<String>("0.00");

  const account = useAccount();
  const { address, chainId } = useAccount();

  const { data: listOfAddress } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsAddress",
    address: liquidityFactoryAddress as `0x${string}`,
    chainId,
  });

  const pairs = useFetchTokensPairsByAddressList(listOfAddress, chainId);

  return (
    <div>
      <Tabs defaultValue="swap" className="w-[375px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
        </TabsList>
        <TabsContent value="swap">
          <SwapCard
            address={address}
            isConnected={isConnected}
            chains={chains}
            pairs={pairs}
            cryptoSelected={cryptoSelected}
            setCryptoSelected={setCryptoSelected}
            chainId={chainId}
          />
        </TabsContent>
        <TabsContent value="send">
          <SendCard
            isConnected={isConnected}
            chains={chains}
            balance={[]}
            cryptoSelected={cryptoSelected}
            setCryptoSelected={setCryptoSelected}
            account={account}
            chaindId={chainId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
