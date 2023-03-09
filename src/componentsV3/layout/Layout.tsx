import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
// import {far} from '@fortawesome/pro-regular-svg-icons';
// import {fas} from '@fortawesome/pro-solid-svg-icons';
// import {fab} from '@fortawesome/free-brands-svg-icons';
// import {library} from "@fortawesome/fontawesome-svg-core";
// import {useStore} from "../../lib/store";

// library.add(far, fas, fab)

export function Layout({
  footer,
  children,
  disableFlex,
}: PropsWithChildren<{ footer?: boolean; disableFlex?: boolean }>) {
  // const {
  //   setCollectionTrendingGridIntervalDropdownOpen
  // } = useStore()

  let flex = "flex items-center justify-center";
  if (disableFlex) {
    flex = "";
  }

  return (
    <>
      <Header />
      <main
        className={`pt-16 ${flex} ml-[54px]`}
        onClick={(e) => {
          e.preventDefault();
          // setCollectionTrendingGridIntervalDropdownOpen(false)
        }}
      >
        {children}
      </main>
      {footer && <Footer />}
    </>
  );
}
