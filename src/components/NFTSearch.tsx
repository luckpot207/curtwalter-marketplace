/* This example requires Tailwind CSS v2.0+ */
import { useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import AsyncSelect from "react-select/async";
import {
  ControlProps,
  GroupBase,
  InputProps,
  MenuListProps,
  OptionProps,
} from "react-select/dist/declarations/src";
// import { searchToken } from "../api/api";
import { classNames } from "../utils/clsx";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import MoonkeesNft from "../assets/nfts/moonkes.png";
import {Entity} from "../api/api";

const searchTokenRes = {
  id: '1',
  title: 'my entitiy',
  image: MoonkeesNft
}


export function Image(props: { src: string; alt?: string }) {
  const searchTokenReses: Entity[] =[];

  for (let index = 0; index < 10; index++) {
    searchTokenRes.id = String(index);
    searchTokenReses.push(searchTokenRes);
  }

  //https://assets.alpha.art/opt/c/d/cd5215107005896ce88e2b0cc3ce3b9b9340250b/original.png
  if (props.src && props.src.startsWith("https://assets.alpha.art/opt/")) {
    const pp = props.src.split("/");
    const parts = pp.slice(0, pp.length - 1);
    return (
      <div className="rounded-lg w-20 h-20 group-hover:opacity-60 overflow-hidden">
        <picture className="bg-gray-100 w-full h-full">
          <source
            type="image/webp"
            srcSet={[
              [...parts, "120.webp"].join("/"),
              [...parts, "256.webp 2x"].join("/"),
            ].join(", ")}
          />
          <img
            loading="lazy"
            src={[...parts, "120.png"].join("/")}
            srcSet={[
              [...parts, "120.png"].join("/"),
              [...parts, "256.png 2x"].join("/"),
            ].join(", ")}
            width="80"
            height="80"
            alt={props.alt}
          />
        </picture>
      </div>
    );
  }
  return (
    <img
      src={props.src}
      alt={props.alt}
      width="80"
      height="80"
      className="rounded-lg w-20 h-20 bg-gray-100 group-hover:opacity-60"
    />
  );
}

export function NFTSearch({
  collectionKey,
  onClose,
}: {
  collectionKey: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const loadOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    const mapEntities = (searchTokenReses: Entity[]) => {
      callback(searchTokenReses.map((r) => ({ label: r.title, value: r.id, image: r.image })));
    };
    
    // do something with mapEntities, like calling it with some input
  };

  const handleInputChange = (newValue: string) => {
    const inputValue = newValue;
    setInput(inputValue);
    return inputValue;
  };

  const debouncedSearch = useMemo(() => debounce(loadOptions, 300), []);

  return (
    <div className="max-w-lg w-full h-full max-h-80 sm:max-h-96">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-800" aria-hidden="true" />
        </div>
        <AsyncSelect
          inputValue={input}
          loadOptions={debouncedSearch}
          isOptionSelected={() => false}
          onInputChange={handleInputChange}
          onChange={(value: any) => {
            console.log(value);
            setInput(value.label);
            navigate("/t/" + value.value);
            onClose();
          }}
          noOptionsMessage={(s) => (
            <span>
              {s.inputValue
                ? `No result for ${s.inputValue}`
                : "Type name or attribute to search"}
            </span>
          )}
          tabSelectsValue={false}
          defaultOptions={false}
          defaultInputValue={"Search NFTs in "}
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
      className="bg-white border border-gray-300 rounded-md flex"
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
  const { innerRef, value } = props;

  return (
    <div>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-800" aria-hidden="true" />
      </div>
      <input
        ref={innerRef}
        onChange={props.onChange}
        id="search1"
        name="search1"
        className="block w-full pl-10 pr-3 py-2 leading-5 bg-transparent placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm text-black"
        placeholder={"Search NFTs"}
        type="search"
        autoComplete="off"
        value={value}
      />
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
        isFocused ? "bg-indigo-500 text-white" : ""
      )}
      {...innerProps}
    >
      <Image src={data.image} />
      <span className="ml-1 ">{data.label}</span>
    </div>
  );
};
