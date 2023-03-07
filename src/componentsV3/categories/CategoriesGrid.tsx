import { Link } from "react-router-dom";
import React from "react";
import { BigCollection } from "../../pages/HomePage";
// import {API_ADDRESS} from "../../api/app/constants";
import useSWR from "swr";
import { fetcher, marketplaceServerUrl } from "../../lib/utils";
import JungleCats from "../../assets/nfts/junglecats.png";

export function CategoriesGrid() {
  // const { data, error } = useSWR<any>(
  //   `${"API_ADDRESS"}/api/v2/collection/list/categories`,
  //   fetcher
  // );
  const data = [
    {
      id: "1",
      name: "string",
      volume: "string",
      thumbnail: JungleCats,
    },
    {
      id: "1",
      name: "string",
      volume: "string",
      thumbnail: JungleCats,
    },
    {
      id: "1",
      name: "string",
      volume: "string",
      thumbnail: JungleCats,
    },
    {
      id: "1",
      name: "string",
      volume: "string",
      thumbnail: JungleCats,
    },
    {
      id: "1",
      name: "string",
      volume: "string",
      thumbnail: JungleCats,
    },
    {
      id: "1",
      name: "string",
      volume: "string",
      thumbnail: JungleCats,
    },
  ];

  if (!data) return null;
  return (
    <section
      id="popular"
      aria-labelledby="collections-heading"
      className="container mx-auto"
    >
      <div className="mx-auto px-4 lg:px-0">
        <div className="max-w-2xl mx-auto md:max-w-none">
          <h2
            id="collections-heading"
            className="text-3xl font-bold tracking-tight w-full flex justify-between"
          >
            <span>Categories</span>

            <Link
              className="text-lg underline font-medium cursor-pointer flex items-end"
              to={"/explore"}
            >
              Explore All
            </Link>
          </h2>
          <div className="mt-4 gap-y-12 md:gap-y-4 md:grid md:grid-cols-3 md:gap-x-3 lg:gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {data.map((category: any) => (
              <BigCollection
                key={category.id}
                collection={category}
                show="volume"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
