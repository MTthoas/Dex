import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Web3ModalProvider from "@/context/Provider";

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
          <Header />
          {[children]}
          <Footer />
        </Web3ModalProvider>
      </body>
    </html>
  );
}
