import { BaseCollectionData } from "../../data/collection";
import React, { useEffect, useState } from "react";
// import { useSelector } from "../../api/store";
import { Link } from "react-router-dom";
// import { nFormatter } from "../collectionHeader";
import { lamportsToSOL } from "../../utils/sol";
import solanaLogo from "../../solana.svg";
import { Image, imageProxyUrl } from "../../componentsV3/image/Image";
import { CollectionV2 } from "../../types/nft";
import { useContract, useSigner, useContractRead } from "wagmi";
import { NFT_ABI } from "../../utils/abi";
import useMarketplaceContract from "../../hooks/useMarketplaceContract";

export function BaseCollection({
  collection,
  sold,
}: {
  collection: CollectionV2;
  sold?: boolean;
}) {
  const { data: signer } = useSigner();
  const nftContract = useContract({
    address: collection.slug,
    abi: NFT_ABI,
    signerOrProvider: signer,
  });
  const { allSales } = useMarketplaceContract();
  const [title, setTitle] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string>("");

  const getThumbnail = async () => {
    if (!nftContract) return;
    const nfts = allSales.filter(
      (sale) => sale.nftContractAddr == collection.slug
    );
    const tokenUri = await nftContract.tokenURI(nfts[0].tokenId);
    const data = await fetch(tokenUri).then((res) => res.json());
    // console.log("tokenUri", data);
    setThumbnail(data.image);
    setTitle(data.name);
  };

  useEffect(() => {
    if (nftContract) getThumbnail();
  }, [nftContract, allSales]);
  // const [collection, setCollection] = React.useState(props.collection);
  const darkMode = false; //useSelector((data) => data.darkMode);

  return (
    <li
      key={collection.id}
      className={`w-full inline-flex flex-col text-center bg-gray-200 dark:bg-zinc-800 rounded-3xl p-4 border-1 hover:border-gray-300 dark:hover:border-zinc-500`}
    >
      <div className="group relative h-full flex flex-col justify-between">
        <div className="w-full bg-gray-200 rounded-2xl overflow-hidden aspect-w-1 aspect-h-1">
          <Image
            src={imageProxyUrl(thumbnail, "collection")}
            alt={title}
            size="xs"
            className={`w-full h-full object-center object-cover group-hover:opacity-75 ${
              sold ? "opacity-50" : ""
            }`}
          />
        </div>
        <div className="mt-2">
          <h3 className="mt-2 font-semibold lines-1 mb-2">
            <Link to={`/collection/${collection.slug}`}>
              <span className="absolute inset-0 " />
              {title}
            </Link>
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
                  10
                </p>
                <p className="">Listed: {collection.listedCount}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
