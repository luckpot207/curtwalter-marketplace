import {PropsWithChildren} from "react";
import classNames from "classnames";

export function NavbarLink({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={classNames('px-4', className)}>
      { children }
    </div>
  )
}