import { useEffect, useState } from "react";
// import { useSelector } from "../../api/store";
import { Link } from "react-router-dom";
// import { nFormatter } from "../collectionHeader";
import solanaLogo from "../solana.svg";
import { Image, imageProxyUrl } from "../componentsV3/image/Image";
import { CollectionV2 } from "../types/nft";
import { useContract, useSigner } from "wagmi";
import { NftABI } from "../utils/abi";
import useMarketplaceContract from "../hooks/useMarketplaceContract";
import { ethers } from "ethers";
import { Marketplace } from "../typechain-types";

export function AuctionCard({
  auction,
  sold,
}: {
  auction: Marketplace.AuctionOutputStructOutput;
  sold?: boolean;
}) {
  const { data: signer } = useSigner();
  const nftContract = useContract({
    address: auction.contractAddress,
    abi: NftABI,
    signerOrProvider: signer,
  });
  const { allSales, auctionBid } = useMarketplaceContract();
  const [title, setTitle] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const getThumbnail = async () => {
    if (!nftContract) return;

    const data = await fetch(auction.tokenUri).then((res) => res.json());
    console.log("tokenUri", data);
    setThumbnail(data.image);
    setTitle(data.name);
    setPrice(ethers.utils.formatEther(auction.highestBid));
  };

  // const handleBid= () => {
  //   auctionBid
  // }
  useEffect(() => {
    if (nftContract) getThumbnail();
  }, [nftContract, allSales]);
  // const [collection, setCollection] = React.useState(props.collection);
  const darkMode = false; //useSelector((data) => data.darkMode);

  return (
    <li
      className={`w-full inline-flex flex-col text-center bg-gray-200 dark:bg-zinc-800 rounded-3xl p-4 border-1 hover:border-gray-300 dark:hover:border-zinc-500`}
    >
      <div className="group relative h-full flex flex-col justify-between">
        <div className="w-full bg-gray-200 rounded-2xl overflow-hidden aspect-w-1 aspect-h-1">
          <Image
            src={imageProxyUrl(thumbnail, "collection")}
            alt={title}
            size="xs"
            className={`w-full h-full object-center object-cover group-hover:opacity-75 `}
          />
        </div>
        <div className="mt-2">
          <h3 className="mt-2 font-semibold lines-1 mb-2">
            <span className="absolute inset-0 " />
            {title}
          </h3>
          <div
            className={`bg-white dark:bg-zinc-900 items-number-box-shadow text-sm w-full font-semibold rounded-2xl py-2 flex px-3 ${
              sold ? "justify-center" : "justify-between"
            }`}
          >
            {sold ? (
              "Sold"
            ) : (
              <>
                <p className="flex">
                  Floor:{" "}
                  <img
                    className="inline mx-1"
                    style={{ width: "12px" }}
                    src={solanaLogo}
                  />{" "}
                  {/* {nFormatter(lamportsToSOL(collection.floorPrice ?? 0), 2)} */}
                </p>
                <p className="flex">{price}</p>
              </>
            )}
          </div>
          <div className="w-full">
            <p className="flex text-center">
              {auction.highestBidder.slice(2, 6) +
                "........................................." +
                auction.highestBidder.slice(20, 24)}
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
              onClick={() => {}}
            >
              Bid
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
