// components/Layout.js
"use client";
import Sidebar from "@/components/administration/Sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
};

export default Layout;
