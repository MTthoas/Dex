import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, mainnet, polygonAmoy } from "wagmi/chains";

// Get projectId at https://cloud.walletconnect.com
export const projectId = "8702c956ee9a0596b61e6729493940c9";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: projectId || "",
  chains: [mainnet, sepolia, polygonAmoy],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
