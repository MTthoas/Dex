"use client";
import React from "react";
import UsersTable from "@/components/administration/histories/UsersTable";
import TransactionsTable from "@/components/administration/analytics/TransactionsTable";
import { getUsers } from "@/hook/users.hook";
import { getTransactions } from "@/hook/users.hook";
import { Hook, Transaction, User } from "@/types/hookResponse.type";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

const HistoriesPage: React.FC = () => {
  const users = useQuery<Hook<User[]>>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const transactions = useQuery<Hook<Transaction[]>>({
    queryKey: ["transactions"],
    queryFn: getTransactions,
  });
  return (
    <>
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Histories</h1>
        </div>
        <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
              />
            </div>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h2 className="font-semibold text-lg md:text-2xl">Users</h2>
        </div>
        {users.data?.isError && (
          <p>Error loading users: {users.data.error?.message}</p>
        )}
        <UsersTable users={users.data ? users.data?.data : []} />

        <div className="flex items-center">
          <h2 className="font-semibold text-lg md:text-2xl">Transactions</h2>
        </div>
        {transactions.data?.isError && (
          <p>Error loading transactions: {transactions.data.error?.message}</p>
        )}
        <TransactionsTable
          transactions={transactions.data ? transactions.data?.data : []}
        />
      </main>
    </>
  );
};

function SearchIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default HistoriesPage;
