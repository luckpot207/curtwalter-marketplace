import React from "react";
import { Tab } from "@headlessui/react";
import { classNames } from "../utils/clsx";
import { lamportsToSOL } from "../utils/sol";
import Links from "../components/links";
import { BiClipboard as ClipboardListIcon } from "react-icons/bi";
import { useSelector } from "../api/store";
import { controlPrice, getTokenAndEscrow, getTokenList } from "../api/api";
import { Link, useParams } from "react-router-dom";
import Tooltip from "../components/tooltip";
import { TokenInfo } from "../data/custom";
import { SellDialog } from "../components/token/SellDialog";
import { CancelDialog } from "../components/token/CancelDialog";
import { BuyDialog } from "../components/token/BuyDialog";
import { EscrowAndPubKey, OfferAndPubKey } from "../api/app/instructions";
import format from "date-fns/format";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { OfferDialog } from "../components/token/OfferDialog";
import { CancelOfferDialog } from "../components/token/offerCancel";
import {
  AcceptOfferDialog,
  NFTOfferAcceptDialog,
  NFTOfferData,
} from "../components/token/offerAccept";
import { UpdateListingDialog } from "../components/token/UpdateListing";
import FakeTokenPage from "../components/fakes/TokenPage";
import Button from "../components/button";
import { fetchOffers, SetNFT } from "../api/actions";
import AccountName from "../components/accountName";
import useCollection from "../utils/useCollection";
import { Trait } from "../data/metadata.pb";
import {
  Collection,
  CollectionMeta,
  TokenAPISimple,
} from "../data/marketplace.pb";
import { TradingHistory } from "../components/TradingHistory";
import { Helmet } from "react-helmet";
import { addNotification } from "../utils/alert";
import { Spinner } from "../components/spiners";
import { TwitterStyleCollections, ObjectContainCollections } from "../custom";
import { Layout } from "../componentsV3/layout/Layout";
import { useStore } from "../lib/store";
import { useAccounts } from "../utils/useAccounts";

function AccountInfoRow(props: {
  title: string;
  value: string;
  lintToExplorer?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-4">
      <dt className="font-medium">{props.title}</dt>
      <dd className="prose prose-sm max-w-none">
        {props.lintToExplorer ? (
          <a
            href={"https://explorer.solana.com/address/" + props.value}
            target="_blank"
            rel="noreferrer"
          >
            <p>{props.value}</p>
          </a>
        ) : (
          <p>{props.value}</p>
        )}
      </dd>
    </div>
  );
}

function SmallImage(props: { src: string; alt?: string }) {
  //https://assets.alpha.art/opt/c/d/cd5215107005896ce88e2b0cc3ce3b9b9340250b/original.png
  if (props.src.startsWith("https://assets.alpha.art/opt/")) {
    const pp = props.src.split("/");
    const parts = pp.slice(0, pp.length - 1);
    return (
      <picture>
        <source
          type="image/webp"
          srcSet={[
            [...parts, "60.webp"].join("/"),
            [...parts, "120.webp 2x"].join("/"),
          ].join(", ")}
        />
        <img
          loading="lazy"
          src={[...parts, "60.png"].join("/")}
          srcSet={[
            [...parts, "60.png"].join("/"),
            [...parts, "120.png 2x"].join("/"),
          ].join(", ")}
          alt={props.alt}
          className="w-full h-full object-center object-cover group-hover:opacity-60 "
        />
      </picture>
    );
  }
  return (
    <img
      loading="lazy"
      src={props.src}
      alt={props.alt}
      className="w-full h-full object-center object-cover group-hover:opacity-60 "
    />
  );
}

function NFTOfferTokens(props: { tokens: TokenAPISimple[] }) {
  return (
    <div className="flex flex-1 has-tooltip">
      <Tooltip text="Offered NFTs" className="-mt-10" />
      {props.tokens.map((a) => (
        <div
          className={
            "bg-gray-200 rounded-2xl overflow-hidden w-8 h-8 max-h-8 mr-1"
          }
        >
          <SmallImage src={a.image!} alt="" />
        </div>
      ))}
    </div>
  );
}

function TokenImage(props: { nft: TokenInfo }) {
  const { nft } = props;

  const videos =
    props.nft.token?.metadata?.properties?.files?.filter((f) =>
      f.type?.startsWith("video/")
    ) ?? [];
  const frames =
    props.nft.token?.metadata?.properties?.files?.filter(
      (f) => f.type === "text/html"
    ) ?? [];
  if (frames.length >= 1) {
    return (
      <div
        className={classNames(
          "aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
        )}
      >
        <iframe
          src={frames[0].uri}
          title="HTML content"
          sandbox="allow-scripts"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          frameBorder={0}
        />
      </div>
    );
  }
  if (videos?.length >= 1) {
    return (
      <div
        className={classNames(
          "aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
        )}
      >
        <video src={videos[0].uri} muted autoPlay controls loop />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        TwitterStyleCollections.includes(nft.collection?.slug!)
          ? "aspect-w-3 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
          : "aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
      )}
    >
      {!TwitterStyleCollections.includes(nft.collection?.slug!) &&
        typeof nft.token?.optimizedImage === "string" ? (
        <picture>
          <source
            type="image/webp"
            srcSet={nft.token?.optimizedImage.replace(
              "original.png",
              "original.webp"
            )}
          />
          <img
            src={nft.token?.optimizedImage}
            alt={nft.token?.metadata?.description}
            className={
              ObjectContainCollections.includes(nft.collection?.slug!)
                ? "object-center object-contain w-full h-full"
                : "object-center object-cover w-full h-full"
            }
          />
        </picture>
      ) : (
        <img
          src={nft.token?.image}
          alt={nft.token?.metadata?.description}
          className={
            ObjectContainCollections.includes(nft.collection?.slug!)
              ? "object-center object-contain w-full h-full"
              : "object-center object-cover w-full h-full"
          }
        />
      )}
    </div>
  );
}

function OfferRow(props: {
  offer: OfferData;
  showActions: boolean;
  isOwner: boolean;
  setCancelOffer: (offer: OfferData) => void;
  setAcceptOffer: (offer: OfferData) => void;
  viewNFTOffer?: (offer: NFTOfferData) => void;
}) {
  // const wallet = useWallet()
  const [tokens, setTokens] = React.useState<TokenAPISimple[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const { offer, showActions } = props;
  const pk = offer.offer.initializerPubkey.toBase58();
  const isNFTOffer = offer.offer.isNFTOffer;

  React.useEffect(() => {
    if (isNFTOffer) {
      getTokenList(
        undefined,
        props.offer.offer.tokens.map((t) => t.toBase58()),
        true
      )
        .then((res) => {
          setCollections(res.collections ?? []);
          setTokens(res.tokens ?? []);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isNFTOffer, props.offer.pubkey.toBase58()]);

  return (
    <tr className="flex flex-1">
      <td className="py-6 pr-8 px-4 flex-1 flex items-center justify-center">
        {!isNFTOffer && <p>◎ {lamportsToSOL(Number(offer.offer.price))}</p>}
        {isNFTOffer && <NFTOfferTokens tokens={tokens} />}
      </td>
      <td className="has-tooltip py-6 pr-8 p-4 sm:flex items-center justify-center">
        {/*<Tooltip
          text={format(offer.expiresAt, "d MMMM yyyy HH:mm")}
          className="-mt-16"
        />*/}
        <p>
          {offer.isExpired ? "Expired" : formatDistanceToNow(offer.expiresAt)}
        </p>
      </td>
      <td
        className={classNames(
          "py-6 font-medium text-right whitespace-nowrap p-4 flex-1 flex items-center",
          showActions ? "justify-center" : "justify-end"
        )}
        style={{ flex: 3 }}
      >
        <Link to={"/user/" + pk}>
          <AccountName pubkey={pk} />
        </Link>
      </td>
      {/* {showActions && pk === wallet?.publicKey?.toBase58() ? (
        <td className="py-6 pr-1 font-medium text-right whitespace-nowrap flex-1 flex items-center justify-end mr-3">
          <Button
            title="Cancel"
            size="small"
            onClick={() => {
              props.setCancelOffer(offer);
            }}
          />
        </td>
      ) : (
        showActions &&
        props.isOwner && (
          <td className="py-6 pr-1 font-medium text-right whitespace-nowrap flex-1 flex items-center justify-end mr-3">
            <Button
              title={isNFTOffer ? "View" : "Accept"}
              size="small"
              onClick={() => {
                if (isNFTOffer) {
                  props.viewNFTOffer?.({
                    offer: offer.offer,
                    pubkey: offer.pubkey,
                    tokens,
                    collections,
                  });
                } else {
                  props.setAcceptOffer(offer);
                }
              }}
            />
          </td>
        )
      )} */}
    </tr>
  );
}

interface OfferData extends OfferAndPubKey {
  expiresAt: Date;
  isExpired: boolean;
}

function NftOffers(props: {
  nft: TokenInfo;
  isOwner: boolean;
  escrow?: EscrowAndPubKey;
}) {
  const { nft, isOwner } = props;
  // const wallet = useWallet()
  const { nftOffers } = useSelector((state) => ({
    nftOffers: state.nftOffers[nft.token?.mintPubkey!],
  }));
  const [offers, setOffers] = React.useState<OfferData[]>([]);
  const [cancelOffer, setCancelOffer] = React.useState<OfferData | undefined>(
    undefined
  );
  const [acceptOffer, setAcceptOffer] = React.useState<OfferData | undefined>(
    undefined
  );
  const [nftOffer, setNFTOffer] = React.useState<NFTOfferData | undefined>(
    undefined
  );
  const [showActions, setShowActions] = React.useState<boolean>(isOwner);
  React.useEffect(() => {
    fetchOffers(nft.token?.mintPubkey!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nft.token?.mintPubkey]);

  React.useEffect(() => {
    if (nftOffers) {
      const now = Date.now() / 1000;
      setOffers(
        nftOffers
          .map((r) => {
            const expiresAtSec = Number(r.offer.expiresAt.toString(10));
            const expiresAt = new Date(expiresAtSec * 1000);
            return {
              ...r,
              expiresAt: expiresAt,
              isExpired: expiresAtSec < now,
            };
          })
          .sort((a, b) => Number(b.offer.price) - Number(a.offer.price))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftOffers]);

  React.useEffect(() => {
    if (isOwner) {
      setShowActions(true);
      return;
    }
    let sa = false;
    let wall = "wallet?.publicKey?.toBase58()";
    for (const o of offers) {
      if (wall && o.offer.initializerPubkey.toBase58() === wall) {
        sa = true;
      }
    }
    setShowActions(sa);
  }, [isOwner, offers]);

  return (
    <div className="border-t border-gray-200 mt-10 pt-10">
      <div className="border border-gray-300 rounded-tl-md rounded-md">
        <div className="flex p-4 border-b border-gray-300">
          <ClipboardListIcon className="flex-shrink-0 mr-1 h-5 w-5" />
          <h3 className="text-sm font-medium">Offers</h3>
        </div>
        {!offers.length && (
          <div className="flex flex-col items-center justify-center h-44">
            <ClipboardListIcon className="flex-shrink-0 mr-1 h-9 w-9 mb-2" />
            <span>No offers yet</span>
          </div>
        )}
        {!!offers.length && (
          <div>
            <table className="w-full text-gray-500 flex flex-col">
              <caption className="sr-only">Offers</caption>
              <thead className="sr-only text-sm text-left sm:not-sr-only flex flex-1">
                <th
                  scope="col"
                  className="font-normal sm:table-cell p-4 flex-1"
                >
                  Price/NFTs
                </th>
                <th
                  scope="col"
                  className="font-normal sm:table-cell p-4 flex-1"
                >
                  Expiration
                </th>
                <th
                  scope="col"
                  className={classNames(
                    "font-normal p-4 flex-1",
                    showActions ? "text-center" : "text-right"
                  )}
                  style={{ flex: 3 }}
                >
                  From
                </th>
                {showActions && (
                  <th scope="col" className="font-normal text-right p-4 flex-1">
                    Actions
                  </th>
                )}
              </thead>
              <tbody className="border-b border-gray-200 divide-y text-sm sm:border-t w-full flex flex-col max-h-48 overflow-y-scroll">
                {offers.map((offer) => {
                  return (
                    <OfferRow
                      key={offer.pubkey.toBase58()}
                      isOwner={props.isOwner}
                      offer={offer}
                      setAcceptOffer={setAcceptOffer}
                      setCancelOffer={setCancelOffer}
                      showActions={showActions}
                      viewNFTOffer={setNFTOffer}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {typeof cancelOffer !== "undefined" && (
        <CancelOfferDialog
          offer={cancelOffer.offer}
          nftPubKey={nft.token!.mintPubkey!}
          isOpen={typeof cancelOffer !== "undefined"}
          offerAccount={cancelOffer.pubkey}
          lamports={Number(cancelOffer.offer.price)}
          onClose={() => setCancelOffer(undefined)}
        />
      )}
      {typeof acceptOffer !== "undefined" && (
        <AcceptOfferDialog
          nft={nft}
          nftPubKey={nft.token!.mintPubkey!}
          isOpen={typeof acceptOffer !== "undefined"}
          offer={acceptOffer}
          escrowAccount={props.escrow?.pubkey}
          onClose={() => setAcceptOffer(undefined)}
        />
      )}
      {typeof nftOffer !== "undefined" && (
        <NFTOfferAcceptDialog
          nft={nft}
          nftPubKey={nft.token!.mintPubkey!}
          isOpen={typeof nftOffer !== "undefined"}
          data={nftOffer}
          escrowAccount={props.escrow?.pubkey}
          onClose={() => setNFTOffer(undefined)}
        />
      )}
    </div>
  );
}

function NftAttributePercent(props: {
  trait: Trait;
  collectionMeta?: CollectionMeta;
}) {
  const numbers = props.collectionMeta?.traits?.find(
    (tr) => tr.key === props.trait.trait_type && tr.numbers
  )?.numbers;
  if (numbers && numbers.length > 0) {
    const nn = numbers.find((a) => a.value === props.trait.value)?.amount ?? 0;
    const ratio = nn / (props.collectionMeta?.collection?.total_items ?? 1);
    if (ratio > 0) {
      return (
        <p className="mt-1 text-sm">
          {Math.round(ratio * 100 * 10) / 10}%
        </p>
      );
    }
  }
  return null;
}

function NftOtherFiles(props: { nft: TokenInfo }) {
  const images =
    props.nft.token?.metadata?.properties?.files?.filter((f) =>
      f.type?.startsWith("image/")
    ) ?? [];
  if (images?.length < 2) {
    return null;
  }
  return (
    <div className="border-t border-gray-200 mt-8 pt-4 overflow-y-scroll">
      <h3 className="text-sm font-medium text-gray-900">All Files</h3>
      <div className="flex max-h-36">
        {images.map((i) => (
          <img
            key={i.uri}
            src={i.uri}
            alt=""
            className="object-center object-contain h-full max-h-32 mr-2 my-2 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
function NftAttributes(props: { nft: TokenInfo }) {
  const { nft } = props;
  const [collectionMeta, _] = useCollection(nft?.collection?.slug ?? "");
  return (
    <div className="border-t border-gray-200 mt-10 pt-10">
      <div className="flex flex-wrap">
        {nft.token?.metadata?.attributes?.map((att) => {
          const isVisibleTrait = !!collectionMeta?.traits?.find(
            (t) => t.key === att.trait_type
          );
          const body = (
            <div
              key={att.trait_type}
              className="border border-gray-500 rounded-lg pointer-events-none p-2 m-1 w-36"
              aria-hidden="true"
            >
              <p className="text-base font-medium">
                {att.trait_type}
              </p>
              <p className="mt-1 text-sm">{att.value}</p>
              {/*
              <NftAttributePercent
                trait={att}
                collectionMeta={collectionMeta}
              />*/}
            </div>
          );
          if (isVisibleTrait) {
            return (
              <Link
                key={"link_" + att.trait_type}
                to={`/collection/${nft?.collection?.slug}?${encodeURIComponent(
                  att.trait_type!
                )}=${encodeURIComponent(att.value!)}&Status=-BUY_NOW`}
              >
                {body}
              </Link>
            );
          } else {
            return body;
          }
        })}
      </div>
    </div>
  );
}
function NftTabInfo(props: { nft: TokenInfo }) {
  const { nft } = props;
  return (
    <div className="w-full max-w-2xl mx-auto mt-16 mb-8 lg:max-w-none lg:mt-0 lg:col-span-4">
      <Tab.Group as="div">
        <div className="border-b border-gray-200 dark:border-zinc-400 mb-3">
          <Tab.List className="-mb-px flex space-x-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? "border-gray-600 dark:border-white"
                    : "border-transparent",
                  "whitespace-nowrap py-6 border-b-2 font-medium text-sm"
                )
              }
            >
              About {nft.collection?.title}
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? "border-gray-600 dark:border-white"
                    : "border-transparent",
                  "whitespace-nowrap py-6 border-b-2 font-medium text-sm"
                )
              }
            >
              Account Details
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels as={React.Fragment}>
          <Tab.Panel className="pt-2">
            <h3 className="sr-only">License</h3>
            <p className="text-base -mt-3">
              {nft.collection?.description}
            </p>
            <Links
              links={nft.collection?.links!}
              name={nft.token?.metadata?.name}
            />
          </Tab.Panel>
          <Tab.Panel as="dl" className="text-sm">
            <h3 className="sr-only">Frequently Asked Questions</h3>
            <AccountInfoRow
              title="Update Authority"
              value={nft.collection?.authorityPubkey!}
              lintToExplorer
            />
            <AccountInfoRow
              title="Token Address"
              value={nft.token?.mintPubkey!}
              lintToExplorer
            />
            <AccountInfoRow title="Collection" value={nft.collection?.title!} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

type ModalDialog =
  | "none"
  | "connect"
  | "sell"
  | "update"
  | "unlist"
  | "buy"
  | "offer"
  | "nftOffer"
  | "cancelOffer"
  | "acceptOffer";

function NFTButtons(props: {
  nft: TokenInfo;
  escrow?: EscrowAndPubKey;
  isOwner: boolean;
  disabled?: boolean;
  priceDate?: Date;
  refetch?: () => void;
}) {
  const { nft, isOwner } = props;
  const [dialog, setDialog] = React.useState<ModalDialog>("none");
  const {
    headerWalletMenuShow,
    setHeaderWalletMenuShow,
    headerMobileMenuShow,
    setHeaderMobileMenuShow,
    setHeaderBackDropShow,
    headerBackDropShow,
    headerSearchOnMobileShow,
    setHeaderSearchOnMobileShow,
    setHeaderSearchFocus
  } = useStore()

  if (isOwner) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 nightwind-prevent-block">
        {props.escrow ? (
          <>
            <button
              type="button"
              disabled={props.disabled}
              onClick={() => setDialog("unlist")}
              className="w-full bg-gray-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
            >
              Delist
            </button>
            {/*
            <button
              type="button"
              disabled={props.disabled}
              onClick={() => setDialog("update")}
              className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
            >
              Update Price
            </button>
            */}
          </>
        ) : (
          <button
            disabled={props.disabled || !props.nft.collection?.verified}
            type="button"
            onClick={() => setDialog("sell")}
            className="w-full bg-gray-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
          >
            Sell
          </button>
        )}
        {dialog === "sell" && (
          <SellDialog
            isOwner={isOwner}
            nft={nft}
            isOpen={dialog === "sell"}
            onClose={() => setDialog("none")}
            refetch={props.refetch}
          />
        )}
        {dialog === "unlist" && (
          <CancelDialog
            nft={nft}
            escrowAccount={props.escrow?.pubkey}
            isOpen={dialog === "unlist"}
            onClose={() => setDialog("none")}
            refetch={props.refetch}
          />
        )}
        {dialog === "update" && (
          <UpdateListingDialog
            nft={nft}
            escrow={props.escrow!}
            isOpen={dialog === "update"}
            onClose={() => setDialog("none")}
            refetch={props.refetch}
          />
        )}
      </div>
    );
  } else {
    return (
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 nightwind-prevent-block">
        {props.escrow && (
          <button
            type="button"
            disabled={!props.nft.collection?.verified}
            className={classNames(
              "w-full border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500",
              props.nft.collection?.verified
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-gray-100"
            )}
            onClick={() => {
              if (props.disabled) {
                setHeaderBackDropShow(!headerBackDropShow)
                setHeaderWalletMenuShow(!headerWalletMenuShow)
              } else {
                setDialog("buy");
              }
            }}
          >
            Buy Now
          </button>
        )}
        <button
          type="button"
          disabled={!props.nft.collection?.verified}
          onClick={() => {
            if (props.disabled) {
              setHeaderBackDropShow(!headerBackDropShow)
              setHeaderWalletMenuShow(!headerWalletMenuShow)
            } else {
              setDialog("offer");
            }
          }}
          className={classNames(
            "w-full bg-gray-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 ",
            typeof nft.owner !== "undefined"
              ? "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
              : "has-tooltip "
          )}
        >
          Make SOL Offer
        </button>

        {/*
        <button
          type="button"
          disabled={!props.nft.collection?.verified}
          onClick={() => {
            if (props.disabled) {
              setDialog("connect");
            } else {
              setDialog("nftOffer");
            }
          }}
          className={classNames(
            "w-full bg-indigo-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-indigo-700 ",
            typeof nft.owner !== "undefined"
              ? "hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
              : "has-tooltip "
          )}
        >
          Make NFT Offer
        </button>
        */}

        {(dialog === "offer" || dialog === "nftOffer") &&
          props.nft.collection?.verified === true && (
            <OfferDialog
              nft={nft}
              defaultPage={dialog === "offer" ? "sol" : "nft"}
              isOpen={dialog === "offer" || dialog === "nftOffer"}
              onClose={() => setDialog("none")}
            />
          )}
        {dialog === "buy" && props.nft.collection?.verified === true && (
          <BuyDialog
            nft={nft}
            escrow={props.escrow?.escrow!}
            escrowAccount={props.escrow?.pubkey!}
            isOpen={dialog === "buy"}
            priceDate={props.priceDate}
            onClose={() => setDialog("none")}
            refetch={props.refetch}
          />
        )}
      </div>
    );
  }
}

export default function Token() {
  const { pubkey } = useParams<{ pubkey: string }>();
  // const wallet = useWallet()
  // const isConnected = wallet.connected

  // const { userNFTS } = useAccounts(wallet?.publicKey?.toString());

  const [currentOwner, setCurrentOwner] = React.useState<string | undefined>(
    undefined
  );
  const [priceDate, setPriceDate] = React.useState<Date | undefined>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [nft, setNFT] = React.useState<TokenInfo | undefined>(undefined);
  const [escrow, setEscrow] = React.useState<EscrowAndPubKey | undefined>(
    undefined
  );
  const [isOwner, setIsOwner] = React.useState(false);
  // const fetchTokenData = (pubkey: string) => {
  //   getTokenAndEscrow(pubkey, (token) => {
  //     setNFT(token);
  //     if (wallet && wallet?.publicKey && userNFTS.includes(pubkey)) {
  //       setCurrentOwner(wallet.publicKey.toBase58());
  //     } else {
  //       setCurrentOwner(token.token?.currentOwner);
  //     }
  //   }).then(([token, escrowdata]) => {
  //     setNFT(token);
  //     setEscrow(escrowdata);
  //     if (escrowdata) {
  //       setPriceDate(new Date());
  //       setCurrentOwner(escrowdata.escrow.initializerPubkey.toBase58());
  //     } else if (wallet && wallet?.publicKey && userNFTS.includes(pubkey)) {
  //       setCurrentOwner(wallet.publicKey.toBase58());
  //     } else {
  //       setCurrentOwner(token.token?.currentOwner);
  //     }
  //     setIsLoading(false);
  //     let check = escrow && !token.listing;
  //     if (escrowdata && token.listing) {
  //       if (Number(escrowdata.escrow.price) !== Number(token.listing.price)) {
  //         check = true;
  //       }
  //     }
  //     if (check && escrowdata) {
  //       addNotification("Checking price again");
  //       controlPrice(escrowdata.pubkey);
  //     }
  //   });
  // };

  React.useEffect(() => {
    // fetchTokenData(pubkey!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {
  //   if (userNFTS.includes(pubkey!)) {
  //     setIsOwner(true);
  //   } else if (nft && escrow && wallet) {
  //     const walletPubKey = wallet.publicKey?.toBase58();
  //     setIsOwner(walletPubKey === escrow.escrow.initializerPubkey.toBase58());
  //   } else if (nft && wallet) {
  //     const walletPubKey = wallet.publicKey?.toBase58();
  //     setIsOwner(walletPubKey === nft.token?.currentOwner);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nft, escrow, wallet, userNFTS]);

  React.useEffect(() => {
    if (nft) {
      SetNFT(nft);
    }

    return () => {
      SetNFT({});
    };
  }, [nft]);

  if (!nft) {
    return <FakeTokenPage />;
  }

  return (
    <Layout disableFlex={true}>
      <Helmet>
        <title>
          Alpha.art |{" "}
          {nft.token?.metadata?.name ?? nft.collection?.title ?? "NFT"}
        </title>
        <meta
          property="og:title"
          content={`Alpha Art | ${nft.token?.metadata?.name}`}
        />
        <meta property="og:description" content={nft.collection?.description} />
        <meta
          property="og:image"
          content={nft.token?.optimizedImage ?? nft.token?.image}
        />
        <meta property="og:url" content={`https://alpha.art/t/${pubkey}`} />
        <meta
          name="twitter:title"
          content={`Alpha Art | ${nft.token?.metadata?.name}`}
        />
        <meta
          name="twitter:description"
          content={nft.collection?.description}
        />
        <meta
          name="twitter:image"
          content={nft.token?.optimizedImage ?? nft.token?.image}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlphaArtMarket" />
      </Helmet>
      <div className="mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:row-end-1 lg:col-span-4">
            <TokenImage nft={nft} />
          </div>

          {/* Product details */}
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mx-0 lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4">
            <div className="flex flex-col-reverse">
              <div className="mt-2">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {nft.token?.metadata?.name}
                </h1>

                <h2 id="information-heading" className="sr-only">
                  Token information
                </h2>
                {/*
                <Link to={"/user/" + currentOwner}>
                  <p className="text-sm mt-2">
                    Owned by{" "}
                    <AccountName pubkey={currentOwner!} user={nft.owner} />
                  </p>
                </Link>
                */}
              </div>

              <div>
                <Link to={"/collection/" + nft.collection?.slug}>
                  <p className="text-sm mt-2">
                    {nft.collection?.title}
                  </p>
                </Link>
              </div>
            </div>

            {isLoading ? (
              <Spinner className="mt-8" />
            ) : (
              <>
                {escrow && (
                  <>
                    <p className="mt-6 text-sm">Current Price:</p>
                    <p className="mt-2 text-3xl font-bold">
                      ◎ {lamportsToSOL(Number(escrow.escrow.price))}
                    </p>
                  </>
                )}
                <NFTButtons
                  nft={nft}
                  escrow={escrow}
                  isOwner={isOwner}
                  // disabled={!wallet || !isConnected}
                  priceDate={priceDate}
                // refetch={() => {
                //   setNFT(undefined);
                //   fetchTokenData(pubkey!);
                // }}
                />
              </>
            )}

            <NftAttributes nft={nft} />
            <NftOffers nft={nft} isOwner={isOwner} escrow={escrow} />
          </div>

          <NftTabInfo nft={nft} />
        </div>
        <NftOtherFiles nft={nft} />
        <div
          className="border-t border-gray-200 mt-16 pt-10"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          <TradingHistory resourceType="TOKEN" id={pubkey!} />
        </div>
      </div>
    </Layout>
  );
}
