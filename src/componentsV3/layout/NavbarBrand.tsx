import {AlphaArtLogo} from "../logo/AlphaArtLogo";
// import {useStore} from "../../lib/store";

export function NavbarBrand() {
  // const {
  //   headerSearchOnMobileShow,
  //   setHeaderWalletMenuShow,
  //   setHeaderMobileMenuShow,
  //   setHeaderBackDropShow,
  // } = useStore()

  // if (headerSearchOnMobileShow) return null
  return (
    <div
      // onClick={(e) => {
      //   e.preventDefault()
      //   // setHeaderWalletMenuShow(false)
      //   // setHeaderMobileMenuShow(false)
      //   // setHeaderBackDropShow(false)
      // }}
      className='h-full flex items-center justify-start px-4 pr-2'>
      <AlphaArtLogo className='h-9 w-auto'/>
    </div>
  )
}