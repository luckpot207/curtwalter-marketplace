import classNames from "classnames";
import { useStore } from "../../lib/store";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import WalletSelector from "../wallet/WalletSelector";
import WalletSummary from "../wallet/WalletSummary";

export function WalletMenu() {
  // const {wallet} = useWallet();
  const { headerWalletMenuShow } = useStore();

  return (
    <div
      style={{ transition: "right 0.35s" }}
      className={classNames({
        "fixed z-40 h-full mt-16 bg-white shadow-2xl w-full md:w-[464px] dark:bg-zinc-800":
          true,
        "-right-full md:-right-[464px]": !headerWalletMenuShow,
        "right-0": headerWalletMenuShow,
      })}
    >
      {/* <ConnectButton /> */}
      <WalletSelector showBackButton={true} />
      {/* { wallet?.adapter.connected
        ? (<WalletSummary showBackButton={true}/>)
        : (<WalletSelector showBackButton={true}/>)
      } */}
    </div>
  );
}
