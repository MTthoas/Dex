import { useReadContracts } from "wagmi";
import { useEffect, useState, useMemo } from "react";
import { ERC20 } from "@/abi/ERC20";

export function useFetchBalances(list, userAddresses, chainId) {
  const [balances, setBalances] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const balanceContracts = useMemo(() => {
    return list.flatMap((contractAddress) =>
      userAddresses.map((userAddress) => ({
        address: contractAddress,
        abi: ERC20,
        functionName: "balanceOf",
        args: [userAddress],
        chainId,
      }))
    );
  }, [list, userAddresses, chainId]);

  const { data: balancesData, error: fetchError, isFetched } = useReadContracts({
    contracts: balanceContracts,
  });

  useEffect(() => {
    if (isFetched && balancesData) {
      const balanceResults = list.reduce((acc, contractAddress, contractIndex) => {
        acc[contractAddress] = userAddresses.reduce((userAcc, userAddress, userIndex) => {
          userAcc[userAddress] = balancesData[contractIndex * userAddresses.length + userIndex]?.result || 0n;
          return userAcc;
        }, {});
        return acc;
      }, {});
      setBalances(balanceResults);
      setIsSuccess(true);
    } else if (fetchError) {
      setError(fetchError);
    }
  }, [balancesData, isFetched, fetchError, list, userAddresses]);

  return { balances, isSuccess, error };
}
