// components/ClientComponent.js
"use client";

// import { abi } from "@/abis/ERC20Upgradeable.json";
import { abi } from "@/abi/abi";
import { useAccount, useBalance, useEnsName, useReadContract } from "wagmi";

const tokenAddress = "0xb1d5503492e692f0648a5d4da1317cf30d54efdf";

export default function ClientComponent() {
  const { address } = useAccount();
  const { data, error, status } = useEnsName({ address });
  const result = useBalance({ address: address });

  const { data: balance } = useReadContract({
    abi: abi,
    functionName: "balanceOf",
    address: tokenAddress,
    args: ["0x3964d0011eb003488ab59b1ce0c235baa3998bdd"],
  });

  console.log("balance", balance);

  if (status === "pending") return <div>Loading ENS name</div>;
  if (status === "error")
    return <div>Error fetching ENS name: {error.message}</div>;
  return (
    <div>
      balance: {result.data?.formatted}, address : {address}
      <br />
      <div>Balance: {balance?.toString()}</div>
    </div>
  );
}
