import { NavbarBrand } from "./NavbarBrand";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarLinks } from "./NavbarLinks";

export function Navbar() {
  return (
    <nav className="flex items-center h-full pr-5 ">
      <NavbarBrand />
      <NavbarSearch />
      <NavbarLinks />
    </nav>
  );
}
