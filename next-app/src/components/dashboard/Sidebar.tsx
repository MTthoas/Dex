import Link from "next/link";
import { UsersIcon, SettingsIcon, VercelLogo } from "@/components/Icons";

const Sidebar = () => {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-[60px] items-center border-b px-5">
        <Link href="/dashboard" passHref>
          <div className="flex items-center gap-2 font-semibold">Dashboard</div>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
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
    </div>
  );
};

export default Sidebar;
