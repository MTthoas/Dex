'use client';

import StakingFactoryModalAddStake from "@/components/stakingPool/AddStakeModal";
import StakePoolCard from "@/components/stakingPool/StakePoolCard";
import { useAccount, useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { AdminWallet } from "@/abi/address";
import { stakingFactoryAbi } from "@/abi/StakingFactory";
import { stakingAbi } from "@/abi/Staking";
import { StakingFactoryAddress } from "@/abi/address";

export default function StakingPoolFactoryPage() {
  const { address: addressUser, isConnected, chainId } = useAccount();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isConnected && addressUser?.toLowerCase() === AdminWallet.toLowerCase()) {
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
  })
  console.log("aaa", stakingContracts);

  const { data: isInitialized } = useReadContract({
    abi: stakingAbi,
    functionName: "isInitialized",
    address: "0x6c57Da5a6C7CcE95f5Fb654348541850DE7bb280",
    chainId: chainId,
  })
  console.log("test", isInitialized);

  console.log("contract", stakingContracts);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stakingContracts && stakingContracts.map((contractInfo, index) => (
          <StakePoolCard key={index} addressContract={contractInfo.stakingContract} addressToken={contractInfo.stakingToken}/>
        ))}
      </div>
    </div>
  );
}