// app/pages/dashboard/users/page.tsx
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Hook, User } from "@/types/hookResponse.type";
import UsersTable from "@/components/dashboard/users/UsersTable";
import { getUsers } from "@/hook/users.hook";

const UsersPage: React.FC = () => {
  const {
    data: users,
    isError,
    error,
  } = useQuery<Hook<User[]>>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
      </div>
      {isError && <p>Error loading users: {error?.message}</p>}
      <UsersTable users={users ? users.data : []} />
    </div>
  );
};

export default UsersPage;
