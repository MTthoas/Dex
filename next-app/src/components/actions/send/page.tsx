import { CustomConnectButton } from "@/components/common/ConnectButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { parseEther } from "viem";
import { useSendTransaction, useSwitchChain } from "wagmi";
import { SendCardProps } from "../actions.type";
import { findChainWithStringValue } from "../page";
import { Send_Combobox } from "./Send_Combobox";

export default function SendCard({
  isConnected,
  chains,
  balance,
  cryptoSelected,
  setCryptoSelected,
  account,
  chaindId,
}: SendCardProps) {
  const { switchChain } = useSwitchChain();
  const { sendTransaction, isPending, isSuccess, isError } =
    useSendTransaction();
  const [price, setPrice] = useState<String>("0.0000");
  const [amount, setAmount] = useState<String>("0");

  const handleSwitchChain = () => {
    const selectedTokenChain = findChainWithStringValue(cryptoSelected);
    if (
      selectedTokenChain &&
      selectedTokenChain.chainId &&
      selectedTokenChain.chainId !== chaindId
    ) {
      switchChain({ chainId: selectedTokenChain.chainId });
    }
  };

  const handleTransfer = () => {
    sendTransaction({
      to: account?.address,
      value: parseEther(amount.toString()),
      chainId: findChainWithStringValue(cryptoSelected)?.chainId,
    });
  };

  const handleInputChange = (value: string) => {
    setAmount(value);
    console.log(value);
    if (value === "0" || value === "") {
      setPrice("0.00");
      return;
    }
    // Simuler un taux de conversion ETH en USD (fictif)
    const price = parseFloat(value) * 3500;
    setPrice(price.toFixed(4));

    console.log(amount);
  };

  console.log("CryptoSelected", cryptoSelected);
  return (
    <Card className="bg-secondary text-primary rounded-lg shadow-lg  h-[510px]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary">Send</CardTitle>
        <CardDescription className="text-sm">
          Send tokens to an address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Send_Combobox
              chains={chains}
              cryptoSelected={cryptoSelected}
              setCryptoSelected={setCryptoSelected}
              chainId={chaindId}
            />
          </div>
          <span className="text-xs">Balance: {Number(balance).toFixed(4)}</span>
        </div>
        <div className=" mb-3">
          <div>
            <CardDescription className="text-sm mt-4 mb-2">
              Give an address
            </CardDescription>
            <div>
              <Input className="" placeholder="0x.." type="text" />
            </div>
          </div>
          <CardDescription className="text-sm mt-4 mb-2">
            Amount to send
          </CardDescription>
          <div className="mt-1">
            <Input
              type="string"
              className=" "
              placeholder="Enter amount in USD"
              value={String(amount)}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <h2 className="text-lg mt-3">{"You're sending"}</h2>
            <div className="relative text-2xl font-bold">${price || 0}</div>
          </div>
          <div className="mt-11">
            {isConnected ? (
              <>
                {chaindId ===
                  findChainWithStringValue(cryptoSelected)?.chainId && (
                  <Button
                    onClick={handleTransfer}
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending ? "Sending..." : "Send Transaction"}
                  </Button>
                )}
                {chaindId !==
                  findChainWithStringValue(cryptoSelected)?.chainId && (
                  <Button
                    onClick={handleSwitchChain}
                    className="w-full"
                    disabled={isPending}
                  >
                    {isPending ? "Switching..." : "Switch Chain"}
                  </Button>
                )}
              </>
            ) : (
              <CustomConnectButton />
            )}
            {isSuccess && (
              <div className="text-green-500 mt-2">Transaction successful!</div>
            )}
            {isError && (
              <div className="text-red-500 mt-2">Transaction failed.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
