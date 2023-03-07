import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationOverlay } from "./components/notifications";
import { ThemeProvider } from "./lib/next-themes";
import { WalletProvider } from "./componentsV3/wallet/WalletProvider";
import { useCreateStore, Provider as ZustandProvider } from "./lib/store";
import { Index } from "./pages";
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme as rainbowDarkTheme,
  lightTheme as rainbowLightTheme,
} from '@rainbow-me/rainbowkit'
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  trustWallet,
  imTokenWallet,
  omniWallet,
  ledgerWallet,
  braveWallet,
  argentWallet
} from '@rainbow-me/rainbowkit/wallets';
import supportedChains from './utils/chains'
import { BLOCKCHAIN } from './utils/enums';

import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import '@rainbow-me/rainbowkit/styles.css'

const { chains, provider } = configureChains(supportedChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
  publicProvider(),
])

function App() {
  // @ts-ignore
  const createStore = useCreateStore({});

  return (
    <ZustandProvider createStore={createStore}>
      <RainbowKitProvider chains={chains}>
        <EthConnectionProvider defaultNetwork={BLOCKCHAIN.PolygonTestnet}>
          <ThemeProvider
            defaultTheme="light"
            themes={["light", "dark"]}
            attribute="class"
          >
            {/* <WalletProvider> */}
            <Router>
              <Routes>
                {/* <Route path="/explore">
                <Explore />
              </Route>
              <Route path="/faq">
                <FAQ />
              </Route>
              <Route path="/collection/:slug/activity">
                <CollectionActivity />
              </Route>
              <Route path="/collection/:slug/edit">
                <EditCollection />
              </Route>
              <Route path="/collection/:slug">
                <Collection />
              </Route>
              <Route path="/t/:pubkey">
                <Token />
              </Route>
              <Route path="/user/:pubkey">
                <User />
              </Route>
              <Route path="/privacy">
                <Privacy />
              </Route>
              <Route path="/stake">
                <Stake />
              </Route>
              <Route path="/submissions/:id">
                <SubmissionsUpsert />
              </Route>
              <Route path="/submissions">
                <Submissions />
              </Route> */}
                <Route path="/" element={<Index />} />
              </Routes>
            </Router>
            <NotificationOverlay />
            {/* </WalletProvider> */}
          </ThemeProvider>
        </EthConnectionProvider>

      </RainbowKitProvider>
    </ZustandProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
