"use client";
import SendCard from "@/components/actions/send/page";
import SwapCard from "@/components/actions/swap/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chains } from "@/context";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useChainId } from "wagmi";

export function findChainWithStringValue(value: string) {
  return chains.find((token) => token.value === value);
}

export default function ActionPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [cryptoSelected, setCryptoSelected] = useState("Amoy");
  const [balance, setBalance] = useState<String>("0.00");

  const account = useAccount();
  const chainId = useChainId();

  const { data: balanceCrypto } = useBalance({
    address: account?.address,
    chainId: findChainWithStringValue(cryptoSelected)?.chainId,
  });

  useEffect(() => {
    if (balanceCrypto) {
      setBalance(String(balanceCrypto?.formatted || 0));
    }
  }, [balanceCrypto]);

  useEffect(() => {
    if (account.address) {
      setIsConnected(true);
    }
  }, [account.address]);

  console.log(findChainWithStringValue(cryptoSelected));
  return (
    <div>
      <Tabs defaultValue="swap" className="w-[375px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="send">Send</TabsTrigger>
        </TabsList>
        <TabsContent value="swap">
          <SwapCard
            isConnected={isConnected}
            chains={chains}
            cryptoSelected={cryptoSelected}
            setCryptoSelected={setCryptoSelected}
            chainId={chainId}
          />
        </TabsContent>
        <TabsContent value="send">
          <SendCard
            isConnected={isConnected}
            chains={chains}
            balance={balance}
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
