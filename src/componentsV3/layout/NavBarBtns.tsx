
import classNames from "classnames";
// import {useStore} from "../../lib/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaWallet, FaSun, FaMoon } from "react-icons/fa";
import { CConnectBtn } from "../buttons/ConnectBtn"

export function NavBarBtns() {
  // const {
  //   headerSearchOnMobileShow
  // } = useStore()

  return (
    <div className='h-full flex items-center'>
      <button
        className="flex items-center h-full text-gray-700 mr-5 pb-1"
        // onClick={}
      >
        {
          false ? <FaMoon className="h-6 w-6" /> : <FaSun className="h-6 w-6" />
        }
      </button>
      <CConnectBtn />
    </div>
  )
}