import {GroupBase, MenuListProps} from "react-select/dist/declarations/src";

export default function MenuList<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(props: MenuListProps<Option, IsMulti, Group>) {
  const { children, innerProps, innerRef } = props;
  return (
    <div
      className={"z-50 bg-gray-100 dark:bg-zinc-800 max-h-96 overflow-scroll"}
      ref={innerRef}
      {...innerProps}
    >
      {children}
    </div>
  );
};