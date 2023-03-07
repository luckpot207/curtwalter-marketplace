import { TrendingListCollection } from "../../components/collection/TrendingListCollection";
import React, { useEffect } from "react";
import { TrendingCollectionData } from "../../data/collection";
// import {
//   listTrendingCollections
// } from "../../api/api";
import { useStore } from "../../lib/store";
import MoonkeesNft from "../../assets/nfts/moonkes.png";
import ArrowDown from "../../assets/icons/arrow-down.svg";

const listTrendingCollections = [
  {
    id: "1",
    slug: "string",
    title: "string",
    thumbnail: MoonkeesNft,
    totalItems: 5000,
    addedAt: "string",
    listedCount: 200,
    floorPrice: "1000",
    trendingVolume: "5000",
  },
  {
    id: "1",
    slug: "string",
    title: "string",
    thumbnail: MoonkeesNft,
    totalItems: 5000,
    addedAt: "string",
    listedCount: 200,
    floorPrice: "1000",
    trendingVolume: "5000",
  },
  {
    id: "1",
    slug: "string",
    title: "string",
    thumbnail: MoonkeesNft,
    totalItems: 5000,
    addedAt: "string",
    listedCount: 200,
    floorPrice: "1000",
    trendingVolume: "5000",
  },
  {
    id: "1",
    slug: "string",
    title: "string",
    thumbnail: MoonkeesNft,
    totalItems: 5000,
    addedAt: "string",
    listedCount: 200,
    floorPrice: "1000",
    trendingVolume: "5000",
  },
  {
    id: "1",
    slug: "string",
    title: "string",
    thumbnail: MoonkeesNft,
    totalItems: 5000,
    addedAt: "string",
    listedCount: 200,
    floorPrice: "1000",
    trendingVolume: "5000",
  },
];
export function TrendingGrid() {
  const [trendingList, setTrendingList] = React.useState<
    TrendingCollectionData[]
  >([]);
  const [trendingListPeriod, setTrendingListPeriod] =
    React.useState<string>("7d");
  const [trendingCollectorsLoading, setTrendingCollectorsLoading] =
    React.useState<boolean>(false);

  const {
    collectionTrendingGridIntervalDropdownOpen,
    setCollectionTrendingGridIntervalDropdownOpen,
  } = useStore();

  const trendingListPeriodMapping = {
    "24h": "last 24 hours",
    "7d": "last 7 days",
    "14d": "last 14 days",
    "1m": "last month",
    "3m": "last 3 months",
    "6m": "last 6 months",
    "1y": "last year",
  };

  React.useEffect(() => {
    setTrendingCollectorsLoading(true);
    // listTrendingCollections.({ limit: 18, interval: trendingListPeriod }).then(
    // (res) => {
    setTrendingList(listTrendingCollections);
    setTrendingCollectorsLoading(false);
    // }
    // );
  }, [trendingListPeriod]);

  return (
    <section
      id="trending-collectors"
      aria-labelledby="collections-heading"
      className="container mx-auto mt-20"
    >
      <div className="px-4 lg:px-0">
        <span className="text-xl md:text-2xl lg:text-3xl font-bold flex">
          <h1>Trending in</h1>{" "}
          <h1
            className="cursor-pointer h-14 font-bold flex flex-col items-center z-10"
            onClick={(e) => {
              e.stopPropagation();
              setCollectionTrendingGridIntervalDropdownOpen(
                !collectionTrendingGridIntervalDropdownOpen
              );
            }}
          >
            <div className="relative flex ml-2 ">
              {(trendingListPeriodMapping as any)[trendingListPeriod]}{" "}
              <img
                alt="arrow-down"
                src={ArrowDown}
                width={12}
                className={`ml-4 transition-all invert-icon ${
                  collectionTrendingGridIntervalDropdownOpen ? "rotate-180" : ""
                }`}
              />
              {collectionTrendingGridIntervalDropdownOpen && (
                <div className="absolute top-8 left-0 lg:top-12 right-0 rounded-b-xl bg-white">
                  {Object.keys(trendingListPeriodMapping).map((k) => (
                    <div
                      className="text-sm md:text-l lg:text-xl flex justify-end border-t py-2 pr-4"
                      onClick={() => setTrendingListPeriod(k)}
                      key={k}
                    >
                      {(trendingListPeriodMapping as any)[k]}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </h1>
        </span>
        <div className="flex flex-wrap w-full gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-4">
          {trendingList.map((collection, k) => (
            <div key={k} className="trending-collector-width">
              <TrendingListCollection
                collection={collection}
                loader={trendingCollectorsLoading}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
