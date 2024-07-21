import { LiquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import ActionPage from "@/components/actions/page";
import { useAccount, useReadContract } from "wagmi";
import { polygonAmoy } from "viem/chains";

const SwapPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center  min-h-screen py-20">
      <ActionPage />
    </div>
  );
};

export default SwapPage;
