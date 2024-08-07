import { ERC20 } from "@/abi/ERC20";
import { LiquidityPoolABI } from "@/abi/liquidityPool";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { useEthersSigner } from "@/context/Provider";
import { ethers } from "ethers";
import { useMemo } from "react";
import { Address } from "viem";
import { useReadContract } from "wagmi";

/** Hook to get the factory contract instance */
export function useFactoryContract({
  chainId,
  address,
}: {
  chainId?: number;
  address: Address;
}) {
  const signer = useEthersSigner(chainId ? { chainId } : {});

  return useMemo(() => {
    return new ethers.Contract(address, liquidityPoolFactoryABI, signer);
  }, [signer]);
}

export function useLiquidityPoolContract({
  address,
  chainId,
}: {
  chainId?: number;
  address: Address;
}) {
  const signer = useEthersSigner(chainId ? { chainId } : {});

  return useMemo(() => {
    return new ethers.Contract(address, LiquidityPoolABI, signer);
  }, [signer]);
}

export function useERC20UpgradeableContract({
  chainId,
  address,
}: {
  chainId?: number;
  address: Address;
}) {
  const signer = useEthersSigner(chainId ? { chainId } : {});

  return useMemo(() => {
    return new ethers.Contract(address, ERC20, signer);
  }, [signer]);
}

export function getSigner({ chainId }: { chainId?: number } = {}) {
  const signer = useEthersSigner({ chainId });

  return signer;
}

export const useTokenTotalSupply = (tokenAddress) => {
  const { data: totalSupply, isLoading } = useReadContract({
    abi: ERC20,
    functionName: "totalSupply",
    address: tokenAddress,
  });

  return { totalSupply, isLoading };
};
