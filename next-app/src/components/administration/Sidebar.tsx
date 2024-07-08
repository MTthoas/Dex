"use client";
import Link from "next/link";
import {
  HomeIcon,
  ActivityIcon,
  CoinsIcon,
  WalletIcon,
  SettingsIcon,
  ArrowLeftCircleIcon,
} from "lucide-react";
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const location = usePathname();
  const linkClasses = (path: string) =>
    location === path
      ? "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 bg-gray-100 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50";

  return (
    <div className="hidden bg-gray-100/40 lg:block dark:bg-gray-800/40 rounded">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-5">
          <Link href="/administration/dashboard" passHref>
            <span className="font-semibold text-lg">Administration</span>
          </Link>
        </div>
        <div className="flex overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              href="/administration/dashboard"
              passHref
              className={linkClasses("/administration/dashboard")}
            >
              <HomeIcon className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/administration/analytics"
              passHref
              className={linkClasses("/administration/analytics")}
            >
              <ActivityIcon className="h-4 w-4" />
              Analytics
            </Link>
            <Link
              href="/administration/tokens"
              passHref
              className={linkClasses("/administration/tokens")}
            >
              <CoinsIcon className="h-4 w-4" />
              Token Management
            </Link>
            <Link
              href="/administration/platform"
              passHref
              className={linkClasses("/administration/platform")}
            >
              <SettingsIcon className="h-4 w-4" />
              Platform Management
            </Link>
            <Link
              href="/administration/contracts"
              passHref
              className={linkClasses("/administration/contracts")}
            >
              <WalletIcon className="h-4 w-4" />
              Contract Management
            </Link>
            <Link
              href="/administration/histories"
              passHref
              className={linkClasses("/administration/histories")}
            >
              <ArrowLeftCircleIcon className="h-4 w-4" />
              Histories
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
