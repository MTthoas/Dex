"use client";

import { ReactNode } from "react";
// import { config, projectId } from "@/config";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, polygonAmoy, sepolia } from "viem/chains";
import {
  State,
  WagmiProvider,
  cookieStorage,
  createStorage,
  http,
} from "wagmi";

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const config = getDefaultConfig({
  appName: "Dex config app",
  projectId: projectId || "",
  chains: [mainnet, sepolia, polygonAmoy],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
});

if (!projectId) throw new Error("Project ID is not defined");

export default function Web3ModalProvider({
  children,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: "#7b3fe4",
            accentColorForeground: "white",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
