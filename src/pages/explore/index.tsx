import React, { useEffect } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
// import {
//   filterCollection,
//   listCategories, listCollections,
// } from "../api/api";
import { BaseCollectionData, CategoryData } from "../../data/collection";
import { UpcomingCollection } from "../../components/collection/UpcominCollection";
import { BaseCollection } from "../../components/collection/BaseCollection";
import { FiX, FiChevronDown, FiSearch } from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import { classNames } from "../../utils/clsx";
import { useWindowSize } from "../../utils/useWindowSize";
import { Layout } from "../../componentsV3/layout/Layout";
import { StakeToEarnBanner } from "../../componentsV3/staking/StakeToEarnBanner";
import { Button } from "../../lib/flowbite-react";
import { useTheme } from "../../themes";
import MoonkeesNft from "../../assets/nfts/moonkes.png";
import useMarketplaceContract from "../../hooks/useMarketplaceContract";
import { useAccount } from "wagmi";
import { Marketplace } from "../../typechain-types";
import { decodeMetadataUri, getIpfsFileUri } from "../../utils/nft";

const CategoryData_ = {
  id: "1",
  name: "my category",
  volume: "my volume",
  thumbnail: MoonkeesNft,
};

<<<<<<< HEAD
const collectionData = {
  id: "1",
  slug: "my slug",
  title: "my title",
  thumbnail: MoonkeesNft,
  totalItems: 487,
  addedAt: "my add",
  listedCount: 26,
  floorPrice: "floorPrice",
};
=======
const CollectionData_ = {
    id: "1",
    slug: "my_slug",
    title: "my title",
    thumbnail: MoonkeesNft,
    totalItems: 487,
    addedAt: "my_add",
    listedCount: 26,
    floorPrice: "floorPrice",
}
>>>>>>> 2689cb003b9f8d47025b638e2622a80a8b1928be

export function Explore() {
  const {
    allNftCollections,
    allNftCollectionsAuthored,
    allNftCollectionsWhereSignerOwnsTokens,
    allNftCollectionsWhereTokenOnSale,
  } = useMarketplaceContract();
  const { isConnected } = useAccount();

  const url = window.location.pathname;
  const urlParts = url.split("/");

  const catFilter: string[] = [];
  if (urlParts.length > 1 && urlParts[urlParts.length - 2] === "category") {
    catFilter.push(urlParts[urlParts.length - 1]);
  }

  const [categoryList, setCategoryList] = React.useState<CategoryData[]>([]);
  const [categoryFilter, setCategoryFilter] =
    React.useState<string[]>(catFilter);

  const [collectionList, setCollectionList] = React.useState<
    BaseCollectionData[]
  >([]);
  const [collectionListSort, setCollectionListSort] = React.useState<{
    order: string;
    dir: string;
  }>({ order: "title", dir: "asc" });

  const [collectionListSearch, setCollectionListSearch] = React.useState("");
  const [collectionListOffset, setCollectionListOffset] =
    React.useState<number>(0);
  const [collectionListNextPage, setCollectionListNextPage] =
    React.useState<boolean>(false);

  const windowSize = useWindowSize();

  const sortOptions = [
    { order: "title", dir: "asc", title: "Title: A to Z" },
    { order: "title", dir: "desc", title: "Title: Z to A" },
    { order: "floorPrice", dir: "asc", title: "Floor: Low to High" },
    { order: "floorPrice", dir: "desc", title: "Floor: High to Low" },
    { order: "listedCount", dir: "asc", title: "Listed: Low to High" },
    { order: "listedCount", dir: "desc", title: "Listed: High to Low" },
  ];

  const getSortTitle = (order: string, dir: string) => {
    for (const t of sortOptions) {
      if (t.order === order && t.dir === dir) {
        return t.title;
      }
    }
    return "";
  };

  const { theme } = useTheme();
  const darkMode = theme === "dark";

  useEffect(() => {
    setCategoryList([
      {
        id: "1",
        name: "PFP",
        volume: "30000",
        thumbnail: MoonkeesNft,
      },
      {
        id: "2",
        name: "STAKING",
        volume: "30000",
        thumbnail: MoonkeesNft,
      },
      {
        id: "3",
        name: "LIFESTYLE",
        volume: "30000",
        thumbnail: MoonkeesNft,
      },
      {
        id: "4",
        name: "ART",
        volume: "30000",
        thumbnail: MoonkeesNft,
      },
      {
        id: "5",
        name: "UTILITY",
        volume: "30000",
        thumbnail: MoonkeesNft,
      },
      {
        id: "6",
        name: "PIXEL",
        volume: "30000",
        thumbnail: MoonkeesNft,
      },
    ]);
  }, []);

  useEffect(() => {
    setCollectionListNextPage(false);
    const collections: BaseCollectionData[] = allNftCollections.map(
      (collection, idx) => ({
        id: idx.toString(),
        slug: "string",
        title: collection.name,
        thumbnail:
          collection.nftsInCollection.length > 0
            ? getIpfsFileUri(
                decodeMetadataUri(collection.nftsInCollection[0].metadataUri)
                  .image as string
              )
            : "",
        totalItems: 1000,
        addedAt: Date.now().toString(),
        listedCount: 10,
        floorPrice: "0",
      })
    );
    setCollectionList(collections);
    setCollectionListOffset(collections.length);
    setCollectionListNextPage(collections.length > 0);
  }, [categoryFilter, collectionListSort, collectionListSearch]);

  const handleCategoryFilter = (category: CategoryData) => {
    if (categoryFilter.includes(category.id.toString())) {
      let newArray = categoryFilter.slice();
      const index = newArray.indexOf(category.id.toString());
      newArray.splice(index, 1);
      setCategoryFilter(newArray);
    } else {
      setCategoryFilter([...categoryFilter, category.id.toString()]);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting) {
      fetchNextPage();
    }
  };

  const fetchNextPage = () => {
    if (!collectionListNextPage) {
      return;
    }
    setCollectionListNextPage(false);

    if (collectionList.length === 0) {
      setCollectionListNextPage(false);
    } else {
      const array = [...collectionList, ...collectionList];
      const newArray: any[] = [];
      const distinct: string[] = [];
      for (let i = 0; i < array.length; i++) {
        if (!distinct.includes(array[i].id)) {
          distinct.push(array[i].id);
          newArray.push(array[i]);
        }
      }
      setCollectionList(newArray);
      setCollectionListOffset(collectionListOffset + collectionList.length);
      setCollectionListNextPage(true);
    }
  };

  const onSortChange = (option: { order: string; dir: string }) => {
    if (
      collectionListSort.order !== option.order ||
      collectionListSort.dir !== option.dir
    ) {
      setCollectionListSort({ order: option.order, dir: option.dir });
    }
  };

  return (
    <Layout footer={false}>
      <div className="relative container mx-auto overflow-hidden px-4">
        {/* <StakeToEarnBanner /> */}

        <div className="w-full flex justify-center gap-4 my-8 flex-wrap text-left">
          {categoryList.map((category: any, k: number) => (
            <Button
              size="md"
              key={k}
              color={
                theme === "light"
                  ? categoryFilter.includes(category.id.toString())
                    ? "dark"
                    : "light"
                  : categoryFilter.includes(category.id.toString())
                  ? "light"
                  : "dark"
              }
              onClick={() => handleCategoryFilter(category)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <div className="bg-gray-100 dark:bg-zinc-800 rounded-xl py-4 w-full flex justify-between mb-4">
          <div className="flex justify-between w-full px-4 sm:px-6">
            <div className="relative w-1/2 sm:w-1/3 md:w-1/4 mr-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-black" aria-hidden="true" />
              </div>
              <input
                onChange={(event) =>
                  setCollectionListSearch(event?.target.value)
                }
                id="search1"
                name="search1"
                className="block w-full pl-8 sm:pl-10 py-2 rounded-md leading-5 focus:outline-none sm:text-sm dark:bg-zinc-600 text-black dark:text-gray-300 dark:hover:text-white placeholder-black dark:placeholder-gray-300 pr-10"
                placeholder={`${
                  windowSize.width && windowSize.width > 480
                    ? "Search Collections"
                    : ""
                }`}
                autoComplete="off"
                value={collectionListSearch}
              />
              {collectionListSearch && (
                <div
                  className="absolute right-3 h-full flex top-0 items-center"
                  onClick={() => setCollectionListSearch("")}
                >
                  <FiX className="text-black w-5 h-5 dark:text-paperwhite" />
                </div>
              )}
            </div>
            <Menu
              as="div"
              className="relative flex text-left bg-white dark:bg-zinc-600 text-black dark:text-gray-300 h-9 items-center w-60 rounded-md"
            >
              <Menu.Button className="group inline-flex text-sm font-medium text-black dark:text-gray-300 hover:text-gray-900 pl-4 py-2 w-full justify-between">
                <p className="text-sm font-medium text-black dark:text-gray-300 hover:text-gray-900">
                  {getSortTitle(
                    collectionListSort.order,
                    collectionListSort.dir
                  )}
                </p>
                <FiChevronDown
                  className="flex-shrink-0 mr-2 ml-1 h-5 w-5 text-black dark:text-gray-300 group-hover:text-gray-900"
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
                {sortOptions && (
                  <Menu.Items className="z-50 absolute right-0 top-8 mt-2 rounded-md shadow-2xl bg-white dark:bg-zinc-600 ring-1 ring-black ring-opacity-5 focus:outline-none w-60 ">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={`${option.order}_${option.dir}`}>
                          {({ active }) => (
                            <button
                              onClick={() => onSortChange(option)}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm w-full text-left text-black dark:text-gray-300 dark:hover:bg-gray-500"
                              )}
                            >
                              {option.title}
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
        <div className="mt-4 gap-y-12 gap-x-3 grid grid-cols-1 md:gap-y-4 sm:grid-cols-2 md:grid-cols-3 md:gap-x-3 lg:gap-y-8 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 lg:gap-x-3 mb-16">
          {collectionList.map((item: any) => (
            <BaseCollection key={item.id} collection={item} />
          ))}
          {collectionListNextPage && (
            <div
              ref={(res) => {
                if (res) {
                  const observer = new IntersectionObserver(handleObserver, {
                    root: null,
                    threshold: 0.25,
                    rootMargin: "0px",
                  });
                  observer.observe(res);
                }
              }}
            />
          )}
        </div>

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
    </Layout>
  );
}
