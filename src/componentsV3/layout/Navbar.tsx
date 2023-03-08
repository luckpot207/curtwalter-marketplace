import { NavbarBrand } from "./NavbarBrand";
import { NavbarSearch } from "./NavbarSearch";
import { NavBarBtns } from "./NavBarBtns";
import { NavbarLinks } from "./NavbarLinks";

export function Navbar() {
  return (
    <nav className="flex items-center h-full pr-5 ">
      <NavbarBrand />
      <NavbarSearch />
      {/* <NavBarBtns/> */}
      <NavbarLinks />
    </nav>
  );
}
