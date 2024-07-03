"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import NewUsersGraph from "@/components/administration/analytics/NewUsersGraph";
import TotalLiquidityGraph from "@/components/administration/analytics/TotalLiquidityGraph";
import TotalTradingVolumeGraph from "@/components/administration/analytics/TotalTradingVolumeGraph";
import { SearchIcon } from "@/components/Icons";

const AnalyticsPage: React.FC = () => {
  return (
    <>
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
      <div className="flex-1">
        <h1 className="font-semibold text-lg">Analytics</h1>
      </div>
      <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search analitycs..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-white"
            />
          </div>
        </form>
      </div>
    </header>
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <NewUsersGraph />
      <TotalLiquidityGraph />
      <TotalTradingVolumeGraph />
    </main>
  </>
  );
};

export default AnalyticsPage;
