import {useMemo, useState} from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import Input from "./Input";
import Control from "./Control";
import MenuList from "./MenuList";
import Option from "./Option";
// import {search} from "../../services/search";
import ValueContainer from "./ValueContainer";
import {useNavigate} from "react-router-dom";

export default function Search() {
  const [input, setInput] = useState("");
  const navigate = useNavigate()

  const loadOptions = (inputValue: string, callback: (options: any[]) => void) => {
    // search(inputValue).then((r: { data: any[]; }) => {
    //   callback(r.data.map((r) => ({ label: r.title, value: r.slug, image: r.thumbnail })));
    // });
  };

  const handleInputChange = (newValue: string) => {
    const inputValue = newValue;
    setInput(inputValue);
    return inputValue;
  };

  const debouncedSearch = useMemo(() => debounce(loadOptions, 300), []);

  return (
    <div className={`w-full`}>
      <div className="relative">
        <AsyncSelect
          inputValue={input}
          loadOptions={debouncedSearch}
          isOptionSelected={() => false}
          onInputChange={handleInputChange}
          onChange={(value: any) => {
            setInput("");
            navigate("/collection/" + value.value)
              // .catch(console.error);
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
          instanceId='collection-search'
          components={{
            ValueContainer,
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