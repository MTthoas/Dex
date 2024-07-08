"use client";

import { ERC2O } from "@/abi/ERC20";
import {
  GensAddress,
  GenxAddress,
  LiquidityPoolAddress,
  liquidityFactoryAddress,
} from "@/abi/address";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { usePools } from "@/hook/usePools";
import { ethers } from "ethers";
import { useState } from "react";
import { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  getSigner,
  useERC20UpgradeableContract,
  useFactoryContract,
  useLiquidityPoolContract,
} from "./Contracts";

const ClientComponent = () => {
  const { address, chainId } = useAccount();
  const [liquidityAmountA, setLiquidityAmountA] = useState<string>("0");
  const [liquidityAmountB, setLiquidityAmountB] = useState<string>("0");
  const [swapAmount, setSwapAmount] = useState<string>("0");
  const [swapToken, setSwapToken] = useState<string>(GenxAddress); // Default to GENX for swapping
  const pools = usePools(); // Utiliser le hook personnalisé pour obtenir les adresses des pools
  const signer = getSigner({ chainId });

  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    abi: ERC2O,
    functionName: "balanceOf",
    address: GenxAddress,
    args: [address],
  });

  const { data: balance2, isLoading: isBalanceLoading2 } = useReadContract({
    abi: ERC2O,
    functionName: "balanceOf",
    address: GensAddress,
    args: [address],
  });

  const { data: symbol, isLoading: isSymbolLoading } = useReadContract({
    abi: ERC2O,
    functionName: "symbol",
    address: GenxAddress,
  });

  const { data: symbol2, isLoading: isSymbolLoading2 } = useReadContract({
    abi: ERC2O,
    functionName: "symbol",
    address: GensAddress,
  });

  const { data: reserves, isLoading: isReservesLoading } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "getReserves",
    address: LiquidityPoolAddress,
  });

  const { data: totalSupply, isLoading: isTotalSupplyLoading } =
    useReadContract({
      abi: LiquidityPoolABI,
      functionName: "totalSupply",
      address: LiquidityPoolAddress,
    });

  const FactoryContract = useFactoryContract({
    address: liquidityFactoryAddress,
    chainId,
  });

  const GenxContract = useERC20UpgradeableContract({
    address: GenxAddress,
    chainId,
  });

  const GensContract = useERC20UpgradeableContract({
    address: GensAddress,
    chainId,
  });

  const LiquidityPoolContract = useLiquidityPoolContract({
    address: LiquidityPoolAddress,
    chainId,
  });

  const handleCreatePool = async () => {
    try {
      const tx = await FactoryContract.createPool(
        GenxAddress as Address,
        GensAddress as Address,
        address,
        30
      );
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddLiquidity = async () => {
    if (!signer || !address) return;

    if (
      !liquidityAmountA ||
      isNaN(Number(liquidityAmountA)) ||
      !liquidityAmountB ||
      isNaN(Number(liquidityAmountB))
    ) {
      alert("Please enter valid amounts for both tokens.");
      return;
    }

    const amountA = ethers.parseUnits(liquidityAmountA, "ether");
    const amountB = ethers.parseUnits(liquidityAmountB, "ether");

    console.log("Amounts:", {
      amountA: amountA.toString(),
      amountB: amountB.toString(),
    });

    try {
      // Approve tokens for the liquidity pool
      console.log("Approving GENX tokens...");
      const approveTxA = await GenxContract.approve(
        LiquidityPoolAddress,
        amountA
      );
      await approveTxA.wait();
      console.log("Approved GENX");

      console.log("Approving GENS tokens...");
      const approveTxB = await GensContract.approve(
        LiquidityPoolAddress,
        amountB
      );
      await approveTxB.wait();
      console.log("Approved GENS");

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const tx = await LiquidityPoolContract.addLiquidity(amountB, amountA);
      await tx.wait();
      console.log("Liquidity added successfully");
    } catch (error) {
      console.error("Error adding liquidity:", error);
      if (error.data && error.data.message) {
        console.error("Error data:", error.data.message);
      }
    }
  };

  const handleSwap = async () => {
    if (!signer || !address) return;

    if (!swapAmount || isNaN(Number(swapAmount))) {
      alert("Please enter a valid swap amount.");
      return;
    }

    const amountIn = ethers.parseUnits(swapAmount, "ether");

    try {
      // Approve token for the swap

      console.log("Approving token for swap...");
      const approveTx = await (swapToken === GenxAddress
        ? GenxContract
        : GensContract
      ).approve(LiquidityPoolAddress, amountIn);
      await approveTx.wait();
      console.log(`Approved ${swapToken}`);

      console.log("Waiting for approval to be confirmed...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      console.log("Executing swap...");
      const tx = await LiquidityPoolContract.swap(swapToken, amountIn, 1); // minAmountOut set to 1 for simplicity
      await tx.wait();
      console.log("Swap executed successfully");
    } catch (error) {
      console.error("Error executing swap:", error);
      if (error.data && error.data.message) {
        console.error("Error data:", error.data.message);
      }
    }
  };

  return (
    <div>
      <div>Address: {address}</div>
      <div>
        {isBalanceLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            GENX Balance: {balance?.toString()} {symbol}
          </div>
        )}

        {isBalanceLoading2 ? (
          <div>Loading...</div>
        ) : (
          <div>
            GENS Balance: {balance2?.toString()} {symbol2}
          </div>
        )}
      </div>
      <div className="my-5">
        <h1 className="mt-1 text-lg">LiquidityPool</h1>
        <div>
          <h3>Number of Pools: {pools.allPoolsLength?.toString()}</h3>

          <div>
            {pools.allPoolsAddress?.map((pool, index) => (
              <div key={index}>
                <p>Pool {index + 1}</p>
                <p>Address: {pool}</p>
              </div>
            ))}
          </div>

          <div>
            {isReservesLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <p>Reserves: {reserves?.toString()}</p>
              </div>
            )}
          </div>

          <div className="my-5">
            <h2> Create a pool </h2>
            <Button className="bg-accent text-white" onClick={handleCreatePool}>
              Create Pool
            </Button>
          </div>

          <div className="w-3/4 mt-3 flex">
            <Input
              type="text"
              placeholder="Amount of Token A"
              value={liquidityAmountA}
              onChange={(e) => setLiquidityAmountA(e.target.value)}
            />
            <Input
              type="text"
              className="ml-4"
              placeholder="Amount of Token B"
              value={liquidityAmountB}
              onChange={(e) => setLiquidityAmountB(e.target.value)}
            />
            <Button className="ml-4" onClick={handleAddLiquidity}>
              Add Liquidity
            </Button>
          </div>
          <div className="w-1/4 mt-3 flex">
            <Input
              type="number"
              placeholder="Amount to swap"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
            />
            <select
              value={swapToken}
              onChange={(e) => setSwapToken(e.target.value)}
              className="ml-4"
            >
              <option value={GenxAddress}>GENX</option>
              <option value={GensAddress}>GENS</option>
            </select>
            <Button className="ml-4 bg-accent text-white" onClick={handleSwap}>
              Swap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
