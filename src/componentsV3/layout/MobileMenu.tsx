import { useState } from "react";
import { useTheme } from "../../themes";
import { useStore } from "../../lib/store";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "../../lib/flowbite-react";

export function MobileMenu() {
  const [mounted, setMounted] = useState(false);
  // const {wallet, select} = useWallet();
  const { theme, setTheme } = useTheme();
  const {
    headerWalletMenuShow,
    setHeaderWalletMenuShow,
    headerMobileMenuShow,
    setHeaderBackDropShow,
    headerBackDropShow,
    setHeaderMobileMenuShow,
  } = useStore();

  return (
    <div
      style={{ transition: "right 0.35s" }}
      className={classNames({
        "fixed z-30 h-full mt-16 bg-white shadow-2xl w-full md:w-[464px] dark:bg-zinc-800":
          true,
        "-right-full md:-right-[464px]": !headerMobileMenuShow,
        "right-0": headerMobileMenuShow,
      })}
    >
      <div className="flex h-screen flex-col">
        <div className="w-full px-5">
          <ul className="pt-5">
            {/* Explore */}
            <li className="py-5">
              <NavLink
                to="/explore"
                onClick={(e) => {
                  setHeaderWalletMenuShow(false);
                  setHeaderMobileMenuShow(false);
                  setHeaderBackDropShow(false);
                }}
                className="flex w-full items-center hover:text-black dark:hover:text-white"
              >
                <FontAwesomeIcon
                  icon={["fas", "compass"]}
                  className="block h-6 mr-4"
                />
                <span>Explore</span>
              </NavLink>
            </li>

            {/* Creators */}
            {/*<li className="py-5">
              <NavLink to="/submissions" className='flex w-full items-center hover:text-black dark:hover:text-white'>
                <FontAwesomeIcon icon={['fas', 'arrow-up-from-bracket']} className='block h-6 mr-4'/>
                <span>
                  Creators
                </span>
              </NavLink>
            </li>*/}

            {/* Blog */}
            <li className="py-5">
              <a
                rel="noreferrer"
                href="https://blog.alpha.art"
                target="_blank"
                className="flex w-full items-center hover:text-black dark:hover:text-white"
              >
                <FontAwesomeIcon
                  icon={["fas", "blog"]}
                  className="block h-6 mr-4"
                />
                <span>Blog</span>
              </a>
            </li>

            {/* Dark Theme */}
            {theme === "light" && (
              <li className="py-5">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setTheme("dark");
                    setHeaderWalletMenuShow(false);
                    setHeaderMobileMenuShow(false);
                    setHeaderBackDropShow(false);
                  }}
                  title="Dark Theme"
                  className="flex w-full items-center hover:text-black dark:hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={["fas", "moon"]}
                    className="block h-6 mr-4"
                  />
                  <span>Dark Theme</span>
                </a>
              </li>
            )}

            {/* Light Theme */}
            {theme === "dark" && (
              <li className="py-5">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setTheme("light");
                    setHeaderWalletMenuShow(false);
                    setHeaderMobileMenuShow(false);
                    setHeaderBackDropShow(false);
                  }}
                  title="Light Theme"
                  className="flex w-full items-center hover:text-black dark:hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={["fas", "sun"]}
                    className="block h-6 mr-4"
                  />
                  <span>Light Theme</span>
                </a>
              </li>
            )}

            {/* Connected Account */}
            {/* { wallet?.adapter.connected && (
              <li className="py-5">
                <NavLink to={`/user/${wallet?.adapter.publicKey?.toBase58()}`}
                   onClick={(e) => {
                     setHeaderWalletMenuShow(false)
                     setHeaderMobileMenuShow(false)
                     setHeaderBackDropShow(false)
                   }}
                   title='Account'
                   className='flex w-full items-center hover:text-black dark:hover:text-white'>
                  <Avatar rounded={true} status='online' size='xs' />
                    <span className='ml-4'>
                    Profile
                  </span>
                </NavLink>
              </li>
            )} */}

            {/* Wallet Menu */}
            <li className="py-5">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setHeaderWalletMenuShow(true);
                }}
                title="Wallet"
                className="flex w-full items-center hover:text-black dark:hover:text-white"
              >
                <FontAwesomeIcon
                  icon={["fas", "wallet"]}
                  className="block h-6 mr-4"
                />
                <span>Wallet</span>
              </a>
            </li>

            {/* Logout */}
            {/* { wallet?.adapter.connected && (
              <li className="py-5">
                <a href='#'
                   onClick={(e) => {
                     e.preventDefault()
                     select(null!)
                     setHeaderWalletMenuShow(false)
                     setHeaderMobileMenuShow(false)
                     setHeaderBackDropShow(false)
                   }}
                   title='Logout'
                   className='flex w-full items-center hover:text-black dark:hover:text-white'>
                  <FontAwesomeIcon icon={['fas', 'arrow-right-from-bracket']} className='block h-6 mr-4'/>
                  <span>
                    Logout
                  </span>
                </a>
              </li>
            )} */}
          </ul>
        </div>
      </div>
    </div>
  );
}
