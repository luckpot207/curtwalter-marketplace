import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {useWallet} from "@solana/wallet-adapter-react";
import { copyTextToClipboard, lamportsToSOL, nFormatter, shortPublicKey } from "../../lib/utils";
import { PropsWithChildren, useEffect, useState } from "react";
import { useStore } from "../../lib/store";
import { fetchUserPublic } from "../../services/users";
import { fetchSolWalletBalance } from "../../services/wallets";
import classNames from "classnames";
import { SolanaLogo } from "../logo/SolanaLogo";
import { Spinner, Tooltip } from "../../lib/flowbite-react";
import { store } from "../../api/store";

export default function WalletSummary(props: PropsWithChildren<{
  showBackButton?: boolean
}>) {
  const [copyLabel, setCopyLabel] = useState("Copy Address")
  // const { wallet } = useWallet()
  const {
    setHeaderWalletMenuShow,
    walletUserPublic,
    walletBalance,
    setWalletUserPublic,
    setWalletBalance,
  } = useStore()

  // useEffect(() => {
  //   if (wallet?.adapter.publicKey) {
  //     fetchUserPublic(wallet?.adapter.publicKey.toBase58())
  //       .then((data) => {
  //         setWalletUserPublic(data)
  //       })
  //     fetchSolWalletBalance(wallet?.adapter.publicKey.toBase58())
  //       .then((data) => {
  //         setWalletBalance(data)
  //         store.dispatch?.({ type: "SetBalance", balance: parseInt(data.balance) });
  //       })
  //   }
  // }, [wallet?.adapter.publicKey])

  return (
    <div className="flex justify-center">
      <div className="container">
        {props.showBackButton ? (
          <div className='justify-center flex lg:hidden p-4 mt-5'>
            <div className='flex items-center'>
              <a href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setHeaderWalletMenuShow(false)
                }}
                className='flex items-center hover:text-black dark:hover:text-white'>
                <FontAwesomeIcon icon={['far', 'arrow-left']} className='h-5' />
                <span className='ml-2'>Back</span>
              </a>
            </div>
          </div>
        ) : null}
        <div className='justify-center flex p-4 mb-5 mt-5'>
          <div className='flex items-center text-lg'>
            <FontAwesomeIcon icon={['far', 'wallet']} className='h-5' />
            <span className='ml-2'>{'wallet?.adapter.name'} Wallet</span>
          </div>
        </div>
        <div className='justify-center flex mb-5'>
          <div className='flex items-center text-sm'>
            <span className='ml-2 flex'>
              {walletUserPublic ? (
                walletUserPublic.username + " | "
              ) : null}
              {/* {shortPublicKey(wallet?.adapter.publicKey?.toBase58()!)} */}
              <Tooltip content={copyLabel}>
                <a href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    copyTextToClipboard('wallet?.adapter.publicKey?.toBase58()!')
                      .then(() => {
                        setCopyLabel("Address Copied")
                        setTimeout(() => {
                          setCopyLabel("Copy Address")
                        }, 2000)
                      })
                      .catch(console.error)
                  }}
                  className='ml-2 hover:text-black dark:hover:text-white'>
                  <FontAwesomeIcon icon={['far', 'copy']} className='h-5' />
                </a>
              </Tooltip>
            </span>
          </div>
        </div>
        <div className="flex justify-center px-10">
          <div className='w-full max-w-md'>
            {walletBalance
              ? (
                <ul className="rounded-lg divide-y divide-gray-200 dark:divide-gray-500 border border-gray-200 dark:border-gray-500">
                  <li
                    className={classNames({
                      'p-3 flex items-center': true,
                      'rounded-t-lg': true,
                      'rounded-b-lg': true,
                    })}>
                    <SolanaLogo className='h-6 w-6' />
                    <span className='ml-2 whitespace-nowrap'>{nFormatter(lamportsToSOL(walletBalance.balance), 4)} SOL</span>
                    <div className='text-right w-full'>
                      <span className='rounded text-sm bg-gray-400 text-white dark:text-black p-1'>Solana</span>
                    </div>
                  </li>
                </ul>
              )
              : (<Spinner size='lg' color='gray' />)}
          </div>
        </div>
      </div>
    </div>
  )
}
