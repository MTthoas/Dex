import { ERC20 } from "@/abi/ERC20";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { CustomConnectButton } from "@/components/common/ConnectButton";
import { getSigner } from "@/components/dashboard/Contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { postTransaction } from "@/hook/transactions.hook";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Chain } from "../actions.type";

export default function SwapCard({
  address,
  isConnected,
  chains,
  pairs,
  allTokens,
  cryptoSelected,
  setCryptoSelected,
  chainId,
  queryClient,
}: {
  address: any;
  isConnected: boolean;
  chains: Chain[];
  pairs: any;
  allTokens: any; // Add allTokens here
  cryptoSelected: any;
  setCryptoSelected: any;
  chainId: number;
  queryClient: any;
}) {
  const [selectedToken, setSelectedToken] = useState("");
  const [relatedToken, setRelatedToken] = useState("");
  const [relatedTokens, setRelatedTokens] = useState([]);
  const [poolAddress, setPoolAddress] = useState("");

  const [balanceA, setBalanceA] = useState(0);
  const [balanceB, setBalanceB] = useState(0);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");

  const [tokenASupply, setTokenASupply] = useState(0);
  const [tokenBSupply, setTokenBSupply] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const signer = getSigner(chainId);
  const [refresh, setRefresh] = useState(false);

  const mutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  useEffect(() => {
    const fetchAndSetTokenDetails = async () => {
      if (selectedToken) {
        const related = new Set(
          pairs
            .filter(
              (pair) =>
                pair.tokenA === selectedToken || pair.tokenB === selectedToken
            )
            .flatMap((pair) => [pair.tokenA, pair.tokenB])
            .filter((token) => token !== selectedToken)
        );
        setRelatedTokens([...related]);

        try {
          const data = allTokens.find((token) => token.token === selectedToken);
          if (data && data.address) {
            const tokenAContract = new ethers.Contract(
              data.address,
              ERC20,
              signer
            );
            const balanceOf = await tokenAContract.balanceOf(address);
            setBalanceA(Number(ethers.formatEther(balanceOf)).toFixed(2)); // Assuming balanceOf returns a BigNumber
            const totalSupply = await tokenAContract.totalSupply();
            setTokenASupply(Number(ethers.formatEther(totalSupply)).toFixed(2));
          }
        } catch (error) {
          console.error("Failed to fetch token details or balance:", error);
        }

        if (relatedToken) {
          try {
            const relatedData = allTokens.find(
              (token) => token.token === relatedToken
            );
            if (relatedData && relatedData.address) {
              const contractB = new ethers.Contract(
                relatedData.address,
                ERC20,
                signer
              );
              const balanceB = await contractB.balanceOf(address);
              setBalanceB(Number(ethers.formatEther(balanceB)).toFixed(2));
              const totalSupplyB = await contractB.totalSupply();
              setTokenBSupply(
                Number(ethers.formatEther(totalSupplyB)).toFixed(2)
              );
            }
          } catch (error) {
            console.error(
              "Failed to fetch related token details or balance:",
              error
            );
          }
        }

        const pool = pairs.find(
          (pair) =>
            (pair.tokenA === selectedToken && pair.tokenB === relatedToken) ||
            (pair.tokenA === relatedToken && pair.tokenB === selectedToken)
        );
        setPoolAddress(pool ? pool.address : "");
      }
    };

    fetchAndSetTokenDetails();
  }, [selectedToken, relatedToken, pairs, signer, address, allTokens, refresh]);

  useEffect(() => {
    if (cryptoSelected) {
      // setSelectedToken(cryptoSelected);
      handleAmountInChange({ target: { value: amountIn } });
    }
  }, [cryptoSelected, relatedToken]);

  const handleTokenChange = (event) => {
    setSelectedToken(event);
    if (!event) {
      setSelectedToken("");
    }
  };

  const handleRelatedTokenChange = (event) => {
    setRelatedToken(event);
  };

  const handleAmountInChange = (event) => {
    setAmountIn(event.target.value);
    if (
      event.target.value === "" ||
      !relatedToken ||
      !selectedToken ||
      event.target.value === "0" ||
      isNaN(Number(event.target.value))
    ) {
      setAmountOut("");
    }
    if (relatedToken !== "" || amountIn !== "") {
      const amountInWithFee = Number(event.target.value) * 0.9;
      const reserveIn = Number(tokenASupply);
      const reserveOut = Number(tokenBSupply);

      if (reserveIn > 0) {
        const numerator = amountInWithFee * reserveOut;
        const denominator = reserveIn + amountInWithFee;
        const amountOutValue = numerator / denominator;
        setAmountOut(amountOutValue);
      }
    }
  };

  const handleSwap = async () => {
    try {
      if (
        !selectedToken ||
        !relatedToken ||
        Number(amountIn) == 0 ||
        Number(amountOut) == 0
      )
        return;

      setIsLoading(true);

      console.log(amountIn, amountOut, selectedToken, relatedToken);

      const amountInWei = ethers.parseUnits(String(amountIn), 18);
      const amountOutWei = ethers.parseUnits(String(amountOut), 18);
      const swapContract = new ethers.Contract(
        poolAddress,
        LiquidityPoolABI,
        signer
      );

      const DataCurrent = allTokens.find(
        (token) => token.token === selectedToken
      );
      const DataRelated = allTokens.find(
        (token) => token.token === relatedToken
      );

      console.log(DataCurrent, DataRelated);

      const firstContract = new ethers.Contract(
        DataCurrent.address,
        ERC20,
        signer
      );
      const secondContract = new ethers.Contract(
        DataRelated.address,
        ERC20,
        signer
      );

      console.log(selectedToken);

      const approveTxFirst = await firstContract.approve(
        poolAddress,
        amountInWei
      );
      const approveTxSecond = await secondContract.approve(
        poolAddress,
        amountOutWei
      );

      await approveTxFirst.wait();
      toast.success(`Approval successful for ${selectedToken}`, {
        description:
          "Transaction hash : https://amoy.polygonscan.com/tx/" +
          approveTxFirst.hash,
      });
      await approveTxSecond.wait();
      toast.success(`Approval successful for ${selectedToken}`, {
        description:
          "Transaction hash : https://amoy.polygonscan.com/tx/" +
          approveTxSecond.hash,
      });

      // Make an useQuery to post transactions

      // useQuery({
      //   queryKey: ["transactions"],
      //   queryFn: postTransactions,
      // });

      const swapTx = await swapContract.swap(
        DataCurrent.address,
        amountInWei,
        1
      );
      await swapTx.wait();

      mutation.mutate({
        amount: Number(amountIn),
        created_at: new Date().toISOString(),
        from: address,
        hash: swapTx.hash,
        amount_a: Number(amountIn),
        amount_b: Number(amountOut),
        symbol_a: selectedToken,
        symbol_b: relatedToken,
        to: address,
        type: "swap",
        updated_at: new Date().toISOString,
      });

      toast.success("Swap successful!", {
        description:
          "Transaction hash : https://amoy.polygonscan.com/tx/" + swapTx.hash,
      });
      setIsLoading(false);
      setRefresh(!refresh);
    } catch (error) {
      toast.error("Swap failed", {
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handlePercentageClick = (percentage) => {
    const newAmount = (balanceA * percentage) / 100;
    handleAmountInChange({ target: { value: newAmount.toFixed(2) } });
  };

  return (
    <Card className="bg-secondary rounded-lg shadow-lg h-[510px]">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Swap</CardTitle>
        <CardDescription className="text-sm">
          Trade tokens in an instant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Select value={selectedToken} onValueChange={handleTokenChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a token" />
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
          <span className="text-xs">Balance: {balanceA}</span>
        </div>
        <div className="bg-[#2D2D3A] rounded-lg mb-4">
          <Input
            placeholder="0.0"
            value={amountIn}
            onChange={handleAmountInChange}
          />
        </div>
        <div className="flex space-x-2 mb-2">
          <Button
            className="bg-[#313140] text-xs h-6"
            variant="secondary"
            onClick={() => handlePercentageClick(2)}
          >
            2%
          </Button>
          <Button
            className="bg-[#313140] text-xs h-6"
            variant="secondary"
            onClick={() => handlePercentageClick(25)}
          >
            25%
          </Button>
          <Button
            className="bg-[#313140] text-xs h-6"
            variant="secondary"
            onClick={() => handlePercentageClick(50)}
          >
            50%
          </Button>
          <Button
            className="bg-[#313140] text-xs h-6"
            variant="secondary"
            onClick={() => handlePercentageClick(75)}
          >
            75%
          </Button>
          <Button
            className="bg-[#313140] text-xs h-6"
            variant="secondary"
            onClick={() => handlePercentageClick(100)}
          >
            MAX
          </Button>
        </div>
        <div>
          <div className="flex justify-center my-1">
            <ArrowDownIcon className="text-green-400 p-1 bg-secondary rounded-lg" />
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {selectedToken && (
                <Select
                  value={relatedToken}
                  onValueChange={handleRelatedTokenChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a token" />
                  </SelectTrigger>
                  <SelectContent>
                    {relatedTokens.map((token) => (
                      <SelectItem key={token} value={token}>
                        {token}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <span className="text-xs">Balance: {balanceB}</span>
          </div>
          <div className="bg-[#2D2D3A] rounded-lg mb-4">
            <Input placeholder="0.0" value={amountOut} readOnly />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs">Slippage Tolerance</span>
            <Badge className="text-xs" variant="secondary">
              0.5%
            </Badge>
          </div>
          <div className="pt-4">
            {address ? (
              isLoading ? (
                <Button disabled className="w-full">
                  <ReloadIcon className="mr-2 w-4 h-4 animate-spin" />
                  Loading...
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant="primary"
                  onClick={handleSwap}
                >
                  Swap
                </Button>
              )
            ) : (
              <CustomConnectButton />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ArrowDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  );
}
