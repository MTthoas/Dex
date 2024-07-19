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
import { useState, useEffect } from "react";
import { parseEther } from "viem";
import { useSendTransaction, useSwitchChain } from "wagmi";
import { SendCardProps } from "../actions.type";
import { findChainWithStringValue } from "../page";
import { ethers } from "ethers";
import { ERC20 } from "@/abi/ERC20";
import { getSigner } from "@/components/dashboard/Contracts";

export default function SendCard({
  isConnected,
  balance,
  cryptoSelected,
  tokens,
  allTokens, // Ajout de allTokens
  setCryptoSelected,
  account,
  chainId,
}: SendCardProps) {
  const { switchChain } = useSwitchChain();
  const { sendTransaction, isPending, isSuccess, isError } =
    useSendTransaction();
  const [price, setPrice] = useState<String>("0.0000");
  const [amount, setAmount] = useState<String>("0");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState<String>("0");
  const signer = getSigner(chainId);

  useEffect(() => {
    if (allTokens && cryptoSelected && allTokens.length > 0) {
      const selectedToken = allTokens.find(
        (token) => token.token === cryptoSelected
      );
      setSelectedTokenAddress(selectedToken ? selectedToken.address : "");
    }
  }, [cryptoSelected, allTokens]);

  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (selectedTokenAddress && account) {
        const tokenContract = new ethers.Contract(
          selectedTokenAddress,
          ERC20,
          signer
        );
        const balance = await tokenContract.balanceOf(account.address);
        setTokenBalance(Number(ethers.formatEther(balance)).toFixed(4));
      }
    };

    if (selectedTokenAddress) {
      fetchTokenBalance();
    }
  }, [selectedTokenAddress, account]);

  const handleTransfer = () => {
    sendTransaction({
      to: recipientAddress,
      value: parseEther(amount.toString()),
      chainId: findChainWithStringValue(cryptoSelected)?.chainId,
    });
  };

  const handleInputChange = (value: string) => {
    setAmount(value);
    if (value === "0" || value === "") {
      setPrice("0.00");
      return;
    }
    // Simuler un taux de conversion ETH en USD (fictif)
    const price = parseFloat(value) * 3500;
    setPrice(price.toFixed(4));
  };

  return (
    <Card className="bg-secondary text-primary rounded-lg shadow-lg h-[510px]">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary">Send</CardTitle>
        <CardDescription className="text-sm">
          Send tokens to an address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <select
              value={cryptoSelected}
              onChange={(e) => setCryptoSelected(e.target.value)}
            >
              <option value="">Select a token</option>
              {allTokens &&
                allTokens.map((token) => (
                  <option key={token.token} value={token.token}>
                    {token.token}
                  </option>
                ))}
            </select>
          </div>
          <span className="text-xs">Balance: {tokenBalance}</span>
        </div>
        <div className="mb-3">
          <div>
            <CardDescription className="text-sm mt-4 mb-2">
              Give an address
            </CardDescription>
            <div>
              <Input
                className=""
                placeholder="0x.."
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
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
                <Button
                  onClick={handleTransfer}
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send Transaction"}
                </Button>
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
