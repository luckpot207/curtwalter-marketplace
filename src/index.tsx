import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from "@ethersproject/providers";

import "flowbite";
import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Toaster } from "react-hot-toast";
import { useCreateStore, Provider as ZustandProvider } from "./lib/store";
import { ThemeProvider } from "./themes";
import { NotificationOverlay } from "./components/notifications";
import { WalletProvider } from "./componentsV3/wallet/WalletProvider";
import { MarketplaceProvider } from "./context/MarketplaceProvider";
import { Index } from "./pages";
import { ApplyLaunchPad } from "./pages/applyLaunchpad";
import { Collection } from "./pages/collection/[slug]";
import { Sale, Auction } from "./pages/explore";
import { Launches } from "./pages/launches";
import { Token } from "./pages/launchpad";
import { User } from "./pages/user/[pubkey]";

function App() {
  // @ts-ignore
  const createStore = useCreateStore({});

  return (
    <ZustandProvider createStore={createStore}>
      <ThemeProvider
        defaultTheme="light"
        themes={["light", "dark"]}
        attribute="class"
      >
        <WalletProvider>
          <MarketplaceProvider>
            <Toaster />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/explore/sale" element={<Sale />} />
                <Route path="/explore/auction" element={<Auction />} />
                <Route path="/collection/:slug" element={<Collection />} />
                <Route path="/user/:pubkey" element={<User />} />
                <Route path="/t" element={<Token />} />
                <Route
                  path="/applylaunch"
                  element={<ApplyLaunchPad loader={false} />}
                />
                <Route path="/launches" element={<Launches />} />
              </Routes>
            </Router>
            <NotificationOverlay />
          </MarketplaceProvider>
        </WalletProvider>
      </ThemeProvider>
    </ZustandProvider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
