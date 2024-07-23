"use client";
import TransactionsTable from "@/components/administration/histories/TransactionsTable";
import { getTransactions } from "@/hook/transactions.hook";
import { getUsers } from "@/hook/users.hook";
import { Hook, Transaction, User } from "@/types/hookResponse.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const HistoriesPage: React.FC = () => {
  const users = useQuery<Hook<User[]>>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: transactions, isLoading } = useQuery<Hook<Transaction[]>>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });

  return (
    <>
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Histories</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        {/* <div className="flex items-center">
          <h2 className="font-semibold text-lg md:text-2xl">Users</h2>
        </div>
        {users.data?.isError && (
          <p>Error loading users: {users.data.error?.message}</p>
        )}
        <UsersTable users={users.data ? users.data?.data : []} /> */}

        {transactions?.isError && (
          <p>Error loading transactions: {transactions.data.error?.message}</p>
        )}

        <TransactionsTable
          transactions={
            transactions && transactions.data ? transactions.data : []
          }
          isLoading={isLoading}
        />
      </main>
    </>
  );
};

export default HistoriesPage;
