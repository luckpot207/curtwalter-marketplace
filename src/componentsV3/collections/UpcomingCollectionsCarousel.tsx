import useSWR from "swr";
import { fetcher, marketplaceServerUrl } from "../../lib/utils";
import { CollectionCarousel } from "./CollectionCarousel";
// import {Collection, FetchResponse, ListingApp} from "@piggydao/marketplace-models";
import { CarouselSlideProps } from "./CarouselSlide";

export function UpcomingCollectionsCarousel() {
  // const { data, error } = useSWR<FetchResponse<ListingApp>>(`${marketplaceServerUrl()}/collections/upcoming`,  fetcher)

  // if (!data || !data.data || !(data.data.length > 0)) return null
  return (
    <CollectionCarousel
      title='Upcoming'
      // data={(data.data.map(listing => {
      //   return {
      //     image: listing.featured_image,

      //     imageType: 'listing',
      //     title: listing.name,
      //     mintAt: listing.mint_time,
      //     twitterUrl: listing.twitter,
      //     otherLinks: listing.other_links,
      //     addedAt: listing.added_at
      //   }
      // })) as CarouselSlideProps[]}
      data={{} as CarouselSlideProps[]}
    />
  )
}