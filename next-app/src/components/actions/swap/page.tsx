import { CustomConnectButton } from "@/components/common/ConnectButton";
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
import { Chain } from "../actions.type";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTokenBySymbol } from "@/hook/tokens.hook";
import { ERC20 } from "@/abi/ERC20";
import { ethers } from "ethers";
import { getSigner } from "@/components/dashboard/Contracts";
import { LiquidityPoolABI } from "@/abi/liquidityPool";

export default function SwapCard({
  address,
  isConnected,
  chains,
  pairs,
  cryptoSelected,
  setCryptoSelected,
  chainId,
}: {
  address: any;
  isConnected: boolean;
  chains: Chain[];
  pairs: any;
  cryptoSelected: any;
  setCryptoSelected: any;
  chainId: number;
}) {
  const [selectedToken, setSelectedToken] = useState("");
  const [relatedToken, setRelatedToken] = useState("");
  const [relatedTokens, setRelatedTokens] = useState([]);
  const [allTokens, setAllTokens] = useState([]);
  const [poolAddress, setPoolAddress] = useState("");

  const [balanceA, setBalanceA] = useState(0);
  const [balanceB, setBalanceB] = useState(0);
  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState("");
  const signer = getSigner({ chainId });

  console.log("Address", address);
  console.log("Pairs", pairs);

  const { data: dataBalanceTokenA, isSuccess: isSuccessTokenA } = useQuery({
    queryKey: ["balanceA", selectedToken],
    queryFn: () => getTokenBySymbol(selectedToken),
    enabled: !!selectedToken,
  });

  const { data: dataBalanceTokenB, isSuccess: isSuccessTokenB } = useQuery({
    queryKey: ["balanceB", selectedToken],
    queryFn: () => getTokenBySymbol(selectedToken),
    enabled: !!selectedToken,
  });

  useEffect(() => {
    const tokens = new Set();
    pairs.forEach((pair) => {
      tokens.add(pair.tokenA);
      tokens.add(pair.tokenB);
    });
    setAllTokens([...tokens]);
  }, [pairs]);

  useEffect(() => {
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

      // Fetch balance of selected token
      const tokenAContract = new ethers.Contract(selectedToken, ERC20, signer);
      tokenAContract.balanceOf(address).then((balanceData) => {
        setBalanceA(balanceData);
      });

      if (relatedToken) {
        // Fetch balance of related token
        const tokenBContract = new ethers.Contract(relatedToken, ERC20, signer);

        tokenBContract.balanceOf(address).then((balanceData) => {
          setBalanceB(balanceData);
        });
      }

      // Find the pool address
      const pool = pairs.find(
        (pair) =>
          (pair.tokenA === selectedToken && pair.tokenB === relatedToken) ||
          (pair.tokenA === relatedToken && pair.tokenB === selectedToken)
      );
      setPoolAddress(pool ? pool.address : "");
    }
  }, [selectedToken, relatedToken, pairs, signer, address]);

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
  };

  const handleRelatedTokenChange = (event) => {
    setRelatedToken(event.target.value);
  };

  const handleAmountInChange = (event) => {
    setAmountIn(event.target.value);
  };

  const handleSwap = async () => {
    if (!selectedToken || !relatedToken || !amountIn) return;

    const amountInWei = ethers.parseUnits(amountIn, 18);
    const minAmountOutWei = ethers.parseUnits("0", 18); // Replace with your logic for minAmountOut

    console.log(poolAddress);
    const swapContract = new ethers.Contract(
      poolAddress,
      LiquidityPoolABI,
      signer
    );

    try {
      await swapContract.swap(selectedToken, amountInWei, minAmountOutWei);
      alert("Swap successful!");
    } catch (error) {
      console.error("Swap failed:", error);
      // alert("Swap failed. Check the console for details.");
    }
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
            <select value={selectedToken} onChange={handleTokenChange}>
              <option value="">Select a token</option>
              {allTokens.map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs">
            Balance: {ethers.formatEther(balanceA)}
          </span>
        </div>
        <div className="bg-[#2D2D3A] rounded-lg mb-4">
          <Input
            placeholder="0.0"
            value={amountIn}
            onChange={handleAmountInChange}
          />
        </div>
        <div className="flex space-x-2 mb-2">
          <Button className="bg-[#313140] text-xs h-6" variant="secondary">
            25%
          </Button>
          <Button className="bg-[#313140] text-xs h-6" variant="secondary">
            50%
          </Button>
          <Button className="bg-[#313140] text-xs h-6" variant="secondary">
            75%
          </Button>
          <Button className="bg-[#313140] text-xs h-6" variant="secondary">
            MAX
          </Button>
        </div>
        <div className="flex justify-center my-1">
          <ArrowDownIcon className="text-green-400 p-1 bg-secondary rounded-lg" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {selectedToken && (
              <select value={relatedToken} onChange={handleRelatedTokenChange}>
                <option value="">Select related token</option>
                {relatedTokens.map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
            )}
          </div>
          <span className="text-xs">
            Balance: {ethers.formatEther(balanceB)}
          </span>
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
        <div className="">
          {address ? (
            <Button className="w-full" onClick={handleSwap}>
              Swap
            </Button>
          ) : (
            <CustomConnectButton />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ArrowDownIcon(props: any) {
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
