import Sidebar from "@/components/administration/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-2 lg:px-8 mt-5">
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <div className="hidden bg-gray-100/40 lg:block dark:bg-gray-800/40 rounded mr-5">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-[60px] items-center border-b px-5">
              <span className="">Dashboard</span>
            </div>
            <Sidebar />
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium"></nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}
