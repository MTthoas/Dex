import dynamic from "next/dynamic";
const ClientComponent = dynamic(
  () => import("@/components/dashboard/ClientComponent"),
  { ssr: false }
);

export default function Page() {
  return (
    <div className="mx-auto h-screen max-w-7xl px-6 py-2 lg:px-8 mt-5">
      Dashboard page
      <ClientComponent />
    </div>
  );
}
