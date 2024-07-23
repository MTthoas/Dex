"use client";

import { AdminWallet, StakingFactoryAddress } from "@/abi/address";
import { stakingAbi } from "@/abi/Staking";
import { stakingFactoryAbi } from "@/abi/StakingFactory";
import StakePoolCard from "@/components/stakingPool/StakePoolCard";
import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";

export default function StakingPoolFactoryPage() {
  const { address: addressUser, isConnected, chainId } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (
      isConnected &&
      addressUser?.toLowerCase() === AdminWallet.toLowerCase()
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isConnected, addressUser]);

  const { data: stakingContracts } = useReadContract({
    abi: stakingFactoryAbi,
    functionName: "getAllStakingContracts",
    address: StakingFactoryAddress,
    chainId: chainId,
  });
  console.log("aaa", stakingContracts);

  const { data: isInitialized } = useReadContract({
    abi: stakingAbi,
    functionName: "isInitialized",
    address: "0x6c57Da5a6C7CcE95f5Fb654348541850DE7bb280",
    chainId: chainId,
  });
  console.log("test", isInitialized);

  console.log("contract", stakingContracts);

  return (
    <div className="container min-h-screen pb-12">
      {addressUser ? (
        <div className="mx-auto xl:mx-14">
          <div className="my-6 flex justify-between items-center">
            <h1 className="text-3xl font-semibold">List of Liquidity Pools</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stakingContracts &&
              stakingContracts.map((contractInfo, index) => (
                <StakePoolCard
                  key={index}
                  addressContract={contractInfo.stakingContract}
                  addressToken={contractInfo.stakingToken}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[80vh]">
          <a className="text-2xl font-bold">Please connect your wallet</a>
        </div>
      )}
    </div>
  );
}
