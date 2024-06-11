// app/pages/dashboard/transactions/page.tsx
"use client";
import TransactionsTable from "@/components/administration/transactions/TransactionsTable";
import { getTransactions } from "@/hook/users.hook";
import { Hook, Transaction } from "@/types/hookResponse.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const TransactionsPage: React.FC = () => {
  const {
    data: transactions,
    isError,
    error,
  } = useQuery<Hook<Transaction[]>>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Transactions</h1>
      </div>
      {isError && <p>Error loading transactions: {error?.message}</p>}
      <TransactionsTable transactions={transactions ? transactions.data : []} />
    </div>
  );
};

export default TransactionsPage;
