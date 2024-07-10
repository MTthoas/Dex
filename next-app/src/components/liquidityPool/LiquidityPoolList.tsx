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

export default function LiquidityPoolList({ pairs }) {
  const [selectedPair, setSelectedPair] = useState(null);
  const [liquidityAmountA, setLiquidityAmountA] = useState("");
  const [liquidityAmountB, setLiquidityAmountB] = useState("");
  const [ratio, setRatio] = useState("");

  const handleOpenDialog = (pair) => {
    setSelectedPair(pair);
    setLiquidityAmountA("");
    setLiquidityAmountB("");
  };

  useEffect(() => {
    if (selectedPair) {
      const reserveA = Number(ethers.formatEther(selectedPair.reserveA));
      const reserveB = Number(ethers.formatEther(selectedPair.reserveB));
      const ratio = reserveA / reserveB;
      setRatio(ratio.toFixed(2));

      if (liquidityAmountA && liquidityAmountA.trim() !== "") {
        const amountB = (Number(liquidityAmountA) * ratio).toFixed(0);
        setLiquidityAmountB(amountB);
      } else {
        setLiquidityAmountB("");
      }
    }
  }, [liquidityAmountA, selectedPair]);

  useEffect(() => {
    if (selectedPair) {
      const reserveA = Number(ethers.formatEther(selectedPair.reserveA));
      const reserveB = Number(ethers.formatEther(selectedPair.reserveB));
      const ratio = reserveA / reserveB;

      if (liquidityAmountB && liquidityAmountB.trim() !== "") {
        const amountA = (Number(liquidityAmountB) / ratio).toFixed(0);
        setLiquidityAmountA(amountA);
      } else {
        setLiquidityAmountA("");
      }
    }
  }, [liquidityAmountB, selectedPair]);

  return (
    <div className="flex flex-col w-full">
      <main className="bg-background text-foreground py-8">
        <Dialog>
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
                      <span className=" text-sm">
                        Ratio Reserves :
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
                <Label htmlFor="tokenB">{selectedPair.tokenB} Amount</Label>
                <Input
                  type="number"
                  id="tokenB"
                  value={liquidityAmountB}
                  onChange={(e) => setLiquidityAmountB(e.target.value)}
                />
              </div>
              <DialogFooter className="flex justify-between items-center px-4 py-2">
                <Label
                  htmlFor="ratio"
                  className="text-sm font-medium text-gray-700 mr-3"
                >
                  Ratio: {ratio}
                </Label>
                <Button type="submit">Add liquidity</Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </main>
    </div>
  );
}
