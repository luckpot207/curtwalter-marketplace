import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "../../lib/next/client/image";
// import {useWallet, Wallet, WalletContextState} from "@solana/wallet-adapter-react";
// import {PhantomWalletName} from "@solana/wallet-adapter-phantom";
// import {WalletReadyState} from "@solana/wallet-adapter-base";
import { isMobile } from "react-device-detect";
import { PropsWithChildren } from "react";
import { useStore } from "../../lib/store";
import { Spinner } from "../../lib/flowbite-react";
import { useAccount } from "wagmi";
import { useWeb3React, getWeb3ReactContext } from "@web3-react/core";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/`,
  appName: "Web3-react Demo",
  supportedChainIds: [1, 3, 4, 5, 42],
});

const WalletConnect = new WalletConnectConnector({
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

export default function WalletSelector(
  props: PropsWithChildren<{
    showBackButton?: boolean;
  }>
) {
  // const walletContextState: WalletContextState = useWallet()
  // const { wallets, select, connecting } = walletContextState
  const { setHeaderWalletMenuShow } = useStore();
  const { activate, deactivate, connector } = useWeb3React();
  const { isConnecting } = useAccount();

  // const connectWalletHandler = (e: any, wallet: Wallet) => {
  //   if (!(wallet.adapter.name === PhantomWalletName && wallet.adapter.readyState !== WalletReadyState.Installed)) {
  //     e.preventDefault()
  //     select(wallet.adapter.name)
  //   }
  // }

  return (
    <div className="flex justify-center">
      <div className="container">
        {props.showBackButton ? (
          <div className="justify-center flex lg:hidden p-4 mt-5">
            <div className="flex items-center">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setHeaderWalletMenuShow(false);
                }}
                className="flex items-center hover:text-black dark:hover:text-white"
              >
                <FontAwesomeIcon icon={["far", "arrow-left"]} className="h-5" />
                <span className="ml-2">Back</span>
              </a>
            </div>
          </div>
        ) : null}
        <div className="justify-center flex p-4 mb-5 mt-5">
          <div className="flex items-center text-lg">
            <FontAwesomeIcon icon={["far", "wallet"]} className="h-5" />
            <span className="ml-2">Connect Wallet</span>
          </div>
        </div>
        <div className="flex justify-center px-10">
          <div className="w-full max-w-sm flex justify-center">
            {isConnecting ? ( //connecting
              <Spinner size="lg" color="gray" />
            ) : (
              <ul className="w-full">
                <li className="bg-white dark:bg-zinc-800 rounded-md p-1 my-2 flex dark:border-zinc-700 border-gray-100 border hover:border-gray-300 dark:hover:border-zinc-500">
                  <button
                    className="flex w-full p-2"
                    onClick={() => {
                      activate(CoinbaseWallet);
                    }}
                  >
                    <div className="flex">
                      {/* <Image width={20} height={20} layout='fixed' /> */}
                    </div>
                    <span className="ml-2 whitespace-nowrap">
                      {"Coinbase Wallet"}
                    </span>
                  </button>
                </li>
                <li className="bg-white dark:bg-zinc-800 rounded-md p-1 my-2 flex dark:border-zinc-700 border-gray-100 border hover:border-gray-300 dark:hover:border-zinc-500">
                  <button
                    className="flex w-full p-2"
                    onClick={() => {
                      activate(WalletConnect);
                    }}
                  >
                    <span className="ml-2 whitespace-nowrap">
                      {"Wallet Connect"}
                    </span>
                  </button>
                </li>
                <li className="bg-white dark:bg-zinc-800 rounded-md p-1 my-2 flex dark:border-zinc-700 border-gray-100 border hover:border-gray-300 dark:hover:border-zinc-500">
                  <button
                    className="flex w-full p-2"
                    onClick={() => {
                      activate(Injected);
                    }}
                  >
                    <span className="ml-2 whitespace-nowrap">{"Metamask"}</span>
                  </button>
                </li>

                {/* { wallets.map((wallet, idx) => (
                    <li key={wallet.adapter.name}
                        className='bg-white dark:bg-zinc-800 rounded-md p-1 my-2 flex dark:border-zinc-700 border-gray-100 border hover:border-gray-300 dark:hover:border-zinc-500'>
                      <a rel="noreferrer"
                         className='flex w-full p-2'
                         href={wallet.adapter.name === PhantomWalletName && wallet.adapter.readyState !== WalletReadyState.Installed
                           ? isMobile
                             ? `https://phantom.app/ul/browse/${encodeURIComponent(`https://${window.location.hostname}`)}`
                             : 'https://phantom.app'
                           : '#'}
                         target={isMobile ? '_self': '_blank'}
                         onClick={(e) => connectWalletHandler(e, wallet)}
                      >
                        <div className='flex'>
                          <Image width={20} height={20} layout='fixed' src={wallet.adapter.icon}/>
                        </div>
                        <span className='ml-2 whitespace-nowrap'>{wallet.adapter.name}</span>
                        <div className='text-right w-full'>
                          <span className='rounded text-sm bg-gray-400 text-white dark:text-black p-1'>Solana</span>
                        </div>
                      </a>
                    </li>
                  )) } */}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
