import { LiquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { useReadContract } from "wagmi";

export function usePools() {
  const { data: allPoolsLength } = useReadContract({
    address: LiquidityFactoryAddress,
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsLength",
  });

  const { data: allPoolsAddress } = useReadContract({
    address: LiquidityFactoryAddress,
    abi: liquidityPoolFactoryABI,
    functionName: "allPoolsAddress",
  });

  return { allPoolsAddress, allPoolsLength };
}
