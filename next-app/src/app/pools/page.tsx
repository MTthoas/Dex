"use client";
import Layout from "@/components/liquidityPool/Layout";
import { useAccount } from "wagmi";

export default function Page() {
  const account = useAccount();
  const { address } = account;

  return (
    <div className="container min-h-screen">
      <div className="mx-auto xl:mx-14">
        {address ? (
          <Layout />
        ) : (
          <div className="flex justify-center items-center h-[80vh]">
            <a className="text-2xl font-bold">Please connect your wallet</a>
          </div>
        )}
      </div>
    </div>
  );
}
