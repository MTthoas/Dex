import Header from "@/components/common/Header";
import { ThemeProvider } from "@/context/ThemeProvider";
import Web3ModalProvider from "@/context/index";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genx DEX",
  description: "Decentralized Exchange",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.08] bg-grid-black/[0.1] relative ">
              {/* Radial gradient for the container to give a faded look */}

              <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_15%,black)]"></div>

              <div className="relative z-10 h-full w-full">
                <Header />
                {children}
                {/* <Footer /> */}
              </div>
            </div>
          </ThemeProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
