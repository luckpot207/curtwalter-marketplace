import { NavbarBrand } from "./NavbarBrand";
import { NavbarSearch } from "./NavbarSearch";
// import {NavbarLinks} from "./NavbarLinks";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return (
    <nav className="flex h-full">
      <NavbarBrand />
      <NavbarSearch />
      <ConnectButton label="Connect" />
      {/* <NavbarLinks/> */}
    </nav>
  );
}
