import React from "react";
import { Helmet } from "react-helmet";
import * as marketplacepb from "../../data/marketplace.pb";
import {
  listCollections,
  listNewCollections,
  listTrendingCollections,
  listUpcomingCollections,
  searchCollection,
} from "../../api/api";
import { Link } from "react-router-dom";
import { SearchModal } from "../SearchModal";
import { useSelector } from "../../api/store";
import { BaseCollection } from "../collection/BaseCollection";
import { UpcomingCollection } from "../collection/UpcominCollection";
import { changeExploreOrder, setFiltersAndOrder } from "../../api/actions";
import { BiChevronDown as ChevronDownIcon, BiSearch as SearchIcon } from "react-icons/bi";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "../../utils/clsx";
import { OrderBy } from "../../data/marketplace.pb";

export default function Explore() {
  const [shownCollection, setShownCollection] = React.useState<any>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const url = window.location.pathname;
  const splittedUrl = url.split("/");
  const collectionName = splittedUrl[splittedUrl.length - 1];
  const { darkMode, exploreOrderBy } = useSelector((data) => ({
    darkMode: data.darkMode,
    exploreOrderBy: data.exploreOrderBy,
  }));
  const [searchTerm, setSearchTerm] = React.useState("");
  const [originalList, setOriginalList] = React.useState<any[]>([]);

  const [isCategory, setIsCategory] = React.useState<boolean>(true);
  const [sortationOptions, setSortationOptions] = React.useState<any>();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const exploreCollectionOrderTitles: Record<OrderBy, string> = {
    HIGHEST_LAST_SALE: "Highest Last Sale",
    MOST_VIEWED: "Most Viewed",
    PRICE_HIGH_TO_LOW: "Price: High to Low",
    PRICE_LOW_TO_HIGH: "Price: Low to High",
    RECENTLY_LISTED: "Recently Listed",
    RECENTLY_SOLD: "Recently Sold",
    HIGHEST_CURRENT_OFFER: "Highest Current Offer",
  };

  const exploreCategoryOrderOptions: Record<
    marketplacepb.ExploreCategoryOrderBy,
    string
  > = {
    PRICE_HIGH_TO_LOW: "Price: High to Low",
    PRICE_LOW_TO_HIGH: "Price: Low to High",
    RECENTLY_LISTED: "Recently Listed",
  };

  const collectionFilters = [
    "All Categories",
    "Art",
    "Avatars",
    "DeFi",
    "Gaming",
    "Metaverse",
    "Sports",
    "Staking",
  ];

  const [activeCategoriesFilters, setActiveCategoriesFilters] = React.useState([
    "All Categories",
  ]);

  const getCollectionNameFromURL = () => {
    switch (collectionName) {
      case "trending":
        listTrendingCollections().then((res: any) => {
          setShownCollection(res);
          setOriginalList(res);
          setIsCategory(!!res[0].volume);
          setSortationOptions(
            !!res[0].volume
              ? exploreCategoryOrderOptions
              : exploreCollectionOrderTitles
          );
        });
        break;
      case "new":
        listNewCollections().then((res: marketplacepb.Collection[]) => {
          setShownCollection(res);
          setOriginalList(res);
          setIsCategory(!!res[0].volume);
          setSortationOptions(
            !!res[0].volume
              ? exploreCategoryOrderOptions
              : exploreCollectionOrderTitles
          );
        });
        break;
      case "upcoming":
        listUpcomingCollections().then((res: marketplacepb.Collection[]) => {
          setShownCollection(res);
          setOriginalList(res);
          setIsCategory(!!res[0].volume);
          setSortationOptions(
            !!res[0].volume
              ? exploreCategoryOrderOptions
              : exploreCollectionOrderTitles
          );
        });
        break;
      default:
        listCollections().then(
          (res: marketplacepb.Collection[]) => {
            setShownCollection(res);
            setOriginalList(res);
            setIsCategory(!!res[0].volume);
            setSortationOptions(
              !!res[0].volume
                ? exploreCategoryOrderOptions
                : exploreCollectionOrderTitles
            );
          }
        );
    }
  };

  function onSortationChange(option: string) {
    changeExploreOrder(option);

    let newList: any[] = shownCollection.sort((a: any, b: any) => {
      if (option == "PRICE_HIGH_TO_LOW") {
        return (
          Number(b[isCategory ? "volume" : "floorPrice"]) -
          Number(a[isCategory ? "volume" : "floorPrice"])
        );
      } else if (option == "PRICE_LOW_TO_HIGH") {
        return (
          Number(a[isCategory ? "volume" : "floorPrice"]) -
          Number(b[isCategory ? "volume" : "floorPrice"])
        );
      } else if (option == "MOST_VIEWED") {
        return Number(b.all_sales) - Number(a.all_sales);
      } else if (option == "MOST_POPULAR") {
        return Number(b.trendingVolume) - Number(a.trendingVolume);
      } else if (option == "RECENTLY_LISTED") {
        return new Date(b.addeddAt).getTime() - new Date(a.addeddAt).getTime();
      }
    });
    setShownCollection(newList);
  }

  function handleFilter(filter: string) {
    if (activeCategoriesFilters.includes(filter)) {
      let newArray = activeCategoriesFilters.slice();
      const index = newArray.indexOf(filter);
      newArray.splice(index, 1);
      setActiveCategoriesFilters(newArray);
    } else {
      setActiveCategoriesFilters([...activeCategoriesFilters, filter]);
    }
  }

  React.useEffect(() => {
    getCollectionNameFromURL();
  }, []);

  React.useEffect(() => {
    let filteredArray = originalList.filter(
      (collection: marketplacepb.Collection) => {
        return (
          collection.title?.toLowerCase().match(searchTerm.toLowerCase()) ||
          collection.description?.toLowerCase().match(searchTerm.toLowerCase())
        );
      }
    );
    setShownCollection(filteredArray);
  }, [searchTerm]);

  return (
    <div className="bg-white">
      <Helmet>
        <title>{`Explore`}</title>
      </Helmet>
      <div className="relative container mx-auto overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative pt-4 overflow-hidden container mx-auto">
          <div className="py-16">
            <div className="">
              <div className="flex flex-col md:flex-row bg-silver dark:bg-velvet justify-between card-drop-small-shadow rounded-3xl">
                <div
                  className="rounded-bl-3xl w-1/4  "
                  style={{
                    backgroundImage: `url("./img/fee-reduction-piggy-left.png")`,
                    backgroundPosition: "left bottom" /*Positioning*/,
                    backgroundSize: "contain",
                    filter: "grayscale(50%)",
                    backgroundRepeat:
                      "no-repeat" /*Prevent showing multiple background images*/,
                  }}
                />

                <div className="relative py-6 md:py-16  sm:py-16 px-4 lg:px-0">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                    Stake to Earn
                  </h1>
                  <p className="mt-6 text-xl text-black max-w-3xl">
                    Earn Solana on alpha.art by owning and staking Piggy Sol
                    Gang NFTs. Payments will be distributed equally among staked
                    Pigs.
                  </p>
                  <div className="flex justify-between flex-col md:flex-row md:justify-start">
                    <Link
                      to="/collection/piggy-sol-gang"
                      className="mt-4 inline-block text-center bg-black dark:bg-black border border-transparent rounded-md py-3 px-6 lg:px-8 font-medium text-white dark:text-white hover:bg-gray-700"
                    >
                      Get Your Piggy
                    </Link>
                    <Link
                      to="/stake"
                      className="mt-4 lg:ml-4 inline-block text-center bg-black dark:bg-black border border-transparent rounded-md py-3 px-8 font-medium text-white dark:text-white hover:bg-gray-700"
                    >
                      Stake Your Piggy
                    </Link>
                  </div>
                </div>
                <div
                  className="rounded-br-3xl w-1/4"
                  style={{
                    backgroundImage: `url("./img/fee-reduction-right.png")`,
                    backgroundPosition: "right bottom" /*Positioning*/,
                    backgroundSize: "cover",
                    filter: "grayscale(50%)",
                    backgroundRepeat:
                      "no-repeat" /*Prevent showing multiple background images*/,
                  }}
                />

                <div className="hidden absolute inset-0 bg-white opacity-75" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-center gap-4 mb-4 flex-wrap text-left">
          {collectionFilters.map((collectionFilter, k) => (
            <div
              className={` active:bg-black active:text-white rounded-lg px-7 py-3 border border-solid border-black cursor-pointer flex items-center w-max text-center ${activeCategoriesFilters.includes(collectionFilter)
                  ? "bg-black text-white"
                  : "bg-white text-black"
                }`}
              onClick={() => handleFilter(collectionFilter)}
              key={k}
            >
              {collectionFilter}
            </div>
          ))}
        </div>
        <div className="bg-silver dark:bg-darkgray rounded-xl py-4 w-full flex justify-between mb-4">
          {/* <FilterBar
            setMobileFiltersOpen={setMobileFiltersOpen}
            onClickSearch={() => setSearchOpen(true)}
          /> */}

          <div className="flex justify-between ml-4 w-full px-4 sm:px-6">
            <div className="relative w-1/4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-black" aria-hidden="true" />
              </div>
              <input
                onChange={(event) => setSearchTerm(event?.target.value)}
                id="search1"
                name="search1"
                className="block w-full pl-8 sm:pl-10 py-2 rounded-md leading-5 focus:outline-none focus:placeholder-gray-400 bg-white sm:text-sm text-black placeholder-black dark:placeholder-white"
                placeholder={"Search Collections"}
                type="search"
                autoComplete="off"
              />
            </div>
            <Menu
              as="div"
              className="relative flex text-left bg-white h-9 items-center w-60 rounded-md"
            >
              <Menu.Button className="group inline-flex text-sm font-medium text-black hover:text-gray-900 pl-4 py-2 w-full justify-between">
                <p className="text-sm font-medium text-black hover:text-gray-900">
                  {exploreOrderBy
                    ? sortationOptions[exploreOrderBy]
                    : "Sortation"}
                </p>
                <ChevronDownIcon
                  className="flex-shrink-0 mr-2 ml-1 h-5 w-5 text-black group-hover:text-gray-500"
                  aria-hidden="true"
                />
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                {sortationOptions && (
                  <Menu.Items className="z-50 absolute right-0 top-8 mt-2 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none w-60 ">
                    <div className="py-1">
                      {Object.keys(sortationOptions).map((option) => (
                        <Menu.Item key={option}>
                          {({ active }) => (
                            <button
                              onClick={() => onSortationChange(option)}
                              disabled={option === exploreOrderBy}
                              className={classNames(
                                option === exploreOrderBy ? "font-medium " : "",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm w-full text-left text-black"
                              )}
                            >
                              {sortationOptions[option]}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                )}
              </Transition>
            </Menu>
          </div>
        </div>

        {/* Header name of collection */}
        <h1 className="text-black font-bold text-4xl capitalize">
          {collectionName === "explore" ? "All" : collectionName} collections
        </h1>

        {shownCollection.length === 0 && (
          <p className="text-black font-bold text-2xl mt-1">
            There are no items in this category.
          </p>
        )}

        {/* Showing collection in correct wrapper */}
        {/*<div className="mt-4 gap-y-12 grid  grid-cols-1 md:gap-y-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-3 lg:gap-y-8 lg:grid-cols-4 xl:grid-cols-5 lg:gap-x-6 mb-16">
          {shownCollection.map((item: any) =>
            collectionName === "upcoming" ? (
              <UpcomingCollection collection={item as any} key={item.id} />
            ) : (
              <BaseCollection key={item.id} collection={item as any} />
            )
          )}
        </div>*/}

        <div className="w-full flex justify-end mb-16">
          <button
            className="font-extrabold text-lg flex items-center"
            onClick={() => scrollToTop()}
          >
            Back to top{" "}
            <img
              alt="back to top"
              src="/icons/arrow-circle-up-round-24px.svg"
              className={`ml-4 ${darkMode ? "black-icon-to-white" : ""}`}
            />
          </button>
        </div>
      </div>
      {searchOpen && (
        <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </div>
  );
}
