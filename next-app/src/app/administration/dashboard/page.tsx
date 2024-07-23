"use client";
import { Token } from "@/app/tokens/token.model";
import UsersTable from "@/components/administration/dashboard/UsersTable";
import { getTokens } from "@/hook/tokens.hook";
import { getUsers } from "@/hook/users.hook";
import { Hook, User } from "@/types/hookResponse.type";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const DashboardPage: React.FC = () => {
  const { data: users, isLoading: isUsersLoading } = useQuery<Hook<User[]>>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const { data: tokensFetch = [], isLoading: isTokensLoading } = useQuery<Token[]>({
    queryKey: ["tokens"],
    queryFn: getTokens,
  });

  return (
    <>
      <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">Main dashboard</h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <UsersTable
          users={users ? users?.data : []}
          isUsersLoading={isUsersLoading}
          tokens={tokensFetch ? tokensFetch : []}
          isTokensLoading={isTokensLoading}
        />
      </main>
    </>
  );
};

export default DashboardPage;
