import { PropsWithChildren, useMemo } from "react";
// import {
//   ConnectionProvider as SolanaConnectionProvider,
//   WalletProvider as SolanaWalletProvider
// } from '@solana/wallet-adapter-react';
// import {
//   LedgerWalletAdapter,
//   PhantomWalletAdapter,
//   SolflareWalletAdapter,
//   SolletWalletAdapter,
// } from '@solana/wallet-adapter-wallets';
import { solanaHttpRpcUrl } from "../../lib/utils";


export function WalletProvider({ children }: PropsWithChildren<{}>) {
  const wallets = useMemo(
    () => [
      // new PhantomWalletAdapter(),
      // new SolflareWalletAdapter(),
      // new SolletWalletAdapter(),
      // new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    // <SolanaConnectionProvider endpoint={solanaHttpRpcUrl()!}>
    //   <SolanaWalletProvider wallets={wallets} autoConnect={true}>
    { children }
    //     </SolanaWalletProvider>
    //   </SolanaConnectionProvider>
  );
}