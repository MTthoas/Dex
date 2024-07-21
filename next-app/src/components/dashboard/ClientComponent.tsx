"use client";

import { ERC20 } from "@/abi/ERC20";
import {
  DonxAddress,
  GensAddress,
  GenxAddress,
  LiquidityPoolAddress,
  LiquidityFactoryAddress,
} from "@/abi/address";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { usePools } from "@/hook/usePools";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { polygonAmoy } from "viem/chains";
import { useReadContract } from "wagmi";
import { useFetchTokensPairsByAddressList } from "../../hook/useFetchTokenPairs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  getSigner,
  useERC20UpgradeableContract,
  useFactoryContract,
  useLiquidityPoolContract,
  useTokenTotalSupply,
} from "./Contracts";

const ClientComponent = (chainId: number) => {
  const [chainIdNumber, setChainId] = useState(chainId ? polygonAmoy.id : 0);
  const [liquidityAmountA, setLiquidityAmountA] = useState<string>("0");
  const [liquidityAmountB, setLiquidityAmountB] = useState<string>("0");
  const [swapAmount, setSwapAmount] = useState<string>("0");
  const [swapToken, setSwapToken] = useState<string>(GenxAddress); // Default to GENX for swapping
  const pools = usePools(); // Utiliser le hook personnalisé pour obtenir les adresses des pools
  const signer = getSigner({ chainId: chainIdNumber });
  const [reserves, setReserves] = useState(["0", "0"]);
  const [ratio, setRatio] = useState("0");

  console.log(chainIdNumber);

  const [selectedToken, setSelectedToken] = useState("");
  const [relatedTokens, setRelatedTokens] = useState([]);
  const [allTokens, setAllTokens] = useState([]);

  const [tokenA, setTokenA] = useState([]);
  const [tokenB, setTokenB] = useState([]);
  const MaticAddress = ethers.ZeroAddress;
  console.log(MaticAddress);

  const { data: symbol, isLoading: isSymbolLoading } = useReadContract({
    abi: ERC20,
    functionName: "symbol",
    address: GenxAddress,
  });

  const { data: symbol2, isLoading: isSymbolLoading2 } = useReadContract({
    abi: ERC20,
    functionName: "symbol",
    address: GensAddress,
  });

  const { data: symbol3 } = useReadContract({
    abi: ERC20,
    functionName: "symbol",
    address: DonxAddress,
  });

  const {
    data: reservesData,
    isLoading: isReservesLoading,
    isSuccess: IsSuccessReserves,
  } = useReadContract({
    abi: LiquidityPoolABI,
    functionName: "getReserves",
    address: LiquidityPoolAddress,
  });

  console.log("Address : " + address);

  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    abi: ERC20,
    functionName: "balanceOf",
    address: GenxAddress,
    args: [address],
  });

  const { data: balance2, isLoading: isBalanceLoading2 } = useReadContract({
    abi: ERC20,
    functionName: "balanceOf",
    address: GensAddress,
    args: [address],
  });

  const { data: balance3, isLoading: isBalanceLoading3 } = useReadContract({
    abi: ERC20,
    functionName: "balanceOf",
    address: DonxAddress,
    args: [address],
  });

  useEffect(() => {
    if (reservesData) {
      const [reserveA, reserveB] = reservesData.map((reserve) =>
        ethers.toBigInt(reserve).toString()
      );
      setReserves([reserveA, reserveB]);
      console.log(reservesData);
    }
  }, [reservesData]);

  const FactoryContract = useFactoryContract({
    address: LiquidityFactoryAddress,
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

  const { data: listOfAddress } = useReadContract({
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsAddress",
    address: LiquidityFactoryAddress as `0x${string}`,
    chainId,
  });

  const { tokenPairs } = useFetchTokensPairsByAddressList(
    listOfAddress,
    chainId
  );

  console.log(tokenPairs);

  const { totalSupply: totalSupplyA, isLoading: isTotalSupplyALoading } =
    useTokenTotalSupply(GenxAddress);
  const { totalSupply: totalSupplyB, isLoading: isTotalSupplyBLoading } =
    useTokenTotalSupply(GensAddress);

  const calculateAmountB = (
    amountA: string,
    reserveA: string,
    reserveB: string,
    totalSupplyA: string,
    totalSupplyB: string
  ) => {
    // si la reserve est nul, la balance est nulle
    if (Number(reserveA) === 0 || Number(reserveB) === 0) {
      return amountA;
    }
    const ratioA = Number(amountA) / Number(totalSupplyA);
    const amountB = ratioA * Number(totalSupplyB);
    return ((amountB * Number(reserveB)) / Number(reserveA)).toString();
  };

  useEffect(() => {
    if (!isTotalSupplyALoading && !isTotalSupplyBLoading) {
      setLiquidityAmountB(
        calculateAmountB(
          liquidityAmountA,
          reserves[0],
          reserves[1],
          totalSupplyA.toString(),
          totalSupplyB.toString()
        )
      );
    }
    setRatio((Number(reserves[0]) / Number(reserves[1])).toFixed(2).toString());
  }, [
    liquidityAmountA,
    reserves,
    totalSupplyA,
    totalSupplyB,
    isTotalSupplyALoading,
    isTotalSupplyBLoading,
  ]);

  const handleCreatePool = async () => {
    try {
      const tx = await FactoryContract.createPool(
        GenxAddress as Address,
        DonxAddress as Address,
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

      const tx = await LiquidityPoolContract.addLiquidity(
        BigInt(amountA).toString(),
        BigInt(amountB).toString()
      );
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
      const approveTx = await (
        swapToken === GenxAddress ? GenxContract : GensContract
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

  useEffect(() => {
    const tokens = new Set();
    tokenPairs.forEach((pair) => {
      tokens.add(pair.tokenA);
      tokens.add(pair.tokenB);
    });
    setAllTokens([...tokens]);
  }, [tokenPairs]);

  useEffect(() => {
    if (selectedToken) {
      const related = new Set(
        tokenPairs
          .filter(
            (pair) =>
              pair.tokenA === selectedToken || pair.tokenB === selectedToken
          )
          .flatMap((pair) => [pair.tokenA, pair.tokenB])
          .filter((token) => token !== selectedToken)
      );
      setRelatedTokens([...related]);
    }
  }, [selectedToken, tokenPairs]);

  const handleTokenChange = (event) => {
    setSelectedToken(event.target.value);
  };

  return (
    <div>
      <div>Address: {address}</div>
      <div>
        <div>
          GENX Balance: {balance?.toString()} {symbol}
        </div>
        <div>
          GENS Balance: {balance2?.toString()} {symbol2}
        </div>
        <div>
          DONX Balance: {balance3?.toString()} {symbol3}
        </div>
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
            <p className="w-2/4 mx-3 pt-1"> Ratio: {ratio} </p>
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
            <select value={selectedToken} onChange={handleTokenChange}>
              <option value="">Select a token</option>
              {allTokens.map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>

            {selectedToken && (
              <select>
                <option value="">Select related token</option>
                {relatedTokens.map((token) => (
                  <option key={token} value={token}>
                    {token}
                  </option>
                ))}
              </select>
            )}
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
