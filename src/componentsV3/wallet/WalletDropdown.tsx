import classNames from "classnames";
import WalletStore from "./WalletStore";
// import { ReactComponent as ChevronUp } from "../svg/chevron-up.svg";
import { useDisconnect } from "wagmi";

declare var window: any;

export default function WalletDropdown() {
  const { disconnect } = useDisconnect();

  const setActive = WalletStore((s) => s.setDropdownActive);

  const active = WalletStore((s) => s.dropdownActive);
  const address = WalletStore((s) => s.address);

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div
      className={classNames("wallet-dropdown-wrap", { active })}
      onClick={() => setActive(false)}
    >
      <div className="wallet-dropdown-overlay"></div>
      <div className="wallet-dropdown" onClick={(e) => e.stopPropagation()}>
        <button
          className="wallet-dropdown-button uppercase"
          onClick={(e) => {
            e.stopPropagation();
            setActive(!active);
          }}
        >
          logo
          {/* <ChevronUp /> */}
        </button>

        <div className="wallet-dropdown-dropdown">
          <span className="wallet-dropdown-wallet-link">
            <span className="wallet-dropdown-wallet-link-indicator"></span>
            <span className="wallet-dropdown-wallet-link-address">logo</span>
          </span>
          <button
            onClick={handleDisconnect}
            className="wallet-dropdown-wallet-disconnect"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
