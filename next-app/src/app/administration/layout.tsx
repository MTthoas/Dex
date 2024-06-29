import Sidebar from "@/components/administration/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-2 lg:px-8 mt-5">
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col">{children}</div>
      </div>
    </div>
  );
}
