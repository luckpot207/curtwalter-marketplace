import useSWR from "swr";
import { fetcher, marketplaceServerUrl } from "../../lib/utils";
import { CollectionCarousel } from "./CollectionCarousel";
// import { Collection, FetchResponse } from "@piggydao/marketplace-models";
import { CarouselSlideProps } from "./CarouselSlide";

export function NewCollectionsCarousel() {
  // const { data, error } = useSWR<FetchResponse<Collection>>(`${marketplaceServerUrl()}/collections/new`, fetcher)

  // if (!data || !data.data || !(data.data.length > 0)) return null
  return (
    <CollectionCarousel
      title='New'
      // data={
      //   (data.data.map(collection => {
      //   return {
      //     image: collection.thumbnail,
      //     imageType: 'collection',
      //     title: collection.title,
      //     url: `/collection/${collection.slug}`,
      //     floorPrice: collection.floor_price,
      //     listed: collection.listed_count,
      //     addedAt: collection.added_at
      //   }
      // })) as CarouselSlideProps[]}
      data={{} as CarouselSlideProps[]}
    />
  )
}