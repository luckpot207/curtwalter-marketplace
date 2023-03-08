import { NavLink } from "react-router-dom";
import {
  BiMoon,
  BiSun,
  BiLogOut,
  BiUserCircle,
  BiWallet,
  BiSearch,
  BiBattery,
  BiMask,
} from "react-icons/bi";
import { Avatar } from "../../lib/flowbite-react";
import { NavbarLink } from "./NavbarLink";
import { useTheme } from "../../themes";
import { useStore } from "../../lib/store";
import { useAccount } from "wagmi";
import { useWeb3React } from "@web3-react/core";

export function NavbarLinks() {
  const { theme, setTheme } = useTheme();
  const { address, isConnected, isDisconnected } = useAccount();
  const { deactivate, account } = useWeb3React();

  // const {wallet, select} = useWallet();
  const {
    headerWalletMenuShow,
    setHeaderWalletMenuShow,
    headerMobileMenuShow,
    setHeaderMobileMenuShow,
    setHeaderBackDropShow,
    headerBackDropShow,
    headerSearchOnMobileShow,
    setHeaderSearchOnMobileShow,
    setHeaderSearchFocus,
  } = useStore();

  return (
    <div className="h-full flex items-center justify-end">
      {/* Explore */}
      {/* {!headerSearchOnMobileShow && (
        <NavbarLink className="hidden lg:block">
          <NavLink
            to="/explore"
            onClick={(e) => {
              setHeaderWalletMenuShow(false);
              setHeaderMobileMenuShow(false);
              setHeaderBackDropShow(false);
            }}
            className="h-6 hover:text-black dark:hover:text-white"
          >
            Explore
          </NavLink>
        </NavbarLink>
      )} */}

      {/* Creators */}
      {/*{ !headerSearchOnMobileShow && (
        <NavbarLink className='hidden lg:block'>
          <NavLink
            to='/submissions'
            onClick={(e) => {
              setHeaderWalletMenuShow(false)
              setHeaderMobileMenuShow(false)
              setHeaderBackDropShow(false)
            }}
            className='h-6 hover:text-black dark:hover:text-white'>
            Creators
          </NavLink>
        </NavbarLink>
      )}*/}

      {/* Blog */}
      {/* {!headerSearchOnMobileShow && (
        <NavbarLink className="hidden lg:block">
          <a
            rel="noreferrer"
            href="https://blog.alpha.art"
            target="_blank"
            className="h-6 hover:text-black dark:hover:text-white"
          >
            Blog
          </a>
        </NavbarLink>
      )} */}

      {/* Dark Theme */}
      {theme === "light" && !headerSearchOnMobileShow && (
        <NavbarLink className="hidden md:block">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setTheme("dark");
            }}
            title="Dark Theme"
            className="hover:text-black dark:hover:text-white"
          >
            <BiMoon />
          </a>
        </NavbarLink>
      )}

      {/* Light Theme */}
      {theme === "dark" && !headerSearchOnMobileShow && (
        <NavbarLink className="hidden md:block">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setTheme("light");
            }}
            title="Light Theme"
            className="hover:text-black dark:hover:text-white"
          >
            <BiSun />
          </a>
        </NavbarLink>
      )}

      {/* Connected Account */}
      {account && !headerSearchOnMobileShow && (
        <NavbarLink className="hidden md:block">
          <NavLink
            to={`/user/${address}`}
            onClick={(e) => {
              setHeaderWalletMenuShow(false);
              setHeaderMobileMenuShow(false);
              setHeaderBackDropShow(false);
            }}
            className="hover:text-black dark:hover:text-white"
          >
            <Avatar rounded={true} status="online" size="xs" />
          </NavLink>
        </NavbarLink>
      )}

      {/* Logout */}
      {!account && !headerSearchOnMobileShow && (
        <NavbarLink className="hidden md:block">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              deactivate();
              //  select(null!)
            }}
            title="Logout"
            className="hover:text-black dark:hover:text-white"
          >
            <BiLogOut />
          </a>
        </NavbarLink>
      )}

      {/* Wallet Menu */}
      {!headerSearchOnMobileShow && (
        <NavbarLink className="hidden md:block">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (!headerMobileMenuShow) {
                setHeaderBackDropShow(!headerBackDropShow);
              }
              setHeaderWalletMenuShow(!headerWalletMenuShow);
            }}
            title="Wallet"
            className="hover:text-black dark:hover:text-white"
          >
            <BiWallet />
          </a>
        </NavbarLink>
      )}

      {/* Search */}
      {!headerSearchOnMobileShow && (
        <NavbarLink className="sm:hidden">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setHeaderSearchFocus(true);
              setHeaderSearchOnMobileShow(true);
              setHeaderWalletMenuShow(false);
              setHeaderMobileMenuShow(false);
              setHeaderBackDropShow(false);
            }}
            title="Search"
            className="hover:text-black dark:hover:text-white"
          >
            <BiSearch />
          </a>
        </NavbarLink>
      )}

      {/* Mobile Menu */}
      {!headerMobileMenuShow && !headerSearchOnMobileShow && (
        <NavbarLink className="lg:hidden">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setHeaderMobileMenuShow(true);
              setHeaderBackDropShow(true);
            }}
            title="Menu"
            className="hover:text-black dark:hover:text-white"
          >
            <BiBattery />
          </a>
        </NavbarLink>
      )}

      {/* Close Mobile Menu */}
      {headerMobileMenuShow && !headerSearchOnMobileShow && (
        <NavbarLink className="lg:hidden">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setHeaderMobileMenuShow(false);
              setHeaderBackDropShow(false);
            }}
            title="Close"
            className="hover:text-black dark:hover:text-white"
          >
            <BiMask />
          </a>
        </NavbarLink>
      )}
    </div>
  );
}
