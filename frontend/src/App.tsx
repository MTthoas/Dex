import Landpage from "./components/landpage/Landpage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import TokenPage from "./components/tokens/TokenPage"

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme 
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import SwapPage from "./components/swap/SwapPage";

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: import.meta.env.ALCHEMY_ID || '' }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: import.meta.env.APP_NAME || 'Wagmi',
  projectId: import.meta.env.ALCHEMY_ID || 'wagmi',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
        <Router>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <main style={{ flex: "1" }}>
              <Header />
              <Routes>
                  <Route path="/" element={<Landpage />} />
                  <Route path="/tokens" element={<TokenPage />} />
                  <Route path="/swap" element={<SwapPage />} />

              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}