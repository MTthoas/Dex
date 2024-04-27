import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/dashboard/Sidebar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useRouter } from "next/router.js";

const DashboardSection = dynamic(
  () => {
    const router = useRouter();
    const section = router.query.section || "default";
    return import(`./${section}/page.tsx`).catch(() => import("./users/page"));
  },
  {
    suspense: true,
  }
);

const DashboardPage: React.FC = () => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary>
          <DashboardSection />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default DashboardPage;
