import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ethers } from "ethers";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { getSigner } from "../dashboard/Contracts";
import ShinyButton from "../ui/shiny-button";

export default function LiquidityPoolList({
  pairs,
  setAddLiquidityModal,
  setPairsSelected,
  setRemoveLiquidityModal,
  handleClaimRewards,
  loadingRewards,
}) {
  console.log(pairs);
  return (
    <div className="flex flex-col">
      <main className="text-foreground py-8">
        <div className=" grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                        if (isNaN(ratio)) {
                          return 0;
                        }

                        return ratio.toFixed(2);
                      })()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-card-foreground/20 py-4 px-1">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex gap-2">
                      <Button
                        size={"sm"}
                        onClick={() => {
                          setPairsSelected(pair);
                          setAddLiquidityModal(pair);
                        }}
                        className="w-full bg-primary text-primary-foreground hover:text-gray mb-2"
                      >
                        Add Liquidity
                      </Button>
                      {pair.hasAddedLiquidity && (
                        <div className="flex flex-col w-full gap-2">
                          <Button
                            size={"sm"}
                            className="w-full mb-2"
                            onClick={() => {
                              setPairsSelected(pair);
                              setRemoveLiquidityModal(true);
                            }}
                          >
                            Remove Liquidity
                          </Button>
                        </div>
                      )}
                    </div>
                    {pair.liquidityTokens > 0 ? (
                      <div
                        className="flex justify-center w-full"
                        onClick={() => {
                          if (
                            pair.liquidityTokens > 0 &&
                            !loadingRewards &&
                            pair.hasAddedLiquidity
                          ) {
                            setPairsSelected(pair);
                            handleClaimRewards(pair);
                          }
                        }}
                      >
                        <ShinyButton
                          text={
                            loadingRewards
                              ? `LOADING FOR CLAIMING...`
                              : `CLAIM REWARDS : ${Number(ethers.formatEther(pair.liquidityTokens)).toFixed(1)} LPT`
                          }
                        />
                      </div>
                    ) : (
                      pair.hasAddedLiquidity && (
                        <div className="flex justify-center w-full">
                          <ShinyButton text={`NO REWARDS TO CLAIM`} />
                        </div>
                      )
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
        </div>
      </main>
    </div>
  );
}
