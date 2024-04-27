// app/pages/dashboard/users/page.tsx
"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";

const UsersDashboard = dynamic(
  () => import("@/components/dashboard/UsersDashboard"),
  {
    suspense: true,
  }
);

const UsersPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading Users...</div>}>
      <ErrorBoundary>
        <UsersDashboard />
      </ErrorBoundary>
    </Suspense>
  );
};

export default UsersPage;
