import { ERC20 } from "@/abi/ERC20";
import { CustomConnectButton } from "@/components/common/ConnectButton";
import { getSigner } from "@/components/dashboard/Contracts";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postTransaction } from "@/hook/transactions.hook";
import { EnumTransactionType } from "@/types/transaction.type";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { parseEther } from "viem";
import { SendCardProps } from "../actions.type";

export default function SendCard({
  isConnected,
  balance,
  cryptoSelected,
  tokens,
  allTokens,
  setCryptoSelected,
  account,
  chainId,
  queryClient,
}: SendCardProps) {
  const [amount, setAmount] = useState<String>("0");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState("");
  const [tokenBalance, setTokenBalance] = useState<String>("0");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const signer = getSigner(chainId);

  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const mutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

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
  }, [selectedTokenAddress, account, refresh]);

  const handleTransfer = async () => {
    console.log("Recipient address", recipientAddress);
    console.log("Amount", amount);
    if (!recipientAddress || !amount) {
      return;
    }

    setIsLoading(true);

    const tokenContract = new ethers.Contract(
      selectedTokenAddress,
      ERC20,
      signer
    );

    try {
      const tx = await tokenContract.transfer(
        recipientAddress,
        parseEther(amount.toString())
      );

      tx.wait();

      mutation.mutate({
        amount: Number(amount),
        created_at: new Date().toISOString(),
        from: account.address,
        hash: tx.hash,
        amount_a: Number(amount),
        amount_b: 0,
        symbol_a: cryptoSelected,
        symbol_b: "",
        to: recipientAddress,
        type: EnumTransactionType.Send,
        updated_at: new Date().toISOString(),
      });

      setTransactionHash(tx.hash);
      setIsLoading(false);
      setRefresh(!refresh);
      toast.success("Transaction successful", {
        description:
          "Transaction hash : https://amoy.polygonscan.com/tx/" + tx.hash,
      });
    } catch (error) {
      setIsLoading(false);
      toast.error("Transaction failed", {
        description: error.message,
      });
      console.error("Transaction failed", error);
    }
  };

  const handleInputChange = (value: string) => {
    setAmount(value);
  };

  return (
    <>
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
              <Select
                value={cryptoSelected}
                onValueChange={(e) => setCryptoSelected(e)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {cryptoSelected === "Amoy" ? "GENX" : cryptoSelected}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {allTokens.map((token) => (
                    <SelectItem key={token.token} value={token.token}>
                      {token.token}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <div className="relative text-2xl font-bold">
                {amount || 0}{" "}
                {cryptoSelected == "Select a token" ? "" : cryptoSelected}
              </div>
            </div>
            <div className="mt-11">
              {isConnected ? (
                isLoading ? (
                  <Button disabled className="w-full">
                    <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
                    Loading...
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setIsLoading(true);
                      handleTransfer().then(() => setIsLoading(false));
                    }}
                  >
                    Send
                  </Button>
                )
              ) : (
                <CustomConnectButton />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Transaction Successful</DialogTitle>
          <DialogDescription>
            Your transaction has been processed successfully.
            <br />
            Transaction Hash:{" "}
            <span className="font-mono text-sm">{transactionHash}</span>
          </DialogDescription>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
