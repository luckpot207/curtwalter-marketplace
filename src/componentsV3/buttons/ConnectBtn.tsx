import {
  ConnectButton,
  AuthenticationConfig,
  Chain,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import { FaSignOutAlt, FaUserCircle, FaWallet } from "react-icons/fa";
import { useWeb3Modal } from "@web3modal/react";
import WalletDropdown from "../wallet/WalletDropdown";
import classNames from "classnames";

export const CConnectBtn = () => {
  const { address, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const { open } = useWeb3Modal();

  return (
    <div>
      {isConnected ? (
        <div
        // className={classNames("wallet-dropdown-wrap", { active })}
        // onClick={() => setActive(false)}
        >
          <div className="wallet-dropdown-overlay"></div>
          <div className="wallet-dropdown" onClick={(e) => e.stopPropagation()}>
            <button
              className="wallet-dropdown-button uppercase"
              onClick={(e) => {
                e.stopPropagation();
                // setActive(!active);
              }}
            >
              logo
              {/* <ChevronUp /> */}
            </button>

            <div className="wallet-dropdown-dropdown">
              <span className="wallet-dropdown-wallet-link">
                <span className="wallet-dropdown-wallet-link-indicator"></span>
                <span className="wallet-dropdown-wallet-link-address">
                  logo
                </span>
              </span>
              <button
                onClick={() => disconnect()}
                className="wallet-dropdown-wallet-disconnect"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => open()} type="button">
          <FaWallet className="w-7 h-7 text-gray-700" />
        </button>
      )}
    </div>
  );
};
