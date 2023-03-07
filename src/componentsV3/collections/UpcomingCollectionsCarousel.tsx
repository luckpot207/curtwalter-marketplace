import useSWR from "swr";
import { fetcher, marketplaceServerUrl } from "../../lib/utils";
import { CollectionCarousel } from "./CollectionCarousel";
// import {Collection, FetchResponse, ListingApp} from "@piggydao/marketplace-models";
import { CarouselSlideProps } from "./CarouselSlide";
import MoonkeesNft from "../../assets/nfts/moonkes.png";

export function UpcomingCollectionsCarousel() {
  // const { data, error } = useSWR<FetchResponse<ListingApp>>(`${marketplaceServerUrl()}/collections/upcoming`,  fetcher)

  // if (!data || !data.data || !(data.data.length > 0)) return null
  const listings = [
    {
      featured_image: MoonkeesNft,
      name: "NFT",
      mint_time: "1/1/2023",
      twitter: "twitter.com",
      other_links: ["listing.other_links"],
      added_at: "listing.added_at",
    },
    {
      featured_image: MoonkeesNft,
      name: "NFT",
      mint_time: "1/1/2023",
      twitter: "twitter.com",
      other_links: ["listing.other_links"],
      added_at: "listing.added_at",
    },
    {
      featured_image: MoonkeesNft,
      name: "NFT",
      mint_time: "1/1/2023",
      twitter: "twitter.com",
      other_links: ["listing.other_links"],
      added_at: "listing.added_at",
    },
    {
      featured_image: MoonkeesNft,
      name: "NFT",
      mint_time: "1/1/2023",
      twitter: "twitter.com",
      other_links: ["listing.other_links"],
      added_at: "listing.added_at",
    },
    {
      featured_image: MoonkeesNft,
      name: "NFT",
      mint_time: "1/1/2023",
      twitter: "twitter.com",
      other_links: ["listing.other_links"],
      added_at: "listing.added_at",
    },
  ];
  return (
    <CollectionCarousel
      title="Upcoming"
      data={
        listings.map((listing) => {
          return {
            image: listing.featured_image,

            imageType: "listing",
            title: listing.name,
            mintAt: listing.mint_time,
            twitterUrl: listing.twitter,
            otherLinks: listing.other_links,
            addedAt: listing.added_at,
          };
        }) as CarouselSlideProps[]
      }
    />
  );
}
