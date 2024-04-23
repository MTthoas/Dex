"use client";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function Home() {
  const { open } = useWeb3Modal();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={() => open()}>Open Connect Modal</button>
    </main>
  );
}
