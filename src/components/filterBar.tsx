import React from "react";
import { Menu, Transition } from "@headlessui/react";

import {
  BiChevronDown as ChevronDownIcon,
  BiFilter as FilterIcon,
  BiRefresh as RefreshIcon,
  BiSearch as SearchIcon
} from "react-icons/bi";
import { classNames } from "../utils/clsx";
import { useDispatch, useSelector } from "../api/store";
import { Filter } from "../api/types";
import { removeFilter, changeSort, setFiltersAndOrder } from "../api/actions";
import { FilterByStatus, OrderBy } from "../data/marketplace.pb";
import { Button } from "../lib/flowbite-react";
import { useTheme } from "../lib/next-themes";

const sortOptions: OrderBy[] = [
  "PRICE_LOW_TO_HIGH",
  "PRICE_HIGH_TO_LOW",
  "RECENTLY_LISTED",
  "RECENTLY_SOLD",
  "HIGHEST_LAST_SALE",
  "HIGHEST_CURRENT_OFFER",
];

export const FilterTitles: Record<FilterByStatus, string> = {
  BUY_NOW: "Buy Now",
  HAS_OFFERS: "Has Offers",
};

export const OrderTitles: Record<OrderBy, string> = {
  HIGHEST_LAST_SALE: "Highest Last Sale",
  MOST_VIEWED: "Most Viewed",
  PRICE_HIGH_TO_LOW: "Price: High to Low",
  PRICE_LOW_TO_HIGH: "Price: Low to High",
  RECENTLY_LISTED: "Recently Listed",
  RECENTLY_SOLD: "Recently Sold",
  HIGHEST_CURRENT_OFFER: "Highest Current Offer",
};

function FilterChip(props: { filter: Filter }) {
  const { filter } = props;
  const label =
    filter.type === "status" ? FilterTitles[filter.status] : filter.value;

  const onRemove = () => {
    removeFilter(filter);
  };

  return (
    <span
      key={props.filter.type}
      className="m-1 inline-flex rounded-full border border-gray-200 dark:border-zinc-200 items-center py-1.5 pl-3 pr-2 text-sm font-medium bg-white dark:bg-zinc-600 text-gray-900 dar:text-white"
    >
      <div className="text-xs mr-1">
        {filter.type === "trait" ? filter.key + " /" : ""}
      </div>
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 ml-1 h-4 w-4 p-1 rounded-full inline-flex text-gray-400 hover:bg-gray-200 hover:text-gray-500"
      >
        <span className="sr-only">Remove filter for {label}</span>
        <svg
          className="h-2 w-2"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 8 8"
        >
          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
        </svg>
      </button>
    </span>
  );
}

export function RemoveFiltersButton({ primary }: { primary?: boolean }) {
  const onRemove = () => {
    setFiltersAndOrder([]);
  };

  return (
    <span
      key={"remove-all"}
      className={classNames(
        "m-1 inline-flex items-center pr-2 text-sm font-medium text-gray-900",
        primary ? "" : "py-1.5"
      )}
    >
      <Button
        color='light'
        onClick={onRemove}
        style={{ width: '100%' }}
      >
        <span>Clear All</span>
      </Button>
    </span>
  );
}

export default function FilterBar(props: {
  setMobileFiltersOpen: (open: boolean) => void;
  onClickSearch: () => void;
}) {
  const { orderBy, filters, refreshing } = useSelector((data) => ({
    filters: data.filters,
    orderBy: data.orderBy,
    refreshing: data.filterIsInProgress,
  }));
  const dispatch = useDispatch();
  const onRefreshPage = () => {
    dispatch({ type: "ForceFilter" });
  };

  const { theme } = useTheme()
  const darkMode = theme === 'dark'

  return (
    <div className="bg-gray-200 dark:bg-zinc-800 flex items-center mb-4 px-4 py-4 z-10 w-full rounded-2xl">
      <button
        className=""
        onClick={onRefreshPage}
        disabled={refreshing}
      >
        <img
          alt="refresh icon"
          src="/icons/refresh-round-24px.svg"
          className={classNames(
            `flex-shrink-0 mr-3 h-5 w-5"`,
            refreshing ? "animate-spin" : "",
            darkMode ? "black-icon-to-white" : ""
          )}
        />
      </button>
      <div className="flex-1 flex lg:hidden" />
      <div className="flex-1 sm:items-center sm:px-1 lg:px-1 hidden lg:flex">
        <h3 className="text-base uppercase tracking-wide">
          default values
          <span className="sr-only">, active</span>
        </h3>

        <div
          aria-hidden="true"
          className="hidden w-px h-5 sm:block sm:ml-4"
        />

        <div className="mt-2 sm:mt-0 sm:ml-4">
          <div className="-m-1 flex flex-wrap items-center">
            {filters.map((activeFilter) => (
              <FilterChip
                filter={activeFilter}
                key={
                  activeFilter.type +
                  (activeFilter as any).status +
                  (activeFilter as any).value
                }
              />
            ))}
            {filters.length > 0 && <RemoveFiltersButton />}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="p-2 -m-2 mr-4 sm:ml-6 hover:text-black dark:hover:text-white"
        onClick={() => props.onClickSearch()}
      >
        <SearchIcon className="w-6 h-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="p-2 -m-2 mr-4 text-gray-400 hover:text-gray-500 lg:hidden relative"
        onClick={() => props.setMobileFiltersOpen(true)}
      >
        <span className="sr-only">Filters</span>
        <FilterIcon className="w-6 h-6" aria-hidden="true" />
        <div className="w-5 h-5 bg-gray-500 rounded-full absolute top-0 -right-1 flex items-center justify-center dark:bg-indigo-600">
          <span
            className="text-sm text-white dark:text-white"
            style={{ fontSize: 12 }}
          >
            {filters.length}
          </span>
        </div>
      </button>
      <Menu
        as="div"
        className="relative flex text-left bg-white dark:bg-zinc-600 h-9 items-center rounded-md"
      >
        <div className="w-full">
          <Menu.Button className="group inline-flex text-sm font-medium text-black dark:text-gray-300 dark:hover:bg-gray-500 pl-4 py-2 w-full justify-between">
            <p className="text-sm font-medium text-black dark:text-white hover:text-gray-900">
              {OrderTitles[orderBy] ? OrderTitles[orderBy] : "Sortation"}
            </p>
            <ChevronDownIcon
              className="flex-shrink-0 mr-2 ml-1 h-5 w-5 text-black dark:text-white"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="z-50 absolute right-0 top-8 mt-2 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none w-60 ">
            <div className="py-1">
              {sortOptions.map((option) => (
                <Menu.Item key={option}>
                  {({ active }) => (
                    <button
                      onClick={() => changeSort(option)}
                      disabled={option === orderBy}
                      className={classNames(
                        option === orderBy ? "font-medium " : "",
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm w-full text-left text-black"
                      )}
                    >
                      {OrderTitles[option]}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
