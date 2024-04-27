// app/pages/dashboard/transactions/page.tsx
"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/ErrorBoundary";

const TransactionsDashboard = dynamic(
  () => import("@/components/dashboard/TransactionsDashboard"),
  {
    suspense: true,
  }
);

const TransactionsPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading Transactions...</div>}>
      <ErrorBoundary>
        <TransactionsDashboard />
      </ErrorBoundary>
    </Suspense>
  );
};

export default TransactionsPage;
