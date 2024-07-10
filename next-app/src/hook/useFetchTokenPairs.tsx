import { ERC20 } from "@/abi/ERC20";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { TokenPair } from "@/components/liquidityPool/Layout";
import { useEffect, useState } from "react";
import { useReadContracts } from "wagmi";

function transformToPairs(
  array: Array<unknown>,
  reserves: Array<unknown>,
  supply: Array<unknown>,
  listOfAddress: Array<unknown>
): Array<TokenPair> {
  // Assurez-vous que les tableaux sont de la même longueur ou gérez les différences de taille.
  return array.reduce((acc: TokenPair[], current: unknown, index: number) => {
    if (index % 2 === 0 && index + 1 < array.length) {
      // Ajoutez une vérification pour s'assurer que listOfAddress et reserves ont les indices appropriés
      if (index / 2 < listOfAddress.length && index < reserves.length - 1) {
        acc.push({
          id: index / 2 + 1,
          address: listOfAddress[index / 2], // Assurez-vous que cette valeur est correctement manipulée si nécessaire
          tokenA: current,
          tokenB: array[index + 1],
          tokenASupply: supply[index],
          tokenBSupply: supply[index + 1],
          reserveA: reserves[index], // Récupère la réserve pour le tokenA
          reserveB: reserves[index + 1], // Récupère la réserve pour le tokenB
        });
      }
    }
    return acc;
  }, []);
}

export function useFetchTokensPairsByAddressList(
  list: unknown,
  chainId: number | undefined
): { tokenPairs: Array<TokenPair> } {
  const [tokenPairs, setTokenPairs] = useState([]);
  const [pairsContracts, setPairsContracts] = useState<any[]>([]);
  const [supplyContract, setSupplyContract] = useState<any[]>([]);
  const [supply, setSupply] = useState<any[]>([]);
  const [reserves, setReserves] = useState<any[]>([]);

  const poolContracts =
    list?.map((address: `0x${string}`) => ({
      address,
      abi: LiquidityPoolABI,
      functionName: "getPair",
    })) || [];

  const ReserveContract =
    list?.map((address: `0x${string}`) => ({
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
      const tokenAddresses = pairsData.flatMap((pair: any) => [
        pair.result[0],
        pair.result[1],
      ]);

      const reservesMap = reservesData.flatMap((reserve: any) => [
        reserve.result[0],
        reserve.result[1],
      ]);
      setReserves(reservesMap);

      const contracts = tokenAddresses.map((address: `0x${string}`) => ({
        address,
        abi: ERC20,
        functionName: "symbol",
        chainId,
      }));

      const contractsTotalSupply = tokenAddresses.map(
        (address: `0x${string}`) => ({
          address,
          abi: ERC20,
          functionName: "totalSupply",
          chainId,
        })
      );

      setSupplyContract(contractsTotalSupply);
      setPairsContracts(contracts);
    }
  }, [pairsData, reservesData]);

  // Fetch pairs (token addresses) from each pool
  const { data: tokenSymbols } = useReadContracts({
    contracts: pairsContracts,
  });

  const { data: totalSupply } = useReadContracts({
    contracts: supplyContract,
  });

  useEffect(() => {
    if (tokenSymbols && tokenSymbols.length > 0) {
      const pairs = tokenSymbols.map((symbol: any, index: number) => {
        console.log("symbol :", symbol);
        return symbol.result;
      });
      setTokenPairs(pairs);
    }
  }, [tokenSymbols]);

  useEffect(() => {
    if (totalSupply && totalSupply.length > 0) {
      const supply = totalSupply.map((supply: any) => supply.result);
      setSupply(supply);
    }
  }, [totalSupply]);

  console.log("Supply", supply);

  const pairs = transformToPairs(tokenPairs, reserves, supply, list);
  console.log(pairs);
  return pairs;
}
