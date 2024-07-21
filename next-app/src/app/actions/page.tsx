"use client";
import ActionPage from "@/components/actions/page";
import { useAccount } from "wagmi";
const SwapPage = ({ children }: { children: React.ReactNode }) => {
  const account = useAccount();
  const { address } = account;

  return (
    <div className="container min-h-screen">
      {address ? (
        <ActionPage />
      ) : (
        <div className="flex justify-center items-center h-[80vh]">
          <a className="text-2xl font-bold">Please connect your wallet</a>
        </div>
      )}
    </div>
  );
};

export default SwapPage;
