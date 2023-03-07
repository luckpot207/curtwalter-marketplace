import { BiX as XIcon } from "react-icons/bi";
import { Link } from "react-router-dom";
import { ThemeButton } from "./connect";

export default function MobileMenu(props: any) {
  // const walletModal = useWalletModal();

  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 bg-white dark:bg-darkgray text-black z-60">
      <div className="flex flex-col justify-end items-end">
        <div className="w-full flex items-center justify-end mb-9">
          <button
            type="button"
            className="mt-6 mr-8"
            onClick={() => props.closeMenu()}
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="w-1/3 flex flex-col items-end mr-10 gap-7 mt-7">
          <button
            onClick={() => {
              // walletModal.setVisible(true);
              props.closeMenu();
            }}
          >
            Connect wallet
          </button>

          <button className="text-sm" onClick={() => props.closeMenu()}>
            <Link to="/explore" className="inline-block text-center rounded-md">
              Explore
            </Link>
          </button>

          <button className="text-sm" onClick={() => props.closeMenu()}>
            <Link to="/submissions" className="inline-block text-center rounded-md">
              Create
            </Link>
          </button>

          {/* <button className="text-sm">P2P Trading</button>
          <button className="text-sm">Governance</button> */}
          <button className="text-sm">Blog</button>
          <ThemeButton />
        </div>
      </div>
    </div>
  );
}
