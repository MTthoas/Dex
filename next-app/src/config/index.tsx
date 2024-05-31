import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: projectId || "",
  chains: [mainnet, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
