import {ControlProps, GroupBase} from "react-select/dist/declarations/src";
import classNames from "classnames";
// import {useStore} from "../../lib/store";

export default function Control<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(props: ControlProps<Option, IsMulti, Group>) {
  const { children, innerRef, innerProps, isFocused } = props;
  // const {
  //   headerSearchOnMobileShow
  // } = useStore()

  return (
    <div
      ref={innerRef}
      className={classNames({
        'flex rounded-md border border-solid': true,
        'border-gray-200 dark:border-gray-500': !isFocused,
        'border-black dark:border-white text-black dark:text-white': isFocused,
        // 'border-0': headerSearchOnMobileShow
      })}
    >
      {children}
    </div>
  );
};