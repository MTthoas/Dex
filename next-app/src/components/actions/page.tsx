"use client";
import SendCard from "@/components/actions/send/page";
import SwapCard from "@/components/actions/swap/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { chains } from "@/context";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useAccount, useBalance, useSendTransaction } from "wagmi";

function findChainWithStringValue(value: string) {
  return chains.find((token) => token.value === value);
}

export default function ActionPage() {
  const [address, setAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [cryptoSelected, setCryptoSelected] = useState("Amoy");
  const [balance, setBalance] = useState<String>("0.00");

  const account = useAccount();
  const { sendTransaction } = useSendTransaction();

  const { data: balanceCrypto } = useBalance({
    address: account?.address,
    chainId: findChainWithStringValue(cryptoSelected)?.chainId,
  });

  const handleTransfer = (value) => {
    if (account?.address === undefined) return;
    console.log("toto");
    sendTransaction({
      to: account?.address,
      value: parseEther("0.01"),
      chainId: findChainWithStringValue(cryptoSelected)?.chainId,
    });
  };

  useEffect(() => {
    const int = parseInt(balanceCrypto?.formatted || 0);
    setBalance(String(balanceCrypto?.formatted || 0));
  }, [balanceCrypto]);

  useEffect(() => {
    if (account.address) {
      setAddress(account.address);
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
          <SwapCard isConnected={isConnected} />
        </TabsContent>
        <TabsContent value="send">
          <SendCard
            isConnected={isConnected}
            tokens={chains}
            balance={balance}
            cryptoSelected={cryptoSelected}
            setCryptoSelected={setCryptoSelected}
            handleTransfer={handleTransfer}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
