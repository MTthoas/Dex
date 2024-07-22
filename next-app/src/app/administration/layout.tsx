import Sidebar from "@/components/administration/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-2 lg:px-8 mt-5 z-40 bg-white dark:bg-black">
      <div className="grid min-h-screen w-full lg:grid-cols-[200px_1fr] z-40">
        <Sidebar />
        <div className="flex flex-col z-40 bg-transparant">{children}</div>
      </div>
    </div>
  );
}
