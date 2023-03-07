import React, { useEffect, useState } from "react";
import { Disclosure, Dialog, Transition } from "@headlessui/react";
import { BiMinus as MinusSmIcon, BiPlus as PlusSmIcon, BiX as XIcon } from "react-icons/bi";
import { useSelector } from "../api/store";
import {
  addFilter,
  addOpenedSection,
  removeFilter,
  removeOpenedSection,
} from "../api/actions";
import { FilterTitles, RemoveFiltersButton } from "./filterBar";
import { TraitNumber } from "../data/marketplace.pb";
import { lamportsToSOL } from "../utils/sol";
import { Button } from "../lib/flowbite-react";

const StatusOptions = {
  key: "Status",
  type: "status" as "status" | "trait",
  values: ["BUY_NOW", "HAS_OFFERS"],
};

function FilterNumberAttributes(props: {
  name: string;
  numbers: TraitNumber[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  isChecked: (value: string) => boolean;
}) {
  return (
    <>
      {props.numbers.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            id={`filter-${props.name}-${option}`}
            name={`${props.name}[]`}
            type="checkbox"
            checked={props.isChecked(option.value!)}
            className="form-checkbox h-4 w-4 border-gray-300 rounded text-gray-600 focus:ring-gray-500 dark:text-gray-400"
            onChange={(e) => {
              if (e.target.checked) {
                props.onAdd(option.value!);
              } else {
                props.onRemove(option.value!);
              }
            }}
          />
          <label
            htmlFor={`filter-${props.name}-${option.value}`}
            className="ml-3 flex-1 text-sm"
          >
            {(FilterTitles as any)[option.value!] ?? option.value} (
            {option.amount})
          </label>
          <label
            htmlFor={`filter-${props.name}-${option.value}`}
            className="text-sm text-right"
          >
            {typeof option.floor === "undefined"
              ? "-"
              : `◎${lamportsToSOL(option.floor)}`}
          </label>
        </div>
      ))}
    </>
  );
}
function FilterTextAttributes(props: {
  name: string;
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  isChecked: (value: string) => boolean;
}) {
  return (
    <>
      {props.values.map((option) => (
        <div key={option} className="flex items-center">
          <input
            id={`filter-${props.name}-${option}`}
            name={`${props.name}[]`}
            type="checkbox"
            checked={props.isChecked(option)}
            className="form-checkbox h-4 w-4 border-gray-300 rounded text-gray-600 focus:ring-gray-500 dark:text-gray-400"
            onChange={(e) => {
              if (e.target.checked) {
                props.onAdd(option);
              } else {
                props.onRemove(option);
              }
            }}
          />
          <label
            htmlFor={`filter-${props.name}-${option}`}
            className="ml-3 flex-1 text-sm"
          >
            {(FilterTitles as any)[option] ?? option}
          </label>
        </div>
      ))}
    </>
  );
}

function FilterItem(props: {
  defaultOpen?: boolean;
  section: {
    key?: string;
    type?: "status" | "trait";
    values?: string[];
    numbers?: TraitNumber[];
  };
}) {
  const { section } = props;
  const filters = useSelector((data) => data.filters);
  const openedSections = useSelector((data) => data.filterOpenedSections);
  const [initialLoad, setInitialLoad] = useState(true);

  const onAdd = (value: string) => {
    addFilter(
      props.section.type === "status"
        ? { type: "status", status: value as any }
        : {
          type: "trait",
          key: props.section.key!,
          value: value,
        }
    );
  };
  const onRemove = (value: string) => {
    removeFilter(
      props.section.type === "status"
        ? { type: "status", status: value as any }
        : {
          type: "trait",
          key: props.section.key!,
          value: value,
        }
    );
  };

  const isChecked = (value: string) => {
    const tt = props.section.type ?? "trait";
    const res = filters.findIndex(
      (a) =>
        a.type === tt &&
        ((a.type === "status" && a.status === value) ||
          (a.type === "trait" &&
            a.key === props.section.key &&
            a.value === value))
    );
    return res > -1;
  };

  const activeFilterCount = filters.filter(
    (a) =>
      (a.type === (props.section.type ?? "trait") && a.type === "status") ||
      (a.type === "trait" && a.key === props.section.key)
  ).length;

  function toggleSectionVisibility(section: any) {
    openedSections.includes(JSON.stringify(section.key).toLowerCase())
      ? removeOpenedSection(JSON.stringify(section.key).toLowerCase())
      : addOpenedSection(JSON.stringify(section.key).toLowerCase());
  }

  useEffect(() => {
    if (filters.length > 0 && initialLoad) {
      filters.forEach((filter) => {
        if (filter.type == "status") {
          addOpenedSection(JSON.stringify(filter.type).toLowerCase());
        } else if (filter.type == "trait") {
          addOpenedSection(JSON.stringify(filter.key).toLowerCase());
        }
      });
      setInitialLoad(false);
    }
  }, [filters]);

  return (
    <Disclosure
      as="div"
      key={section.key + "-" + activeFilterCount}
      defaultOpen={false}
      className="border-t border-gray-200 dark:border-zinc-600 px-4 py-6"
    >
      {({ open }) => (
        <>
          <h3
            className="-my-3 flow-root"
            onClick={() => toggleSectionVisibility(section)}
          >
            <Disclosure.Button className="py-3 w-full flex items-center justify-between text-sm">
              <span className="font-medium">{section.key}</span>
              {activeFilterCount > 0 && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center ml-2">
                  <span
                    className="text-sm"
                    style={{ fontSize: 12 }}
                  >
                    {activeFilterCount}
                  </span>
                </div>
              )}
              <div className="flex-1" />
              <span className="ml-6 flex items-center">
                {openedSections.includes(
                  JSON.stringify(section.key).toLowerCase()
                ) ? (
                  <MinusSmIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                    onClick={() =>
                      removeOpenedSection(
                        JSON.stringify(section.key).toLowerCase()
                      )
                    }
                  />
                ) : (
                  <PlusSmIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                    onClick={() =>
                      addOpenedSection(
                        JSON.stringify(section.key).toLowerCase()
                      )
                    }
                  />
                )}
              </span>
            </Disclosure.Button>
          </h3>
          {openedSections.includes(
            JSON.stringify(section.key?.toLowerCase())
          ) && (
              <Disclosure.Panel static className="pt-6">
                <div className="space-y-6">
                  {(section.numbers?.length ?? 0) > 0 ? (
                    <FilterNumberAttributes
                      isChecked={isChecked}
                      name={section.key!}
                      numbers={section.numbers!}
                      onAdd={onAdd}
                      onRemove={onRemove}
                    />
                  ) : (
                    <FilterTextAttributes
                      isChecked={isChecked}
                      name={section.key!}
                      values={section.values!}
                      onAdd={onAdd}
                      onRemove={onRemove}
                    />
                  )}
                </div>
              </Disclosure.Panel>
            )}
        </>
      )}
    </Disclosure>
  );
}

export function MobileFilters(props: {
  mobileFiltersOpen: boolean;
  idOrSlug: string;
  setMobileFiltersOpen: (val: boolean) => void;
}) {
  const collectionMeta = useSelector(
    (data) => data.collectionMetas[props.idOrSlug]
  );
  return (
    <Transition.Root show={props.mobileFiltersOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 flex z-50 lg:hidden"
        onClose={(v) => props.setMobileFiltersOpen(v)}
      >
        <Transition.Child
          as={React.Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-opacity-25" />
        </Transition.Child>

        <Transition.Child
          as={React.Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="ml-auto relative max-w-xs w-full h-full bg-white dark:bg-zinc-800 shadow-xl pt-4  flex flex-col">
            <div className="px-4 py-4 flex items-center justify-between">
              <h2 className="text-lg font-medium ">Filters</h2>
              <button
                type="button"
                className="-mr-2 w-10 h-10 p-2 rounded-md flex items-center justify-center"
                onClick={() => props.setMobileFiltersOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col flex-1 overflow-y-scroll h-full">
              <FilterItem defaultOpen key="status" section={StatusOptions} />
              {collectionMeta?.traits
                ?.sort((a, b) => a.key?.localeCompare(b.key ?? "") ?? 0)
                .map((section) => (
                  <FilterItem key={section.key} section={section} />
                ))}
            </div>
            <div className=" flex flex-col ml-2 nightwind-prevent-block">
              <span
                key={"rdone"}
                className="m-1 inline-flex items-center pr-2 text-sm font-medium text-gray-900"
              >
                <Button
                  color='dark'
                  onClick={() => props.setMobileFiltersOpen(false)}
                  style={{ width: '100%' }}
                >
                  <span>Apply Filters</span>
                </Button>
              </span>
              <RemoveFiltersButton primary />
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}

export function Filters(props: { idOrSlug: string }) {
  const collectionMeta = useSelector(
    (data) => data.collectionMetas[props.idOrSlug]
  );
  if (!collectionMeta) {
    return (
      <form className="hidden h-screen overflow-y-scroll lg:block lg:w-60 xl:w-80 mr-4 sticky top-16">
        <h3 className="sr-only">Filter</h3>
        <FilterItem defaultOpen key="status" section={StatusOptions} />
      </form>
    );
  }
  return (
    <form className="hidden h-screen overflow-y-scroll lg:block lg:w-60 xl:w-80 mr-4 sticky top-16">
      <h3 className="sr-only">Filter</h3>
      <FilterItem defaultOpen key="status" section={StatusOptions} />
      {collectionMeta.traits
        ?.sort(
          (a, b) => (a.key ?? "unknown").localeCompare(b.key ?? "unknown") ?? 0
        )
        .map((section) => (
          <FilterItem key={section.key} section={section} />
        ))}
    </form>
  );
}
