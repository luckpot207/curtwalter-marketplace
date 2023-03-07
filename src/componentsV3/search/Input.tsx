import { InputProps } from "react-select/dist/declarations/src";
import classNames from "classnames";
import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";


export default function Input(props: InputProps<any>) {
  const { innerRef, value, onFocus, onBlur } = props;
  const [focused, setFocused] = useState<boolean>(false);


  const onFocusHandler = (e: any) => {
    setFocused(true)
    const caller = onFocus as any
    caller(e)
  }

  const onBlurHandler = (e: any) => {
    setFocused(false)

    const caller = onBlur as any
    caller(e)
  }

  return (
    <div className={classNames({
      'flex': true,
      'text-gray-500 dark:text-gray-400': !focused,
      'text-black dark:text-white': focused,
    })}>
      <div className="inset-y-0 left-0 pl-3 flex items-center">
        <FiSearch
          className="w-6 h-6 text-gray-700"
          aria-hidden="true"
        />
      </div>
      <input
        ref={innerRef}
        onChange={props.onChange}
        id="search1"
        name="search1"
        className={classNames({
          "block w-full pl-3 py-2 rounded-md leading-5 focus:outline-none bg-transparent text-md placeholder-gray-500 dark:placeholder-gray-400": true,
          // 'ml-5 text-lg': headerSearchOnMobileShow
        })}
        placeholder={"Search"}
        autoComplete="off"
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        value={value}
      // autoFocus={headerSearchFocus}
      />
      {value && (
        <div
          className="absolute right-3 h-full flex top-0 items-center"
          onClick={() => props.onChange}
        >
          <FiX className="text-black w-5 h-5 cursor-pointer dark:text-white" />
        </div>
      )}
    </div>
  );
}