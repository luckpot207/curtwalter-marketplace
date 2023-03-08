import { Navbar } from "./Navbar";
import { Backdrop } from "./Backdrop";
import { WalletMenu } from "./WalletMenu";
// import {MobileMenu} from "./MobileMenu";
import { Sidebar } from "./Sidebar";

export function Header() {
  return (
    <>
      <header className="fixed z-50 w-full h-16 max-h-16 shadow-lg backdrop-filter backdrop-saturate-50 backdrop-blur-lg text-md dark:bg-zinc-800">
        <Navbar />
      </header>
      <Sidebar />
      {/* <Backdrop /> */}
      {/* <WalletMenu /> */}
      {/*<MobileMenu/> */}
    </>
  );
}
