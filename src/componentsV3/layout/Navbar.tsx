import {NavbarBrand} from "./NavbarBrand";
import {NavbarSearch} from "./NavbarSearch";
import {NavbarLinks} from "./NavbarLinks";

export function Navbar() {
  return (
    <nav className='flex h-full'>
      <NavbarBrand/>
      <NavbarSearch/>
      <NavbarLinks/>
    </nav>
  )
}