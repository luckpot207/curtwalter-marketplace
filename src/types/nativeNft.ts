import { BigNumber } from "ethers";
import { NFT_STATUS } from "../utils/enums";

export interface NativeNft {
  tokenId: BigNumber;
  name: string;
  description: string;
  attributes: Attribute[]
  image: string;
  price: BigNumber;
  owner: string;
  status: NFT_STATUS;
}

export interface Attribute {
  trait_type: string
  value: number
}