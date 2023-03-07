import React from "react";
import { Link } from "react-router-dom";
import { classNames } from "../../utils/clsx";
import { useSelector } from "../../api/store";
import { Spinner } from "../spiners";
import { TokenInfo } from "../../data/custom";
import { addNotification } from "../../utils/alert";
import {
  fetchCollectionFloor,
  fetchOffers,
  sendNFTOffer,
} from "../../api/actions";
import OfferExpireDatePicker from "./OfferExpireDatePicker";
import { useAccounts } from "../../utils/useAccounts";
import { getTokenList } from "../../api/api";
import { Collection, TokenAPISimple } from "../../data/marketplace.pb";
import { lamportsToSOL } from "../../utils/sol";

export function TokenOfferTable(props: {
  readonly?: boolean;
  collections: Collection[];
  tokenList: TokenAPISimple[];
  onSelected?: (tokens: string[]) => void;
}) {
  const { tokenList, collections } = props;
  const [selected, setSelected] = React.useState<string[]>([]);
  const { floorPrices } = useSelector((state) => ({
    floorPrices: state.floorPrices,
  }));
  React.useEffect(() => {
    console.log(floorPrices, props.collections);
    props.collections.forEach((c) => {
      if (!floorPrices[c.id!]) {
        fetchCollectionFloor(c.id!);
      }
    });
  }, []);
  return (
    <div className="flex flex-col max-h-80 my-2">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Sale
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Collection Floor
                  </th>
                  {/* <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Collection Avg Sale price
                  </th> */}
                  {!props.readonly && (
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Select</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tokenList.map((token) => {
                  const isSelected = selected.includes(token.mintId!);
                  return (
                    <tr
                      key={token.mintId}
                      className={isSelected ? "bg-gray-100" : ""}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/t/${token.mintId}`} target="_blank">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={token.image}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {token.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {collections.find(
                                  (c) => c.id === token.collectionId
                                )?.title ?? ""}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {"◎" + lamportsToSOL(token.last)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {floorPrices[token.collectionId!]
                            ? "◎" +
                            lamportsToSOL(floorPrices[token.collectionId!])
                            : ""}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {"◎" + lamportsToSOL(token.last)}
                        </div>
                      </td> */}
                      {!props.readonly && (
                        <td className="px-1 py-1 whitespace-nowrap text-right text-sm font-medium">
                          <div className="ml-3 flex items-center h-5">
                            <input
                              name="offer"
                              type="checkbox"
                              disabled={!isSelected && selected.length >= 5}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (selected.length < 5) {
                                    const next = [...selected, token.mintId!];
                                    setSelected(next);
                                    props.onSelected?.(next);
                                  }
                                } else {
                                  const next = selected.filter(
                                    (s) => s !== token.mintId!
                                  );
                                  setSelected(next);
                                  props.onSelected?.(next);
                                }
                              }}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserTokensToOffer(props: {
  pubkey: string;
  readonly?: boolean;
  onSelected?: (tokens: string[]) => void;
}) {
  const { ready, userNFTS } = useAccounts(props.pubkey);
  const [progress, setProgress] = React.useState(true);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [tokenList, setTokenList] = React.useState<TokenAPISimple[]>([]);
  React.useEffect(() => {
    if (!ready) {
      return;
    }
    if (userNFTS.length > 0) {
      setProgress(true);
      getTokenList(props.pubkey, [...userNFTS])
        .then((res) => {
          setCollections(
            (res.collections || []).sort(
              (a, b) => a.title!.localeCompare(b.title!) || 0
            )
          );
          setTokenList(res.tokens ?? []);
          setProgress(false);
        })
        .catch((err) => { });
    } else {
      setProgress(false);
      setTokenList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, userNFTS]);

  if (progress) {
    return (
      <div className="flex flex-col max-h-80 my-2">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg flex items-center justify-center h-80">
              <Spinner size={96} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TokenOfferTable
      collections={collections}
      tokenList={tokenList}
      onSelected={props.onSelected}
      readonly={props.readonly}
    />
  );
}

export function OfferNFT(props: {
  nft: TokenInfo;
  isInProgress: boolean;
  setIsInProgress: (value: boolean) => void;
  onClose: () => void;
}) {
  const { nft } = props;
  const [selected, setSelected] = React.useState<string[]>([]);
  const [endDate, setEndDate] = React.useState(new Date());
  const wallet = useSelector((data) => data.wallet);

  // const onSendOffer = () => {
  //   if (wallet?.publicKey && selected.length > 0) {
  //     // const mintPubkey = new PublicKey(nft.token?.mintPubkey!);
  //     props.setIsInProgress(true);
  //     console.log(endDate);
  //     sendNFTOffer(
  //       "mintPubkey",
  //       endDate,
  //       selected.map((s) => new PublicKey(s))
  //     )
  //       .then((res) => {
  //         addNotification("Offer transaction succesfully completed");
  //         props.onClose();
  //         fetchOffers(mintPubkey.toString());
  //       })
  //       .catch((err) => {
  //         addNotification("Failed to create offer", `${err.message}`, "error");
  //         props.setIsInProgress(false);
  //       });
  //   }
  // };

  const onOfferTokensSelect = (tokens: string[]) => {
    setSelected(tokens);
  };

  return (
    <div className="space-y-6">
      <div className="mt-0">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Offer Expiration
        </label>
        <OfferExpireDatePicker
          endDate={endDate}
          onChange={(date: Date) => setEndDate(date)}
        />
        <UserTokensToOffer
          pubkey={wallet?.publicKey?.toBase58()!}
          onSelected={onOfferTokensSelect}
        />
      </div>

      <div>
        <p className="mb-4 text-sm text-center font-light">
          NFT Escrow service has 0.1 SOL service fee.
        </p>
        {!props.isInProgress && (
          <button
            disabled={selected.length === 0}
            // onClick={onSendOffer}
            className={classNames(
              "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white nightwind-prevent",
              selected.length > 0
                ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                : "bg-indigo-300"
            )}
          >
            Send Offer
          </button>
        )}
        <div className="flex items-center justify-center">
          {props.isInProgress && <Spinner size={64} />}
        </div>
      </div>
    </div>
  );
}
