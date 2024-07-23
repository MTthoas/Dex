"use client";
import Airdrop from "@/components/administration/tokens/Airdrop";
import React from "react";

const TokensPage: React.FC = () => {
  return (
    <>
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Tokens Management</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Airdrop />
      </main>
    </>
  );
};

export default TokensPage;
