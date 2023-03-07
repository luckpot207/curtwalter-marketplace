import { NavbarBrand } from "./NavbarBrand";
import { NavbarSearch } from "./NavbarSearch";
import { Button } from "react-rainbow-components";
// import {NavbarLinks} from "./NavbarLinks";

export function Navbar() {
  return (
    <nav className="flex h-full">
      <NavbarBrand />
      <NavbarSearch />
      <Button />
      {/* <NavbarLinks/> */}
    </nav>
  );
}
