"use client";
import Link from "next/link";
import { UsersIcon, SettingsIcon, VercelLogo } from "@/components/Icons";

const Sidebar = () => {
  return (
    <div className="flex overflow-auto py-2">
      <nav className="grid items-start px-4 text-sm font-medium  space-y-2">
        <Link href="/dashboard/users" passHref>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4" />
            Users
          </div>
        </Link>
        <Link href="/dashboard/transactions" passHref>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Transactions
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
