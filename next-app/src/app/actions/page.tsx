import { liquidityFactoryAddress } from "@/abi/address";
import { liquidityPoolFactoryABI } from "@/abi/liquidityPoolFactory";
import ActionPage from "@/components/actions/page";
import { useAccount, useReadContract } from "wagmi";
import { polygonAmoy } from "viem/chains";

const SwapPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center mt-12">
      <ActionPage />
    </div>
  );
};

export default SwapPage;
