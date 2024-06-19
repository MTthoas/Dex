import { liquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import { useReadContract } from 'wagmi';

export function usePools() {

  const { data: allPoolsLength } = useReadContract({
    address: liquidityFactoryAddress,
    abi: liquidityPoolFactoryABI,
    functionName: 'allPoolsLength',
  });


  const { data: allPoolsAddress } = useReadContract({
    address: liquidityFactoryAddress,
    abi: liquidityPoolFactoryABI,
    functionName: 'allPoolsAddress',
  })

  return {allPoolsAddress, allPoolsLength};
}
