import classNames from "classnames";
import {useStore} from "../../lib/store";

export function Backdrop() {
  const {
    headerBackDropShow,
    setHeaderBackDropShow,
    setHeaderMobileMenuShow,
    setHeaderWalletMenuShow
  } = useStore()

  return (
    <div style={{ transition: 'width 0.35s' }}
         onClick={(e) => {
           e.preventDefault()
           if (headerBackDropShow) {
             setHeaderBackDropShow(false)
             setHeaderMobileMenuShow(false)
             setHeaderWalletMenuShow(false)
           }
         }}
         className={classNames({
           'fixed left-0 mt-16 inset-0': true,
           'bg-transparent z-0 h-0': !headerBackDropShow,
           'bg-gray-900 dark:bg-gray-900 bg-opacity-20 dark:bg-opacity-80 z-20 h-full': headerBackDropShow
         })}>
    </div>
  )
}