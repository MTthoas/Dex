import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
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
            <Header />
            {[children]}
            <Footer />
          </ThemeProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
