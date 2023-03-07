import useSWR from "swr";
import { fetcher, marketplaceServerUrl } from "../../lib/utils";
import { CollectionCarousel } from "./CollectionCarousel";
// import {Collection, FetchResponse} from "@piggydao/marketplace-models";
import { CarouselSlideProps } from "./CarouselSlide";
import GenesNft from "../../assets/nfts/genesispill.png";

export function NewCollectionsCarousel() {
  // const { data, error } = useSWR<FetchResponse<Collection>>(`${marketplaceServerUrl()}/collections/new`,  fetcher)

  // if (!data || !data.data || !(data.data.length > 0)) return null
  const listTrendingCollections = [
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
    {
      id: "1",
      slug: "string",
      title: "string",
      thumbnail: GenesNft,
      totalItems: 5000,
      added_at: "string",
      listed_count: 200,
      floor_price: "1000",
      trendingVolume: "5000",
    },
  ];

  return (
    <CollectionCarousel
      title="New"
      data={
        listTrendingCollections.map((collection) => {
          return {
            image: collection.thumbnail,
            imageType: "collection",
            title: collection.title,
            url: `/collection/${collection.slug}`,
            floor_price: collection.floor_price,
            listed: collection.listed_count,
            added_at: collection.added_at,
          };
        }) as CarouselSlideProps[]
      }
    />
  );
}
