import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BiTrendingUp as TrendingUpIcon,
  BiShoppingBag as ShoppingCartIcon,
  BiTag as TagIcon,
  BiLeaf as HandIcon,
  BiRefresh as RefreshIcon,
  BiMinusCircle as MinusCircleIcon,
} from "react-icons/bi";
import { format, formatDistance } from "date-fns";

import { tokenHistoryRefresh, tradingActivity } from "../api/api";
import {
  ResourceType,
  TokenAPISimple,
  TradingHistoryItem,
  TradingType,
} from "../data/marketplace.pb";
import { classNames } from "../utils/clsx";
import { lamportsToSOL } from "../utils/sol";
import Tooltip from "./tooltip";
import { FakeTradingHistoryItem } from "./fakes/FakeTradingHistoryItem";
import { CircleIcon } from "./icons";
import { addNotification } from "../utils/alert";

function filterHistory(h: TradingHistoryItem) {
  if (h.tradingType === "SALE" || h.tradingType === "OFFER") {
    return true;
  }
  if (
    (h.tradingType === "LISTING" || h.tradingType === "UNLIST") &&
    h.marketplace === "alpha.art"
  ) {
    return true;
  }
  return false;
}

export function Image(props: { src: string; alt?: string }) {
  //https://assets.alpha.art/opt/c/d/cd5215107005896ce88e2b0cc3ce3b9b9340250b/original.png
  if (props.src && props.src.startsWith("https://assets.alpha.art/opt/")) {
    const pp = props.src.split("/");
    const parts = pp.slice(0, pp.length - 1);
    return (
      <div className="rounded-md w-12 h-12 overflow-hidden group-hover:opacity-60 bg-gray-100">
        <picture className="bg-gray-100 w-full h-full">
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
            className="bg-gray-100"
          />
        </picture>
      </div>
    );
  }
  return (
    <img
      src={props.src}
      alt={props.alt}
      width="48"
      height="48"
      className="rounded-md w-12 h-12 bg-gray-100 group-hover:opacity-60"
    />
  );
}

function Chip(props: {
  onClick: () => void;
  isActive: boolean;
  title: string;
  Icon: any;
}) {
  const { title, isActive, Icon } = props;
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={classNames(
        "flex flex-1 ml-1 md:inline-flex items-center px-2 py-1 border border-gray-300 dark:border-zinc-500 shadow-sm text-xs sm:text-sm font-medium rounded-md focus:outline-none ",
        isActive
          ? "bg-gray-600 text-gray-300 dark:text-gray-300 dark:bg-zinc-600"
          : " text-gray-500"
      )}
    >
      <Icon
        className={classNames(
          "flex-shrink-0 mr-1 h-5 w-5 ",
          isActive ? "text-gray-300 dark:text-gray-300" : "text-gray-500"
        )}
      />
      {title}
    </button>
  );
}

const PAGE_SIZE = 20;
let fetchingNextPage = false;
let lastCreatedAt: string | undefined = undefined;
let observer: IntersectionObserver;

const AccountName = function (props: { pubkey?: string, username?: string }) {
  const { pubkey, username } = props
  if (username) {
    return <span>{username}</span>
  }
  if (pubkey) {
    const pubkey_abbr = pubkey.substring(0, 4) + "..." + pubkey.substring(pubkey.length - 4);
    return <span>{pubkey_abbr}</span>
  }
  return <></>
}

export function TradingHistory(props: {
  id: string;
  resourceType: ResourceType;
  title?: string;
  refetch?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { id, title } = props;
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<TradingHistoryItem[]>([]);
  const [tradingTypes, setTradingTypes] = useState<{
    [key in TradingType]: boolean;
  }>(
    props.resourceType === "COLLECTION"
      ? ({ SALE: true } as any)
      : ({ LISTING: true, SALE: true, OFFER: true } as any)
  );
  const [hasNoNext, setHasNoNext] = useState(false);

  useEffect(() => {
    loadData(false);
  }, [id, tradingTypes]);

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting) {
      fetchNextPage();
    }
  };

  const fetchNextPage = () => {
    if (fetchingNextPage || !history.length) {
      return;
    }
    loadData(true);
  };

  const loadData = (fetchMore: boolean) => {
    if (fetchMore) {
      fetchingNextPage = true;
    } else {
      setLoading(true);
      setHasNoNext(false);
      if (scrollRef?.current) {
        scrollRef.current.scrollTop = 0;
      }
      lastCreatedAt = undefined;
    }
    tradingActivity({
      id,
      resourceType: props.resourceType,
      tradingTypes:
        Object.keys(tradingTypes).length > 0
          ? (Object.keys(tradingTypes) as TradingType[])
          : ["LISTING", "SALE", "OFFER"],
      before: fetchMore ? lastCreatedAt : undefined,
      limit: PAGE_SIZE,
      noForeignListing: true,
    }).then(async (res) => {
      const results = res.filter(filterHistory);
      if (res.length === 0) {
        setHasNoNext(true);
        if (fetchMore) {
          fetchingNextPage = false;
        } else {
          setHistory([]);
          setLoading(false);
        }
        return;
      }
      lastCreatedAt = res[res.length - 1].createdAt;

      if (results.length === 0) {
        // Fix this : results being 0 doesn't guarantee that there is no next page
        if (res.length < PAGE_SIZE) {
          setHasNoNext(true);
          if (fetchMore) {
            fetchingNextPage = false;
          } else {
            setHistory([]);
            setLoading(false);
          }
          return;
        } else {
          loadData(fetchMore);
          return;
        }
      }
      if (res.length < PAGE_SIZE) {
        setHasNoNext(true);
      }

      if (fetchMore) {
        setHistory((history) => [...history, ...results]);
        fetchingNextPage = false;
      } else {
        setHistory(results);
        setLoading(false);
      }
    });
  };

  const onRefreshToken = async () => {
    if (props.resourceType === "TOKEN") {
      setLoading(true);
      addNotification(
        "Queued this item for metadata update",
        "Come back in a minute..."
      );
      await tokenHistoryRefresh(id);
    }
    loadData(false);
  };

  const typeClick = (type: TradingType) => {
    return () => {
      setTradingTypes((t) => {
        const tradingType = { ...t };
        if (tradingType[type]) {
          delete tradingType[type];
        } else {
          tradingType[type] = true;
        }
        return tradingType;
      });
    };
  };

  return (
    <div className=" border-gray-200 dark:border-zinc-500">
      <div className="border border-gray-300 dark:border-zinc-500 rounded-tl-md rounded-md">
        <div className="flex p-4 border-b border-gray-300 dark:border-zinc-500 items-center">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 items-center">
              <TrendingUpIcon className="flex-shrink-0 mr-1 h-5 w-5" />
              <h3 className="text-sm font-medium">
                {title || "Trading History"}
              </h3>
              <div className="flex-1" />
              <div className="hidden sm:flex">
                <Chip
                  title="LISTING"
                  Icon={TagIcon}
                  onClick={typeClick("LISTING")}
                  isActive={tradingTypes["LISTING"]}
                />
                <Chip
                  title="SALE"
                  Icon={ShoppingCartIcon}
                  onClick={typeClick("SALE")}
                  isActive={tradingTypes["SALE"]}
                />
                <Chip
                  title="OFFER"
                  Icon={HandIcon}
                  onClick={typeClick("OFFER")}
                  isActive={tradingTypes["OFFER"]}
                />
                {props.resourceType !== "COLLECTION" && (
                  <Chip
                    title="DELIST"
                    Icon={MinusCircleIcon}
                    onClick={typeClick("UNLIST")}
                    isActive={tradingTypes["UNLIST"]}
                  />
                )}
              </div>
              <button
                className="ml-4 sm:ml-8 has-tooltip hover:text-black dark:hover:text-white"
                onClick={onRefreshToken}
                disabled={loading}
              >
                {/*
                <Tooltip
                  text={
                    loading
                      ? "Trading History Reloading"
                      : props.resourceType === "TOKEN"
                      ? "Refresh Trading History and Metadata"
                      : "Refresh Trading History"
                  }
                  className="-mt-12 -ml-20"
                />
                */}
                <RefreshIcon
                  className={classNames(
                    "flex-shrink-0 mr-3 h-5 w-5",
                    loading ? "counterclockwise-spin" : ""
                  )}
                />
              </button>
            </div>
            <div className="sm:hidden flex flex-1 pt-2">
              <Chip
                title="LISTING"
                Icon={TagIcon}
                onClick={typeClick("LISTING")}
                isActive={tradingTypes["LISTING"]}
              />
              <Chip
                title="SALE"
                Icon={ShoppingCartIcon}
                onClick={typeClick("SALE")}
                isActive={tradingTypes["SALE"]}
              />
              <Chip
                title="OFFER"
                Icon={HandIcon}
                onClick={typeClick("OFFER")}
                isActive={tradingTypes["OFFER"]}
              />
              {props.resourceType !== "COLLECTION" && (
                <Chip
                  title="DELIST"
                  Icon={MinusCircleIcon}
                  onClick={typeClick("UNLIST")}
                  isActive={tradingTypes["UNLIST"]}
                />
              )}
            </div>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="relative overflow-y-scroll overflow-x-scroll"
        >
          <div
            style={{
              minWidth: 968,
              maxHeight: "calc(100vh - 200px)",
            }}
          >
            <div className="flex flex-row flex-1 text-sm border-b">
              <div className="p-4 flex-1">Event</div>
              <div className="p-4 flex-1">Item</div>
              <div className="p-4 flex-1">Price</div>
              <div className="p-4 flex-1">From</div>
              <div className="p-4 flex-1">To</div>
              <div className="p-4 flex-1">Date</div>
            </div>
            {loading &&
              Array.from({ length: 20 }, (v, k) => (
                <FakeTradingHistoryItem key={k} />
              ))}
            {!loading && !history.length && (
              <div className="flex flex-col items-center justify-center h-44">
                <TrendingUpIcon className="flex-shrink-0 mr-1 h-9 w-9 mb-2" />
                <span>No trading history yet</span>
              </div>
            )}
            {!loading &&
              !!history.length &&
              history.map((historyItem) => {
                const pk = historyItem.toPubkey!;
                const pkName = historyItem.toName!;
                const user = historyItem.user!;
                const userName = historyItem.userName!;
                const name = historyItem.name!;
                const image = historyItem.image!;
                const price = lamportsToSOL(Number(historyItem.price));
                let priceTxt = `◎ ${price}`;
                if (historyItem.tradingType === "UNLIST") {
                  priceTxt = "";
                } else if (historyItem.tradingType === "OFFER" && price === 0) {
                  priceTxt = "NFT Offer";
                }
                return (
                  <div
                    key={historyItem.signature}
                    className="flex flex-row flex-1 text-sm border-b items-center"
                  >
                    <div className="p-4 flex-1 w-12">
                      <div className="flex flex-row items-center">
                        {historyItem.tradingType === "SALE" && (
                          <ShoppingCartIcon className="flex-shrink-0 mr-3 h-5 w-5" />
                        )}
                        {historyItem.tradingType === "LISTING" && (
                          <TagIcon className="flex-shrink-0 mr-3 h-5 w-5" />
                        )}
                        {historyItem.tradingType === "OFFER" && (
                          <HandIcon className="flex-shrink-0 mr-3 h-5 w-5" />
                        )}
                        {historyItem.tradingType === "UNLIST" && (
                          <MinusCircleIcon className="flex-shrink-0 mr-3 h-5 w-5" />
                        )}
                        <span>
                          {historyItem.tradingType === "UNLIST"
                            ? "DELIST"
                            : historyItem.tradingType}
                        </span>
                        {historyItem.marketplace === "alpha.art" && (
                          <CircleIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex-1 w-24 overflow-hidden overflow-ellipsis">
                      <Link to={"/t/" + historyItem.mintPubkey}>
                        <div className="flex items-center group">
                          <Image src={image} alt={name} />
                          <span className="ml-1 ">{name}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-4 flex-1 w-12"> {priceTxt}</div>
                    <div className="p-4 flex-1 overflow-hidden overflow-ellipsis">
                      <Link to={"/user/" + user}>
                        {userName ? (
                          <AccountName username={userName} />
                        ) : (
                          <AccountName pubkey={user} />
                        )}
                      </Link>
                    </div>
                    <div className="p-4 flex-1  overflow-hidden overflow-ellipsis">
                      {historyItem.tradingType === "SALE" && (
                        <Link to={"/user/" + pk}>
                          {pkName ? (
                            <AccountName username={pkName} />
                          ) : (
                            <AccountName pubkey={pk} />
                          )}
                        </Link>
                      )}
                    </div>

                    <div className="p-4 flex-1 w-12">
                      <a
                        href={
                          "https://explorer.solana.com/tx/" +
                          historyItem.signature
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {/*
                        <Tooltip
                          text={format(
                            new Date(historyItem.createdAt!),
                            "d MMMM yyyy HH:mm"
                          )}
                          className="-mt-12"
                        />
                        */}
                        {formatDistance(
                          new Date(historyItem.createdAt!),
                          new Date(),
                          { addSuffix: true }
                        )}
                      </a>
                    </div>
                  </div>
                );
              })}
            {!!history.length && !loading && !hasNoNext && (
              <div
                ref={(res) => {
                  if (res) {
                    if (observer) {
                      observer.disconnect();
                    }
                    observer = new IntersectionObserver(handleObserver, {
                      root: null,
                      threshold: 0.25,
                      rootMargin: "0px",
                    });
                    observer.observe(res);
                  }
                }}
              >
                <FakeTradingHistoryItem />
                <FakeTradingHistoryItem />
                <FakeTradingHistoryItem />
                <FakeTradingHistoryItem />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
