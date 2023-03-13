import { BigNumberish } from "ethers"

// NFT metadata interface
export interface MetadataObj {
  image?: string,
  image_data?: string,
  external_url?: string,
  description?: string,
  name?: string,
  background_color?: string,
  animation_url?: string,
  youtube_url?: string,
  attributes?: Array<{
    trait_type: string,
    value: string | number,
    display_type?: "boost_number" | "boost_percentage" | "number"
  }>
}

// NFT interface (NOT FOR INTERACTION WITH CONTRACT)
export interface Nft {
  tokenId: BigNumberish,
  tokenUri: MetadataObj,
  tokenOwner: string,
  tokenPrice: BigNumberish
}

// NFT Collection interface (NOT FOR INTERACTION WITH CONTRACT)
export interface NftCollection {
  name: string;
  symbol: string;
  description: string;
  uri: string;
  price: string;
  supply: string;
  author: string;
  contractAddress: string;
  nftsInCollection: Array<Nft>;
}

export interface CollectionV2 {
  id: string,
  slug: string,
  title: string,
  thumbnail: string,
  totalItems: number,
  listedCount?: number,
  floorPrice?: string
}