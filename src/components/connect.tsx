import React, { useEffect, useState } from "react";
import { Transition, Menu } from "@headlessui/react";
import { classNames } from "../utils/clsx";
import { BiDotsHorizontalRounded as DotsCircleHorizontalIcon } from "react-icons/bi";

import { connectToWallet, TWallet } from "../api/wallet";
import { store, useSelector } from "../api/store";
import { lamportsToSOL } from "../utils/sol";
import { Link } from "react-router-dom";
import { getUser } from "../api/api";
import { differenceInDays } from "date-fns";
import AccountName from "./accountName";
import { DontMissTheOffersDialog, RegisterDialog } from "./account";
import { SetStateDarkMode } from "../api/actions";

const nightwind = require("nightwind/helper");

export const walletOptions: { name: string; image: any; wallet: TWallet }[] = [
  { name: "Phantom", image: "/icons/phantom.png", wallet: "Phantom" },
  { name: "Sollet", image: "/icons/sollet.svg", wallet: "Sollet" },
  { name: "Solflare", image: "/icons/solflare.svg", wallet: "Solflare" },
];

const DONT_MISS_MODAL_TIME = "dontMissModalTime";

export default function WalletConnect(props: {}) {
  const { storedWallet, accountBalance, isConnected, user, hasUser } =
    useSelector((data) => ({
      storedWallet: data.wallet,
      isConnected: data.isConnected,
      accountBalance: data.accountBalance,
      user: data.user,
      hasUser: data.hasUser,
    }));
  // const wallet = useWallet();
  // const walletModal = useWalletModal();

  const darkMode = useSelector((data) => data.darkMode);

  // useEffect(() => {
  //   if (
  //     wallet.connected &&
  //     !wallet.disconnecting &&
  //     (!storedWallet || !storedWallet.connected)
  //   ) {
  //     connectToWallet(wallet);
  //   }
  // }, [storedWallet, wallet.connected]);

  const [dialog, setDialog] = useState<
    "none" | "dontMissTheOffers" | "register"
  >("none");

  // useEffect(() => {
  //   if (isConnected && wallet?.publicKey && hasUser === "unknown") {
  //     getUser(wallet?.publicKey.toString(), true)
  //       .then((user) => {
  //         store.dispatch?.({ type: "SetUser", user });
  //         store.dispatch?.({ type: "SetHasUser", hasUser: "yes" });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         store.dispatch?.({ type: "SetHasUser", hasUser: "no" });
  //         const lastShownTime = localStorage.getItem(DONT_MISS_MODAL_TIME);
  //         if (
  //           !lastShownTime ||
  //           differenceInDays(new Date(lastShownTime!), new Date()) >= 1
  //         ) {
  //           setDialog("dontMissTheOffers");
  //           localStorage.setItem(
  //             DONT_MISS_MODAL_TIME,
  //             new Date().toISOString()
  //           );
  //         }
  //       });
  //   }
  // }, [isConnected, wallet?.publicKey, hasUser]);

  // if (isConnected && wallet) {
  //   const key = wallet!.publicKey!.toBase58();
  //   return (
  //     <>
  //       {accountBalance > 0 && (
  //         <div className="text-base flex text-sm font-medium">
  //           <span>◎</span>
  //           {lamportsToSOL(accountBalance)} SOL
  //         </div>
  //       )}
  //       <Link
  //         className="text-base text-sm hover:text-gray-500  font-medium"
  //         to={`/user/${key}`}
  //       >
  //         <AccountName pubkey={key} />
  //       </Link>
  //       <Menu as="div" className="relative inline-block text-left">
  //         <div className="flex gap-x-2 md:gap-x-4 lg:gap-x-6">
  //           <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
  //             <DotsCircleHorizontalIcon className="w-6w h-6" />
  //           </Menu.Button>
  //           <Transition
  //             as={React.Fragment}
  //             enter="transition ease-out duration-100"
  //             enterFrom="transform opacity-0 scale-95"
  //             enterTo="transform opacity-100 scale-100"
  //             leave="transition ease-in duration-75"
  //             leaveFrom="transform opacity-100 scale-100"
  //             leaveTo="transform opacity-0 scale-95"
  //           >
  //             <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
  //               <div className="py-1">
  //                 <Menu.Item>
  //                   {({ active }) => (
  //                     <Link
  //                       className={classNames(
  //                         "font-medium text-gray-900",
  //                         active ? "bg-gray-100" : "",
  //                         "px-4 py-2 text-sm w-full text-left flex"
  //                       )}
  //                       to={`/user/${wallet.publicKey!.toBase58()}`}
  //                     >
  //                       My Wallet
  //                     </Link>
  //                   )}
  //                 </Menu.Item>
  //                 <Menu.Item>
  //                   {({ active }) => (
  //                     <Link
  //                       className={classNames(
  //                         "font-medium text-gray-900",
  //                         active ? "bg-gray-100" : "",
  //                         "px-4 py-2 text-sm w-full text-left flex"
  //                       )}
  //                       to={"/submissions"}
  //                     >
  //                       Submit Collection
  //                     </Link>
  //                   )}
  //                 </Menu.Item>
  //                 <Menu.Item>
  //                   {({ active }) => (
  //                     <Link
  //                       className={classNames(
  //                         "font-medium text-gray-900",
  //                         active ? "bg-gray-100" : "",
  //                         "px-4 py-2 text-sm w-full text-left flex"
  //                       )}
  //                       to={"/faq"}
  //                     >
  //                       FAQ
  //                     </Link>
  //                   )}
  //                 </Menu.Item>
  //                 {!user && (
  //                   <Menu.Item>
  //                     {({ active }) => (
  //                       <button
  //                         className={classNames(
  //                           "font-medium text-gray-900",
  //                           active ? "bg-gray-100" : "",
  //                           "px-4 py-2 text-sm w-full text-left flex"
  //                         )}
  //                         onClick={() => setDialog("register")}
  //                       >
  //                         Register
  //                       </button>
  //                     )}
  //                   </Menu.Item>
  //                 )}
  //                 {!!user && (
  //                   <Menu.Item>
  //                     {({ active }) => (
  //                       <Link
  //                         className={classNames(
  //                           "font-medium text-gray-900",
  //                           active ? "bg-gray-100" : "",
  //                           "px-4 py-2 text-sm w-full text-left flex"
  //                         )}
  //                         to={`/user/${wallet.publicKey!.toBase58()}?tab=settings`}
  //                       >
  //                         Update Profile
  //                       </Link>
  //                     )}
  //                   </Menu.Item>
  //                 )}
  //                 <Menu.Item>
  //                   {({ active }) => (
  //                     <button
  //                       className={classNames(
  //                         "font-medium text-gray-900",
  //                         active ? "bg-gray-100" : "",
  //                         "px-4 py-2 text-sm w-full text-left flex"
  //                       )}
  //                       onClick={() => {
  //                         wallet?.disconnect();
  //                         store.dispatch?.({
  //                           type: "SetUser",
  //                           user: undefined,
  //                         });
  //                         store.dispatch?.({
  //                           type: "SetHasUser",
  //                           hasUser: "unknown",
  //                         });
  //                       }}
  //                     >
  //                       Disconnect
  //                     </button>
  //                   )}
  //                 </Menu.Item>
  //               </div>
  //             </Menu.Items>
  //           </Transition>
  //           <ThemeButton />
  //         </div>
  //       </Menu>
  //       <DontMissTheOffersDialog
  //         isOpen={dialog === "dontMissTheOffers"}
  //         onApprove={() => setDialog("register")}
  //         onClose={() => setDialog("none")}
  //       />
  //       <RegisterDialog
  //         publicKey={wallet.publicKey?.toString() || ""}
  //         user={user}
  //         isOpen={dialog === "register"}
  //         mode={"register"}
  //         onClose={() => setDialog("none")}
  //         onRegistered={(user) => {
  //           store.dispatch?.({ type: "SetUser", user });
  //           store.dispatch?.({ type: "SetHasUser", hasUser: "yes" });
  //           setDialog("none");
  //         }}
  //       />
  //     </>
  //   );
  // }
  return (
    <div className="relative inline-block text-left">
      <div className="flex flex-row items-center">
        <ThemeButton />
        {/* <Link
          to="/faq"
          className="justify-center text-sm font-medium text-gray-700 hover:text-gray-900 mr-2 hidden sm:inline-flex"
        >
          FAQ
        </Link> */}
        <button
          // onClick={() => walletModal.setVisible(true)}
          className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 w-5 h-5 mx-6"
        >
          {darkMode ? (
            <img src="/icons/white-wallet.svg" alt="" className="w-5 h-5" />
          ) : (
            <img src="/icons/black-wallet.svg" alt="" className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export const ThemeButton = ({ ...props }) => {
  const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    const shouldBeDark = localStorage.getItem("alphaDarkMode") === "true";
    const isCurrentDark = document.documentElement.classList.contains("dark");
    if (shouldBeDark !== isCurrentDark) {
      nightwind.toggle();
    }
    setDarkMode(shouldBeDark);
  }, []);

  const onClick = () => {
    nightwind.toggle();
    window.localStorage.setItem("alphaDarkMode", `${!darkMode}`);
    SetStateDarkMode(!darkMode);
    setDarkMode(!darkMode);
  };

  return (
    <span
      className="flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 mx-0 lg:mx-2"
      onClick={onClick}
    >
      {darkMode ? (
        <img
          src="/icons/white-moon.svg"
          alt="light-mode"
          className="w-6 h-6 cursor-pointer"
        />
      ) : (
        <img
          src="/icons/black-moon.svg"
          alt="dark-mode"
          className="w-6 h-6 cursor-pointer"
        />
      )}
    </span>
  );
};
