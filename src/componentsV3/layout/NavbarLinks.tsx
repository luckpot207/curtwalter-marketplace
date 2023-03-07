import { NavbarLink } from "./NavbarLink";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "../../lib/flowbite-react";
import { useTheme } from "../../lib/next-themes";
import { NavLink } from "react-router-dom";
import { useStore } from "../../lib/store";
// import {useWallet} from "@solana/wallet-adapter-react";
import { theme } from "@cloudinary/url-gen/actions/effect";

export function NavbarLinks() {
  const { theme, setTheme } = useTheme()
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
    setHeaderSearchFocus
  } = useStore()

  return (
    <div className='h-full flex items-center justify-end'>

      {/* Explore */}
      {!headerSearchOnMobileShow && (
        <NavbarLink className='hidden lg:block'>
          <NavLink
            to='/explore'
            onClick={(e) => {
              setHeaderWalletMenuShow(false)
              setHeaderMobileMenuShow(false)
              setHeaderBackDropShow(false)
            }}
            className='h-6 hover:text-black dark:hover:text-white'>
            Explore
          </NavLink>
        </NavbarLink>
      )}

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
      {!headerSearchOnMobileShow && (
        <NavbarLink className='hidden lg:block'>
          <a rel='noreferrer'
            href='https://blog.alpha.art'
            target='_blank'
            className='h-6 hover:text-black dark:hover:text-white'>
            Blog
          </a>
        </NavbarLink>
      )}

      {/* Dark Theme */}
      {theme === 'light' && !headerSearchOnMobileShow && (
        <NavbarLink className='hidden md:block'>
          <a href='#'
            onClick={(e) => {
              e.preventDefault()
              setTheme('dark')
            }}
            title='Dark Theme' className='hover:text-black dark:hover:text-white'>
            <FontAwesomeIcon icon={['fas', 'moon']} className='h-6' />
          </a>
        </NavbarLink>
      )}

      {/* Light Theme */}
      {theme === 'dark' && !headerSearchOnMobileShow && (
        <NavbarLink className='hidden md:block'>
          <a href='#'
            onClick={(e) => {
              e.preventDefault()
              setTheme('light')
            }}
            title='Light Theme' className='hover:text-black dark:hover:text-white'>
            <FontAwesomeIcon icon={['fas', 'sun']} className='h-6' />
          </a>
        </NavbarLink>
      )}

      {/* Connected Account */}
      {/* { wallet?.adapter.connected && !headerSearchOnMobileShow && (
        <NavbarLink className='hidden md:block'>
          <NavLink
            to={`/user/${wallet?.adapter.publicKey?.toBase58()}`}
            onClick={(e) => {
              setHeaderWalletMenuShow(false)
              setHeaderMobileMenuShow(false)
              setHeaderBackDropShow(false)
            }}
            className='hover:text-black dark:hover:text-white'>
            <Avatar rounded={true} status='online' size='xs' />
          </NavLink>
        </NavbarLink>
      )} */}

      {/* Disconnected Account */}
      {/*{ !wallet?.adapter.connected && (
        <NavbarLink>
          <a href='#' title='Account' className='hover:text-black dark:hover:text-white'>
            <FontAwesomeIcon icon={['fas', 'user-circle']} className='h-6'/>
          </a>
        </NavbarLink>
      )}*/}

      {/* Logout */}
      {/* { wallet?.adapter.connected && !headerSearchOnMobileShow && (
        <NavbarLink className='hidden md:block'>
          <a href='#'
             onClick={(e) => {
               e.preventDefault()
               select(null!)
             }}
             title='Logout'
             className='hover:text-black dark:hover:text-white'>
            <FontAwesomeIcon icon={['fas', 'arrow-right-from-bracket']} className='h-6'/>
          </a>
        </NavbarLink>
      )} */}


      {/* Wallet Menu */}
      {!headerSearchOnMobileShow && (
        <NavbarLink className='hidden md:block'>
          <a href='#'
            onClick={(e) => {
              e.preventDefault()
              if (!headerMobileMenuShow) {
                setHeaderBackDropShow(!headerBackDropShow)
              }
              setHeaderWalletMenuShow(!headerWalletMenuShow)
            }}
            title='Wallet'
            className='hover:text-black dark:hover:text-white'>
            <FontAwesomeIcon icon={['fas', 'wallet']} className='h-6' />
          </a>
        </NavbarLink>
      )}

      {/* Search */}
      {!headerSearchOnMobileShow && (
        <NavbarLink className='sm:hidden'>
          <a href='#'
            onClick={(e) => {
              e.preventDefault()
              setHeaderSearchFocus(true)
              setHeaderSearchOnMobileShow(true)
              setHeaderWalletMenuShow(false)
              setHeaderMobileMenuShow(false)
              setHeaderBackDropShow(false)
            }}
            title='Search'
            className='hover:text-black dark:hover:text-white'>
            <FontAwesomeIcon icon={['fas', 'search']} className='h-6' />
          </a>
        </NavbarLink>
      )}

      {/* Mobile Menu */}
      {!headerMobileMenuShow && !headerSearchOnMobileShow && (
        <NavbarLink className='lg:hidden'>
          <a href='#'
            onClick={(e) => {
              e.preventDefault()
              setHeaderMobileMenuShow(true)
              setHeaderBackDropShow(true)
            }}
            title='Menu'
            className='hover:text-black dark:hover:text-white'>
            <FontAwesomeIcon icon={['fas', 'bars']} className='h-6' />
          </a>
        </NavbarLink>
      )}

      {/* Close Mobile Menu */}
      {headerMobileMenuShow && !headerSearchOnMobileShow && (
        <NavbarLink className='lg:hidden'>
          <a href='#'
            onClick={(e) => {
              e.preventDefault()
              setHeaderMobileMenuShow(false)
              setHeaderBackDropShow(false)
            }}
            title='Close'
            className='hover:text-black dark:hover:text-white'>
            <FontAwesomeIcon icon={['fas', 'xmark-large']} className='h-6' />
          </a>
        </NavbarLink>
      )}
    </div>
  )
}