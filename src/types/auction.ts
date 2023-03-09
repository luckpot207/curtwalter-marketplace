import { BigNumberish } from "ethers"
// Auction interface (NOT FOR INTERACTION WITH CONTRACT)
export interface AuctionData {
  author: string;
  auctionContractAddr: string;
  nftId: BigNumberish;
  highestBidder: string;
  highestBid: BigNumberish;
  endTime: BigNumberish;
  isActive: boolean;
}