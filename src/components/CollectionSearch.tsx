import { useNavigate } from "react-router-dom";
import { BiSearch as SearchIcon, BiX as XIcon } from "react-icons/bi";
import { searchCollection } from "../api/api";
import { useMemo, useState } from "react";
import debounce from "lodash/debounce";
import {
  ControlProps,
  GroupBase,
  InputProps,
  MenuListProps,
  OptionProps,
} from "react-select/dist/declarations/src";
import { classNames } from "../utils/clsx";
import { Image } from "./NFTSearch";
import AsyncSelect from "react-select/async";

export default function CollectionSearch({
  onClose,
}: {
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const loadOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    searchCollection(inputValue).then((r) => {
      callback(r.map((r) => ({ label: r.title, value: r.id, image: r.image })));
    });
  };

  const handleInputChange = (newValue: string) => {
    const inputValue = newValue;
    setInput(inputValue);
    return inputValue;
  };

  const debouncedSearch = useMemo(() => debounce(loadOptions, 300), []);

  return (
    <div className="w-full max-w-lg">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-800" aria-hidden="true" />
        </div>
        <AsyncSelect
          inputValue={input}
          loadOptions={debouncedSearch}
          isOptionSelected={() => false}
          onInputChange={handleInputChange}
          onChange={(value: any) => {
            setInput("");
            navigate("/collection/" + value.value);
            onClose?.();
          }}
          noOptionsMessage={(s) =>
            s.inputValue ? (
              <span>
                {s.inputValue ? `No result for ${s.inputValue}` : null}
              </span>
            ) : null
          }
          tabSelectsValue={false}
          defaultOptions={false}
          controlShouldRenderValue={true}
          components={{
            Input,
            Placeholder: () => null,
            ClearIndicator: () => null,
            SingleValue: () => null,
            Option,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
            MenuList,
            Control,
          }}
        />
      </div>
    </div>
  );
}

const Control = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: ControlProps<Option, IsMulti, Group>
) => {
  const { children, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      className="bg-white border border-gray-300 dark:border-white rounded-md flex"
      {...innerProps}
    >
      {children}
    </div>
  );
};

export const MenuList = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: MenuListProps<Option, IsMulti, Group>
) => {
  const { children, innerProps, innerRef } = props;
  return (
    <div
      className={"z-50 bg-white max-h-96 overflow-scroll"}
      ref={innerRef}
      {...innerProps}
    >
      {children}
    </div>
  );
};

const Input = (props: InputProps<any>) => {
  const { className, innerRef, value, onFocus, onBlur } = props;

  return (
    <div>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-800" aria-hidden="true" />
      </div>
      <input
        ref={innerRef}
        onChange={props.onChange}
        id="search1"
        name="search1"
        className="block w-full pl-8 sm:pl-10 py-2 rounded-md leading-5 focus:outline-none focus:placeholder-gray-400 bg-white sm:text-sm text-black placeholder-black dark:placeholder-white"
        placeholder={"Search Collections"}
        autoComplete="off"
        onFocus={onFocus}
        onBlur={onBlur}
        value={value}
      />
      {value && (
        <div
          className="absolute right-3 h-full flex top-0 items-center"
          onClick={() => props.onChange}
        >
          <XIcon className="text-black w-5 h-5 dark:text-paperwhite" />
        </div>
      )}
    </div>
  );
};

const Option = (props: OptionProps<any>) => {
  const { isFocused, innerRef, innerProps, data } = props;
  return (
    <div
      ref={innerRef}
      //style={getStyles("option", props)}
      className={classNames(
        "flex items-center m-1 rounded-md focus:bg-indigo-500 focus:text-white",
        isFocused
          ? "bg-indigo-500 text-white dark:text-white"
          : "dark:text-white"
      )}
      {...innerProps}
    >
      <Image src={data.image} />
      <span className="ml-1 flex-1">{data.label}</span>
    </div>
  );
};
