import { useState } from "react";

import { Link } from "react-router-dom";
import WalletConnect from "./connect";
import { BiMenu as MenuIcon, BiSearch as SearchIcon } from "react-icons/bi";
import CollectionSearch from "./CollectionSearch";
import { SearchModal } from "./SearchModal";
import { useWindowSize } from "../utils/useWindowSize";
import { useSelector } from "../api/store";
import { TokenInfo } from "../data/custom";

export default function Header(props: {
  setIsMenuOpen?: any;
  isMenuOpen?: any;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const windowSize = useWindowSize();
  const nft: TokenInfo | undefined = useSelector((data) => data.nft);

  return (
    <header className="fixed w-full h-16 max-h-16 z-50 shadow-lg backdrop-filter backdrop-saturate-50 backdrop-blur-lg header-background text-black dark:bg-darkgray">
      <nav aria-label="Top">
        <div className="h-16 flex items-center">
          {/* Logo */}
          <div className="ml-4 flex items-center">
            <span className="sr-only">AlphaArt Market</span>
            <Link to='/'>
              <span className="sr-only">AlphaArt Market</span>
              <img
                id="alphaLogo"
                className="h-9 w-auto"
                src="/icon-root.svg"
                alt=""
              />
            </Link>
          </div>

          {/* Mobile and tablet will open searchinput on click of search icon, desktop will open it defaultly */}
          {((windowSize.width && windowSize.width > 1024) || searchOpen) && (
            <div className="flex-1 items-center justify-start px-2 sm:ml-4 lg:ml-6 lg:justify-start  ">
              <CollectionSearch />
            </div>
          )}

          {/* Flyout menus */}
          <div className="ml-auto flex items-center">
            <div className="flex flex-1 items-center justify-end gap-x-3 md:gap-x-5 lg:gap-x-8 mt-1 mr-7 sm:mt-0 sm:mr-0">
              {windowSize.width && windowSize.width > 640 && (
                <>
                  <button className="p-2hover:text-gray-500 text-sm">
                    <Link
                      to="/explore"
                      className="inline-block text-center rounded-md"
                    >
                      Explore
                    </Link>
                  </button>

                  <button className="p-2hover:text-gray-500 text-sm">
                    <Link
                      to="/submissions"
                      className="inline-block text-center rounded-md"
                    >
                      Creators
                    </Link>
                  </button>

                  {/* Removed temporarily as requested */}
                  {/* <button className="p-2 hover:text-gray-500 text-sm">
                    P2P Trading
                  </button> */}
                  {/* <button className="p-2 hover:text-gray-500 text-sm">
                    <Link
                      to="/governance"
                      className="inline-block text-center rounded-md"
                    >
                      Governance
                    </Link>
                  </button> */}
                  <a
                    href="https://blog.alpha.art/"
                    target="_blank"
                    className="p-2hover:text-gray-500 text-sm"
                  >
                    Blog
                  </a>
                </>
              )}

              {!searchOpen && (
                <button
                  type="button"
                  className="p-2 -m-2 text-gray-400 hover:text-gray-500 lg:hidden"
                  onClick={() => setSearchOpen(true)}
                >
                  <SearchIcon
                    className="w-6 h-6 text-gray-700"
                    aria-hidden="true"
                  />
                </button>
              )}

              {windowSize.width && windowSize.width > 640 ? (
                <WalletConnect />
              ) : (
                <button type="button" onClick={() => props.setIsMenuOpen(true)}>
                  <MenuIcon className="w-6 h-6" />
                </button>
              )}

              <span
                className="h-6 w-px bg-gray-200 hidden sm:flex"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
