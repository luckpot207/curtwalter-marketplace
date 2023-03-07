import {OptionProps} from "react-select/dist/declarations/src";
import classNames from "classnames";
import Image from "./Image";


export default function Option(props: OptionProps<any>) {
  const { isFocused, innerRef, innerProps, data } = props;
  return (
    <div
      ref={innerRef}
      className={classNames(
        "flex items-center m-1 rounded-md cursor-pointer",
        isFocused
          ? "bg-gray-200 text-black dark:bg-zinc-900 dark:text-white"
          : "dark:text-white"
      )}
      {...innerProps}
    >
      <Image src={data.image} />
      <span className="ml-2 flex-1">{data.label}</span>
    </div>
  );
};


