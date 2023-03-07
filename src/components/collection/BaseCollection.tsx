import { BaseCollectionData } from "../../data/collection";
import React from "react";
// import { useSelector } from "../../api/store";
import { Link } from "react-router-dom";
// import { nFormatter } from "../collectionHeader";
import { lamportsToSOL } from "../../utils/sol";
import solanaLogo from "../../solana.svg";
import { Image, imageProxyUrl } from "../../componentsV3/image/Image";

export function BaseCollection(props: {
  collection: BaseCollectionData;
  sold?: boolean;
}) {
  const [collection, setCollection] = React.useState(props.collection);
  const darkMode = false; //useSelector((data) => data.darkMode);

  return (
    <li
      key={collection.id}
      className={`w-full inline-flex flex-col text-center bg-gray-200 dark:bg-zinc-800 rounded-3xl p-4 border-1 hover:border-gray-300 dark:hover:border-zinc-500`}
    >
      <div className="group relative h-full flex flex-col justify-between">
        <div className="w-full bg-gray-200 rounded-2xl overflow-hidden aspect-w-1 aspect-h-1">
          <Image
            src={imageProxyUrl(collection.thumbnail, "collection")}
            alt={collection.title}
            size="xl"
            className={`w-full h-full object-center object-cover group-hover:opacity-75 ${
              props.sold ? "opacity-50" : ""
            }`}
          />
        </div>
        <div className="mt-2">
          <h3 className="mt-2 font-semibold lines-1 mb-2">
            <Link to={`/collection/${collection.slug}`}>
              <span className="absolute inset-0 " />
              {collection.title}
            </Link>
          </h3>
          <div
            className={`bg-white dark:bg-zinc-900 items-number-box-shadow text-sm w-full font-semibold rounded-2xl py-2 flex px-3 ${
              props.sold ? "justify-center" : "justify-between"
            }`}
          >
            {props.sold ? (
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
