import { ERC20 } from "@/abi/ERC20";
import { useEffect, useMemo, useState } from "react";
import { useReadContracts } from "wagmi";

export function useFetchBalances(list, userAddresses, chainId) {
  const [balances, setBalances] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

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

  const {
    data: balancesData,
    error: fetchError,
    isFetched,
  } = useReadContracts({
    contracts: balanceContracts,
  });

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);

  useEffect(() => {
    if (isFetched) {
      const balanceResults = list.reduce(
        (acc, contractAddress, contractIndex) => {
          acc[contractAddress] = userAddresses.reduce(
            (userAcc, userAddress, userIndex) => {
              userAcc[userAddress] =
                balancesData[contractIndex * userAddresses.length + userIndex]
                  ?.result || 0n;
              return userAcc;
            },
            {}
          );
          return acc;
        },
        {}
      );
      setBalances(balanceResults);
      setIsSuccess(true);
    }
  }, [balancesData, isFetched, userAddresses]);

  console.log("Balances", balances);
  console.log("IsSuccess", isSuccess);

  return { balances, isSuccess, error };
}
