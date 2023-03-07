import useSWR from "swr";
import { fetcher, marketplaceServerUrl } from "../../lib/utils";
import { CollectionCarousel } from "./CollectionCarousel";
// import {Collection, FetchResponse} from "@piggydao/marketplace-models";
import { CarouselSlideProps } from "./CarouselSlide";
import MoonkeesNft from "../../assets/nfts/moonkes.png";

export function Trending24hCollectionsCarousel() {
  // const { data, error } = useSWR<FetchResponse<Collection>>(`${marketplaceServerUrl()}/collections/trending/24h`,  fetcher)

  // if (!data || !data.data || !(data.data.length > 0)) return null
  const listings = [
    {
      thumbnail: MoonkeesNft,
      title: "NFT",
      slug: "1/1/2023",
      floor_price: "floor_price.com",
      listed_count: 5,
      added_at: "listing.added_at",
    },
    {
      thumbnail: MoonkeesNft,
      title: "NFT",
      slug: "1/1/2023",
      floor_price: "floor_price.com",
      listed_count: 5,
      added_at: "listing.added_at",
    },
    {
      thumbnail: MoonkeesNft,
      title: "NFT",
      slug: "1/1/2023",
      floor_price: "floor_price.com",
      listed_count: 5,
      added_at: "listing.added_at",
    },
    {
      thumbnail: MoonkeesNft,
      title: "NFT",
      slug: "1/1/2023",
      floor_price: "floor_price.com",
      listed_count: 5,
      added_at: "listing.added_at",
    },
    {
      thumbnail: MoonkeesNft,
      title: "NFT",
      slug: "1/1/2023",
      floor_price: "floor_price.com",
      listed_count: 5,
      added_at: "listing.added_at",
    },
    {
      thumbnail: MoonkeesNft,
      title: "NFT",
      slug: "1/1/2023",
      floor_price: "floor_price.com",
      listed_count: 5,
      added_at: "listing.added_at",
    },
    {
      thumbnail: MoonkeesNft,
      title: "NFT",
      slug: "1/1/2023",
      floor_price: "floor_price.com",
      listed_count: 5,
      added_at: "listing.added_at",
    },
  ];
  return (
    <CollectionCarousel
      title="Trending"
      data={
        listings.map((collection) => {
          return {
            image: collection.thumbnail,
            imageType: "collection",
            title: collection.title,
            url: `/collection/${collection.slug}`,
            floorPrice: collection.floor_price,
            listed: collection.listed_count,
            addedAt: collection.added_at,
          };
        }) as CarouselSlideProps[]
      }
    />
  );
}
