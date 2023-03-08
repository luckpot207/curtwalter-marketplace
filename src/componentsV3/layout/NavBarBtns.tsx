
import classNames from "classnames";
// import {useStore} from "../../lib/store";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaWallet, FaSun, FaMoon } from "react-icons/fa";
import { CConnectBtn } from "../buttons/ConnectBtn"
import { ThemeButton } from "../buttons/ThemeBtn";

export function NavBarBtns() {
    // const {
    //   headerSearchOnMobileShow
    // } = useStore()

    return (
        <div className='h-full flex items-center'>
            <ThemeButton />
            <CConnectBtn />
        </div>
    )
}