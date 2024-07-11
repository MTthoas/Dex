import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useQuery } from "@tanstack/react-query";
import { getTokenBySymbol } from "@/hook/tokens.hook";
import { useAccount, useReadContract } from "wagmi";
import { ERC20 } from "@/abi/ERC20";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { Loader2 } from "lucide-react";
import { getSigner } from "../dashboard/Contracts";

export default function LiquidityPoolList({ pairs }) {
  const { address, chainId } = useAccount();
  const signer = getSigner({ chainId });
  const [selectedPair, setSelectedPair] = useState(null);
  const [liquidityAmountA, setLiquidityAmountA] = useState("");
  const [liquidityAmountB, setLiquidityAmountB] = useState("");
  const [ratio, setRatio] = useState(1);
  const [tokenAAddress, setTokenAAddress] = useState(null);
  const [tokenBAddress, setTokenBAddress] = useState(null);
  const [handleModal, setHandleModal] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: dataBalanceTokenA, isSuccess: isSuccessTokenA } = useQuery({
    queryKey: ["balance", selectedPair?.tokenA],
    queryFn: () => getTokenBySymbol(selectedPair?.tokenA),
    enabled: !!selectedPair,
  });

  const { data: dataBalanceTokenB, isSuccess: isSuccessTokenB } = useQuery({
    queryKey: ["balance", selectedPair?.tokenB],
    queryFn: () => getTokenBySymbol(selectedPair?.tokenB),
    enabled: !!selectedPair,
  });

  const { data: balanceOfTokenA } = useReadContract({
    abi: ERC20,
    address: tokenAAddress,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: balanceOfTokenB } = useReadContract({
    abi: ERC20,
    address: tokenBAddress,
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (isSuccessTokenA) {
      console.log(
        "dataBalanceTokenA :",
        selectedPair?.tokenA,
        dataBalanceTokenA.address
      );
      setTokenAAddress(dataBalanceTokenA.address);
    }
    if (isSuccessTokenB) {
      setTokenBAddress(dataBalanceTokenB.address);
    }
  }, [dataBalanceTokenA, dataBalanceTokenB, isSuccessTokenA, isSuccessTokenB]);

  const handleOpenDialog = (pair) => {
    setSelectedPair(pair);
    setLiquidityAmountA("");
    setLiquidityAmountB("");
  };

  useEffect(() => {
    if (selectedPair) {
      const reserveA = Number(ethers.formatEther(selectedPair.reserveA));
      const reserveB = Number(ethers.formatEther(selectedPair.reserveB));
      if (reserveB === 0 && reserveA === 0) {
        setRatio(1);
      } else {
        setRatio(reserveA / reserveB);
      }

      if (liquidityAmountA && liquidityAmountA.trim() !== "") {
        if (reserveB === 0 && reserveA === 0) {
          return setLiquidityAmountB(liquidityAmountA);
        }
        const amountB = (
          Number(liquidityAmountA) *
          (reserveA / reserveB)
        ).toFixed(0);
        setLiquidityAmountB(amountB);
      } else {
        setLiquidityAmountB("");
      }
    }
  }, [liquidityAmountA, selectedPair]);

  useEffect(() => {
    if (selectedPair) {
      setLiquidityAmountA(liquidityAmountA);
      const reserveA = Number(ethers.formatEther(selectedPair.reserveA));
      const reserveB = Number(ethers.formatEther(selectedPair.reserveB));
      if (reserveB === 0 && reserveA === 0) {
        setRatio(1);
      } else {
        setRatio(reserveA / reserveB);
      }

      if (liquidityAmountB && liquidityAmountB.trim() !== "") {
        if (reserveB === 0 && reserveA === 0) {
          return setLiquidityAmountA(liquidityAmountB);
        }
        const amountA = (
          Number(liquidityAmountB) /
          (reserveA / reserveB)
        ).toFixed(0);
        setLiquidityAmountA(amountA);
      } else {
        setLiquidityAmountA("");
      }
    }
  }, [liquidityAmountB, selectedPair]);

  const handleAddLiquidity = async () => {
    if (!liquidityAmountA || !liquidityAmountB || !signer) return;

    try {
      setHandleModal(true);

      const tokenAContract = new ethers.Contract(tokenAAddress, ERC20, signer);
      const tokenBContract = new ethers.Contract(tokenBAddress, ERC20, signer);
      const liquidityPoolContract = new ethers.Contract(
        selectedPair.address,
        LiquidityPoolABI,
        signer
      );

      console.log("tokenAAddress", tokenAAddress);

      // Ensure the amounts are valid
      if (BigInt(liquidityAmountA) <= 0 || BigInt(liquidityAmountB) <= 0) {
        console.error("Liquidity amounts must be greater than zero");
        setHandleModal(false);
        return;
      }

      console.log("Approving token A...");
      const approveTokenATx = await tokenAContract.approve(
        selectedPair.address,
        ethers.parseUnits(BigInt(liquidityAmountA).toString(), 18)
      );

      console.log("Approving token B...");
      const approveTokenBTx = await tokenBContract.approve(
        selectedPair.address,
        ethers.parseUnits(BigInt(liquidityAmountB).toString(), 18)
      );

      await Promise.all([approveTokenATx.wait(), approveTokenBTx.wait()]);

      console.log("Adding liquidity to the pool...");
      console.log("Liquidity A:", liquidityAmountA);
      console.log("Liquidity B:", liquidityAmountB);

      const addLiquidityTx = await liquidityPoolContract.addLiquidity(
        ethers.parseUnits(BigInt(liquidityAmountA).toString(), 18),
        ethers.parseUnits(BigInt(liquidityAmountB).toString(), 18)
      );
      await addLiquidityTx.wait();

      setHandleModal(false);
    } catch (error) {
      setHandleModal(false);
      console.error("Failed to add liquidity:", error.message);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <main className="bg-background text-foreground py-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
            {pairs &&
              pairs.map((pair) => (
                <Card
                  key={pair.id}
                  className="bg-card text-card-foreground rounded-lg shadow-md px-6"
                >
                  <CardHeader className="border-b border-card-foreground/20 px-6 py-4">
                    <h2 className="text-xl font-bold">
                      {pair.tokenA}/{pair.tokenB}
                    </h2>
                  </CardHeader>
                  <CardContent className="px-3 py-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        {pair.tokenA} Reserve:{" "}
                        {Number(ethers.formatEther(pair.reserveA)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        {pair.tokenB} Reserve:{" "}
                        {Number(ethers.formatEther(pair.reserveB)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">
                        Ratio Reserves:{" "}
                        {(() => {
                          const ratio =
                            Number(ethers.formatEther(pair.reserveA)) /
                            Number(ethers.formatEther(pair.reserveB));
                          return isNaN(ratio) ? "0" : ratio.toFixed(2);
                        })()}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-card-foreground/20 px-6 py-4">
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => handleOpenDialog(pair)}
                        className="w-full bg-primary text-primary-foreground hover:text-gray"
                      >
                        Add Liquidity
                      </Button>
                    </DialogTrigger>
                  </CardFooter>
                </Card>
              ))}
          </div>
          {selectedPair && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Liquidity</DialogTitle>
                <DialogDescription>
                  Add liquidity to the pool by depositing both tokens.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="tokenA">{selectedPair.tokenA} Amount</Label>
                <Input
                  type="number"
                  id="tokenA"
                  value={liquidityAmountA}
                  onChange={(e) => setLiquidityAmountA(e.target.value)}
                />
                <label className="text-sm">
                  {balanceOfTokenA
                    ? `Balance: ${Number(
                        ethers.formatEther(balanceOfTokenA)
                      ).toFixed(1)}`
                    : "Balance: ..."}
                </label>
                <Label htmlFor="tokenB">{selectedPair.tokenB} Amount</Label>
                <Input
                  type="number"
                  id="tokenB"
                  value={liquidityAmountB}
                  onChange={(e) => setLiquidityAmountB(e.target.value)}
                />
                <label className="text-sm">
                  {balanceOfTokenB
                    ? `Balance: ${Number(
                        ethers.formatEther(balanceOfTokenB)
                      ).toFixed(1)}`
                    : "Balance: ...."}
                </label>
              </div>
              <DialogFooter className="flex justify-between items-center px-4 py-2">
                <Label
                  htmlFor="ratio"
                  className="text-sm font-medium text-gray-700 mr-3"
                >
                  Ratio: {ratio}
                </Label>

                {handleModal ? (
                  <Button disabled>
                    <Loader2 className="w-6 h-6 text-secondary px-1 animate-spin" />
                    Loading...
                  </Button>
                ) : (
                  <Button type="button" onClick={handleAddLiquidity}>
                    Add liquidity
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </main>
    </div>
  );
}
