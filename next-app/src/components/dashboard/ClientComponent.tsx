"use client";

import { ERC20UpgradeableABI } from "@/abi/ERC20Upgradeable";
import {
  GensAddress,
  GenxAddress,
  liquidityFactoryAddress,
} from "@/abi/address";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { usePools } from "@/hook/usePools";
import { ethers } from "ethers";
import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  getSigner,
  useERC20UpgradeableContract,
  useFactoryContract,
  useLiquidityPoolContract,
} from "./Contracts";

const liquidityPoolAddress = "0x9aB20aFE125409869393E72Ab297b8375daCd550";

const ClientComponent = () => {
  const { address, chainId } = useAccount();
  const [liquidityAmountA, setLiquidityAmountA] = useState<string>("");
  const [liquidityAmountB, setLiquidityAmountB] = useState<string>("");
  const pools = usePools(); // Utiliser le hook personnalisé pour obtenir les adresses des pools
  const signer = getSigner();

  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    abi: ERC20UpgradeableABI,
    functionName: "balanceOf",
    address: GenxAddress,
    args: [address],
  });

  const { data: symbol, isLoading: isSymbolLoading } = useReadContract({
    abi: ERC20UpgradeableABI,
    functionName: "symbol",
    address: GenxAddress,
  });

  const FactoryContract = useFactoryContract({
    address: liquidityFactoryAddress,
  });

  const GenxContract = useERC20UpgradeableContract({
    address: GensAddress,
  });

  const GensContract = useERC20UpgradeableContract({
    address: GenxAddress,
  });

  const LiquidityPoolContract = useLiquidityPoolContract({
    address: "0x1556C55cc5F20eC768eEf61D08226d954520257A",
  });

  const handleCreatePool = async () => {
    try {
      const tx = await FactoryContract.createPool(
        GenxAddress,
        "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
        address,
        30
      );
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: hash,
    error: errorWrite,
    isPending,
    writeContract,
  } = useWriteContract();

  const { data: poolsData, isLoading: isPoolsLoading } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "getPool",
    address: "0x7101734f6178c68a242ab3b9506fb52f5afac955",
    args: [GenxAddress, "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
  });

  console.log("Pools data:", poolsData);

  const { data: reserves, isLoading: isReservesLoading } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "platformFee",
    address: "0x1556C55cc5F20eC768eEf61D08226d954520257A",
    args: [],
  });

  console.log("get platform fee:", reserves);

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

    console.log("Amount A:", amountA);
    console.log("Amount B:", amountB);

    const token = new ethers.Contract(GensAddress, ERC20UpgradeableABI, signer);

    const tx = await token.approve(
      "0x1556C55cc5F20eC768eEf61D08226d954520257A",
      ethers.MaxUint256
    );
    await tx.wait();

    // writeContract({
    //   abi: LiquidityPoolABI,
    //   functionName: "addLiquidity",
    //   address: "0x1556C55cc5F20eC768eEf61D08226d954520257A",
    //   args: [liquidityAmountA, liquidityAmountB],
    // });

    //   const amountA = ethers.parseUnits(liquidityAmountA, "ether");
    //   const amountB = ethers.parseUnits(liquidityAmountB, "ether");

    try {
      // Approve tokens for the liquidity pool
      // const approveTxA = await GenxContract.approve(
      //   liquidityPoolAddress,
      //   amountA,
      //   { gasLimit: 1000000 }
      // );
      // await approveTxA.wait();
      // const approveTxB = await GensContract.approve(
      //   liquidityPoolAddress,
      //   amountB,
      //   { gasLimit: 1000000 }
      // );
      // await approveTxB.wait();
      // const gasFee = await LiquidityPoolContract.addLiquidity.estimateGas(
      //   parseEther(liquidityAmountA),
      //   parseEther(liquidityAmountB)
      // );
      // console.log("Gas fee:", gasFee);
      //     // const gasEstimate = await LiquidityPoolContract.addLiquidity.estimateGas(
      //     //   amountA,
      //     //   amountB
      //     // );
      //     // console.log("Gas estimate:", gasEstimate.toString());
      //     // Add liquidity
      //     const tx = await LiquidityPoolContract.addLiquidity(amountA, amountB, {
      //       gazLimit: 100,
      //     });
      //     // await tx.wait();
    } catch (error) {
      console.error("Error adding liquidity:", error);
      if (error.data && error.data.message) {
        console.error("Error data:", error.data.message);
      }
    }
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  return (
    <div>
      <div>Address: {address}</div>
      <div>
        Balance: {balance?.toString()} {symbol?.toString()}
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

          <div className="my-5">
            <h2> Create a pool </h2>
            <Button className="bg-accent text-white" onClick={handleCreatePool}>
              Create Pool
            </Button>
          </div>

          {/* <div>
            <Input type="text" placeholder="Amount of GENX to send" />
            <Button className="bg-accent text-white" onClick={handleSendGenx}>
              Send GENX
            </Button>
          </div> */}

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
            <Input type="number" placeholder="Amount to swap" />
            <Button className="ml-4 bg-accent text-white">Swap</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
