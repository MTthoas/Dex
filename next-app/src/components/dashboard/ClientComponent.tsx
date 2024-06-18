"use client";

import { useState } from "react";
import { Address, parseEther } from "viem";
import {
  useAccount,
  useReadContract,
  useSendTransaction,
  useWriteContract,
} from "wagmi";
import { prepareTransactionRequest } from '@wagmi/core'
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { abi as LiquidityPoolABI } from "@/abi/LiquidityPool.json";
import { abi as GenxABI } from "@/abi/abi";
import { GenxAddress, liquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";

export default function ClientComponent() {
  const { address } = useAccount();
  const [liquidityAmountA, setLiquidityAmountA] = useState("");
  const [liquidityAmountB, setLiquidityAmountB] = useState("");
  const [transactionAddress, setTransactionAddress] = useState("");
  const [amountToSend, setAmountToSend] = useState("");

  const { writeContract: approveTokenA } = useWriteContract({
    abi: GenxABI,
    address: GenxAddress, // Address of Token A
    functionName: "approve",
    args: [liquidityFactoryAddress, parseEther(liquidityAmountA)],
  });

  const { writeContract: approveTokenB } = useWriteContract({
    abi: GenxABI,
    address: GenxAddress, // Address of Token B
    functionName: "approve",
    args: [liquidityFactoryAddress, parseEther(liquidityAmountB)],
  });

  const { writeContract: addLiquidity } = useWriteContract ({
    abi: LiquidityPoolABI,
    address: liquidityFactoryAddress,
    functionName: "addLiquidity",
    args: [parseEther(liquidityAmountA), parseEther(liquidityAmountB)],
  });

  const { sendTransaction } = useSendTransaction();

  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    abi: GenxABI,
    functionName: "balanceOf",
    address: GenxAddress,
    args: [address],
  });

  const { data: symbol, isLoading: isSymbolLoading } = useReadContract({
    abi: GenxABI,
    functionName: "symbol",
    address: GenxAddress,
  });

  const { data: allPoolsLength, isLoading: isPoolsLengthLoading } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsLength",
    address: liquidityFactoryAddress,
  });

  const { data: poolAddress, isLoading: isPoolAddressLoading } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPools",
    address: liquidityFactoryAddress,
    args: [0],
  });

  const { data: poolSymbol, isLoading: isPoolSymbolLoading } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "symbol",
    address: poolAddress as Address,
  });

  const { data: balancePool, isLoading: isBalancePoolLoading } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "balanceOf",
    address: poolAddress as Address,
    args: [address],
  });

  const { data: totalSupply, isLoading: isTotalSupplyLoading } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "totalSupply",
    address: poolAddress as Address,
  });

  const { data: getReserves, isLoading: isGetReservesLoading } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "getReserves",
    address: poolAddress as Address,
  });

  if (isBalanceLoading || isSymbolLoading || isPoolsLengthLoading || isPoolAddressLoading || isPoolSymbolLoading || isBalancePoolLoading || isTotalSupplyLoading || isGetReservesLoading) {
    return <div>Loading...</div>;
  }

  const handleSendTransaction = () => {
    sendTransaction({
      to: transactionAddress as Address,
      value: parseEther(amountToSend),
    });
  };

  const handleAddLiquidity = async () => {
    try {
      await approveTokenA();
      await approveTokenB();
      await addLiquidity();
      alert("Liquidity added successfully!");
    } catch (error) {
      console.error("Error adding liquidity:", error);
      alert("Failed to add liquidity. Please try again.");
    }
  };

  return (
    <div>
      <div>Address: {address}</div>
      <div>
        Balance: {balance?.toString()} {symbol?.toString()}
      </div>
      <div className="my-5">
        <h1 className="mt-1 text-lg">LiquidityPool</h1>
        <div>
          <h3>Number of Pools: {allPoolsLength?.toString()}</h3>
          <h3>Pool Address: {poolAddress?.toString()}</h3>
          <h3>Pool Symbol: {poolSymbol?.toString()}</h3>
          <h3>Pool Balance: {balancePool?.toString()} {poolSymbol?.toString()}</h3>
          <p>Pool Reserves: {getReserves?.toString()}</p>
          <div className="my-2 w-1/2 flex">
            <Input
              type="text"
              placeholder="Address of sender"
              value={transactionAddress}
              onChange={(e) => setTransactionAddress(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Amount to send"
              className="ml-4 w-1/2"
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
            />
            <Button className="ml-4" onClick={handleSendTransaction}>
              Send transaction
            </Button>
          </div>
          <div className="w-1/4 mt-3 flex">
            <Input
              type="text"
              placeholder="Amount of Token A"
              value={liquidityAmountA}
              onChange={(e) => setLiquidityAmountA(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Amount of Token B"
              value={liquidityAmountB}
              onChange={(e) => setLiquidityAmountB(e.target.value)}
            />
            <Button className="ml-4" onClick={handleAddLiquidity}>
              Add liquidity
            </Button>
          </div>
          <div className="w-1/4 mt-3 flex">
            <Input type="number" placeholder="Amount to swap" />
            <Button className="ml-4 bg-accent text-white">Swap</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
