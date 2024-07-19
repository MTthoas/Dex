import { ERC20 } from "@/abi/ERC20";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { TokenPair } from "@/components/liquidityPool/Layout";
import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";

function transformToPairs(array, reserves, supply, listOfAddress) {
  return array.reduce((acc, current, index) => {
    if (index % 2 === 0 && index + 1 < array.length) {
      if (index / 2 < listOfAddress.length && index < reserves.length - 1) {
        acc.push({
          id: index / 2 + 1,
          address: listOfAddress[index / 2],
          tokenA: current,
          tokenB: array[index + 1],
          tokenASupply: supply[index],
          tokenBSupply: supply[index + 1],
          reserveA: reserves[index],
          reserveB: reserves[index + 1],
        });
      }
    }
    return acc;
  }, []);
}

export function useFetchTokensPairsByAddressList(list, chainId) {
  const [tokenPairs, setTokenPairs] = useState([]);
  const [pairsContracts, setPairsContracts] = useState([]);
  const [supplyContract, setSupplyContract] = useState([]);
  const [supply, setSupply] = useState([]);
  const [reserves, setReserves] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [allTokens, setAllTokens] = useState([]);

  const poolContracts =
    list?.map((address) => ({
      address,
      abi: LiquidityPoolABI,
      functionName: "getPair",
    })) || [];

  const ReserveContract =
    list?.map((address) => ({
      address,
      abi: LiquidityPoolABI,
      functionName: "getReserves",
    })) || [];

  const { data: pairsData, isSuccess } = useReadContracts({
    contracts: poolContracts,
  });

  const { data: reservesData } = useReadContracts({
    contracts: ReserveContract,
  });

  useEffect(() => {
    if (
      pairsData &&
      pairsData.length > 0 &&
      reservesData &&
      reservesData.length > 0
    ) {
      const tokenAddresses = pairsData.flatMap((pair) => [
        pair.result[0],
        pair.result[1],
      ]);

      const reservesMap = reservesData.flatMap((reserve) => [
        reserve.result[0],
        reserve.result[1],
      ]);
      setReserves(reservesMap);

      const contracts = tokenAddresses.map((address) => ({
        address,
        abi: ERC20,
        functionName: "symbol",
        chainId,
      }));

      const contractsTotalSupply = tokenAddresses.map((address) => ({
        address,
        abi: ERC20,
        functionName: "totalSupply",
        chainId,
      }));

      setAddresses(tokenAddresses);
      setSupplyContract(contractsTotalSupply);
      setPairsContracts(contracts);
    }
  }, [pairsData, reservesData]);

  const { data: tokenSymbols } = useReadContracts({
    contracts: pairsContracts,
  });

  const { data: totalSupply } = useReadContracts({
    contracts: supplyContract,
  });

  useEffect(() => {
    if (tokenSymbols && tokenSymbols.length > 0) {
      const pairs = tokenSymbols.map((symbol) => symbol.result);
      setTokenPairs(pairs);
    }
  }, [tokenSymbols]);

  useEffect(() => {
    if (totalSupply && totalSupply.length > 0) {
      const supply = totalSupply.map((supply) => supply.result);
      setSupply(supply);
    }
  }, [totalSupply]);

  const pairs = transformToPairs(tokenPairs, reserves, supply, list);

  useEffect(() => {
    if (tokenSymbols && totalSupply) {
      const tokensSet = new Set();
      const allTokensList = [];
      for (let i = 0; i < tokenSymbols.length; i++) {
        const address = addresses[i];
        if (!tokensSet.has(address)) {
          tokensSet.add(address);
          allTokensList.push({
            token: tokenSymbols[i].result,
            address: address,
            totalSupply: totalSupply[i].result,
          });
        }
      }
      setAllTokens(allTokensList);
    }
  }, [tokenSymbols, totalSupply, addresses]);

  return { pairs, allTokens };
}
