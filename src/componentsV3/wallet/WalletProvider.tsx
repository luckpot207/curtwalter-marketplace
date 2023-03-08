import { PropsWithChildren, useMemo } from "react";
import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export function WalletProvider({ children }: PropsWithChildren<{}>) {
  const { chains, provider, webSocketProvider } = configureChains(
    [polygon, polygonMumbai],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "NFT marketplace",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
    webSocketProvider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
