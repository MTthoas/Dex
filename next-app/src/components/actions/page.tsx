"use client";
import { liquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import SendCard from "@/components/actions/send/page";
import SwapCard from "@/components/actions/swap/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chains } from "@/context";
import {
  useFetchTokensPairsByAddressList,
  useFetchTokensSymbol,
} from "@/hook/useFetchTokenPairs";
import { useState, useEffect } from "react";
import { polygonAmoy } from "viem/chains";
import { useAccount, useReadContract } from "wagmi";
import { Skeleton } from "../ui/skeleton";

export function findChainWithStringValue(value) {
  return chains.find((token) => token.value === value);
}

function extractTokensWithSupplyAndAddress(pairs) {
  return pairs.flatMap((pair) => {
    const tokens = [];
    for (const key in pair) {
      if (
        key.startsWith("token") &&
        !key.endsWith("Address") &&
        !key.endsWith("Supply")
      ) {
        const tokenKey = key;
        const addressKey = `${tokenKey}Address`;
        const supplyKey = `${tokenKey}Supply`;

        if (pair[addressKey]) {
          tokens.push({
            token: pair[tokenKey],
            address: pair[addressKey],
            supply: pair[supplyKey],
          });
        }
      }
    }
    return tokens;
  });
}

export default function ActionPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [cryptoSelected, setCryptoSelected] = useState("Amoy");
  const [balance, setBalance] = useState<String>("0.00");
  const [isSSR, setIsSSR] = useState(true); // New state to handle SSR

  const account = useAccount();
  const { address } = account;
  const chainId = account.chainId ? account.chainId : polygonAmoy.id;

  const { data: listOfAddress } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsAddress",
    address: liquidityFactoryAddress,
    chainId,
  });

  const { pairs, allTokens } = useFetchTokensPairsByAddressList(
    listOfAddress,
    chainId
  );

  useEffect(() => {
    setIsSSR(false); // Set to false after the first render
  }, []);

  useEffect(() => {
    if (address) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [address]);

  if (isSSR) {
    return null; // Render nothing on the first server-side render
  }

  if (!address) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <a className="text-2xl font-bold">Please connect your wallet</a>
      </div>
    );
  }

  console.log(allTokens);
  console.log("pairs", pairs);

  return (
    <div>
      <Tabs defaultValue="swap" className="w-[375px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
        </TabsList>
        <TabsContent value="swap">
          {allTokens && allTokens.length > 0 ? (
            <SwapCard
              address={address}
              isConnected={isConnected}
              chains={chains}
              pairs={pairs}
              allTokens={allTokens}
              cryptoSelected={cryptoSelected}
              setCryptoSelected={setCryptoSelected}
              chainId={chainId}
            />
          ) : (
            <Skeleton className="h-[510px] w-full rounded-xl" />
          )}
        </TabsContent>
        <TabsContent value="send">
          {allTokens && allTokens.length > 0 ? (
            <SendCard
              isConnected={isConnected}
              chains={chains}
              tokens={[]}
              balance={[]}
              allTokens={allTokens}
              cryptoSelected={cryptoSelected}
              setCryptoSelected={setCryptoSelected}
              account={account}
              chainId={chainId}
            />
          ) : (
            <Skeleton className="h-[510px] w-[250px] rounded-xl" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
