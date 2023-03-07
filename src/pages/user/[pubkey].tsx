import React, { Fragment, useState } from "react";
import { useSelector } from "../../api/store";
import { getTokenList } from "../../api/api";
import { addNotification } from "../../utils/alert";
import { useLocation, useParams } from "react-router-dom";

import { Collection, TokenAPISimple } from "../../data/marketplace.pb";
import { FakeSimpleTokenList } from "../../components/fakes/FakeSimpleTokenList";
import AccountName from "../../components/accountName";
import {
  BiArrowToBottom as ArrowDownIcon,
  BiArrowFromBottom as ArrowUpIcon,
  BiCheck as CheckIcon,
  BiSelection as SelectorIcon,
  BiShoppingBag as ShoppingBagIcon,
  BiTrendingUp as TrendingUpIcon,
} from "react-icons/bi";
import { classNames } from "../../utils/clsx";
import { TradingHistory } from "../../components/TradingHistory";
import { Listbox, Transition } from "@headlessui/react";
import { Helmet } from "react-helmet";
import { useAccounts } from "../../utils/useAccounts";
import { TokenListing } from "../../user/TokenListing";
import Profile from "../../user/Profile";
import { Layout } from "../../componentsV3/layout/Layout";

const comparePrices = (a: TokenAPISimple, b: TokenAPISimple) =>
  (Number(b.price) || 0) - (Number(a.price) || 0);

type Tab = "nfts" | "offersReceived" | "offersMade" | "history" | "settings";

const tabs = [
  {
    key: "nfts",
    title: (isCurrentUser: boolean) =>
      isCurrentUser ? "My Wallet" : "Wallet",
  },
  {
    key: "offersMade",
    title: (isCurrentUser: boolean) =>
      isCurrentUser ? "My Offers" : "Offers Made",
  },
  { key: "offersReceived", title: "Received Offers" },
  { key: "history", title: "Activity" },
  { key: "settings", title: "Settings" },
] as { key: Tab; title: string | ((isCurrentUser: boolean) => string) }[];

function useProfileTabs(isCurrentUser: boolean): [Tab, (tab: Tab) => void] {
  const location = useLocation();
  const [tab, _selectTab] = useState<Tab>("nfts");

  const selectTab = (tab: Tab) => {
    window.history.replaceState(null, window.document.title, "?tab=" + tab);
    _selectTab(tab);
  };

  React.useEffect(() => {
    const query = new URLSearchParams(location.search);
    const queryTab = query.get("tab");
    const validTab = tabs.find((t) => t.key === queryTab);
    if (queryTab && validTab && (queryTab !== "settings" || isCurrentUser)) {
      selectTab(validTab.key);
    } else if (queryTab === "settings" && !isCurrentUser) {
      selectTab("nfts");
    } else {
      window.history.replaceState(null, window.document.title, "?tab=" + tab);
    }
  }, [location, isCurrentUser]);

  return [tab, selectTab];
}

export default function User() {
  const { pubkey } = useParams<{ pubkey: string }>();
  // const wallet = useWallet()
  const { user } = useSelector((data) => ({
    user: data.user,
  }));
  const {
    userNFTS,
    escrowAccounts: escrows,
    offerAccounts: offers,
    ready,
  } = useAccounts(pubkey!);
  const [tokenList, setTokenList] = React.useState<TokenAPISimple[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [offerTokenList, setOfferTokenList] = React.useState<TokenAPISimple[]>([]);
  const [receivedOfferTokenList, setReceivedOfferTokenList] = React.useState<TokenAPISimple[]>([]);
  const [progress, setProgress] = React.useState(true);

  const isCurrentUser = pubkey === "wallet?.publicKey?.toBase58()";
  const [tab, selectTab] = useProfileTabs(isCurrentUser);

  React.useEffect(() => {
    setProgress(true);
    setTokenList([]);
    setOfferTokenList([]);
    setReceivedOfferTokenList([]);
  }, [pubkey]);

  React.useEffect(() => {
    if (!ready) {
      return;
    }
    const ownedByUser = [...userNFTS];
    const nfts = [...userNFTS];
    const offerMints: string[] = [];
    for (const e of escrows) {
      const m = e.escrow.mintId.toBase58();
      nfts.push(m);
      ownedByUser.push(m);
    }
    for (const e of offers) {
      const m = e.offer.mintId.toBase58();
      nfts.push(m);
      offerMints.push(m);
    }
    if (nfts.length > 0) {
      setProgress(true);
      getTokenList(pubkey, nfts)
        .then((res) => {
          res.tokens
            ?.sort((a, b) => Number(b.last ?? 0) - Number(a.last ?? 0))
            .sort(comparePrices);

          const ownedTokens =
            res.tokens?.filter((t) => ownedByUser.includes(t.mintId!)) ?? [];

          setCollections(
            (res.collections || []).sort(
              (a, b) => a.title!.localeCompare(b.title!) || 0
            )
          );
          setTokenList(ownedTokens);

          setOfferTokenList(
            res.tokens?.filter((t) => offerMints.includes(t.mintId!)) ?? []
          );

          setReceivedOfferTokenList(
            ownedTokens?.filter((t) => !!t.offerPrice) ?? []
          );
          setProgress(false);
        })
        .catch((err) => {
          addNotification(
            "Unable to fetch token list",
            `${err.message}`,
            "error"
          );
          console.error(err);
          setProgress(false);
        });
    } else {
      setProgress(false);
      setTokenList([]);
      setOfferTokenList([]);
      setReceivedOfferTokenList([]);
    }
  }, [ready, userNFTS, escrows, offers]);

  const getCurrentTabTitle = () => {
    const tt = tabs.find((t) => t.key === tab)?.title;
    return typeof tt === "function" ? tt(isCurrentUser) : tt;
  };

  return (
    <Layout>
      <div className="h-screen flex flex-col w-full max-h-screen">
        <Helmet>
          <title>Alpha.art | Account</title>
        </Helmet>
        <div className="flex flex-row flex-1 h-screen w-full">
          <div className="flex flex-col border-0 sm:border-r  border-gray-200 dark:border-zinc-600 pt-8 pb-4">
            <div className="hidden sm:flex w-32 sm:w-48 lg:w-96 flex-grow flex-col">
              <nav
                className="flex-1 px-2 space-y-8"
                aria-label="Sidebar"
              >
                <div className="space-y-1">
                  <div className="mb-5 ml-2 text-lg">
                    <AccountName pubkey={pubkey!} />
                  </div>
                  <button
                    onClick={() => selectTab("nfts")}
                    className={classNames(
                      tab === "nfts"
                        ? "bg-gray-100 text-gray-900 dark:bg-zinc-600 dark:text-white"
                        : "",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                    )}
                  >
                    <ShoppingBagIcon
                      className={classNames(
                        tab === "nfts"
                          ? "text-gray-900 dark:text-white"
                          : "",
                        "mr-3 flex-shrink-0 h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    {"NFTs"}
                  </button>
                  <button
                    onClick={() => selectTab("offersMade")}
                    className={classNames(
                      tab === "offersMade"
                        ? "bg-gray-100 text-gray-900 dark:bg-zinc-600 dark:text-white"
                        : "",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                    )}
                  >
                    <ArrowUpIcon
                      className={classNames(
                        tab === "offersMade"
                          ? "text-gray-900 dark:text-white"
                          : "",
                        "mr-3 flex-shrink-0 h-6 w-6 transform rotate-45"
                      )}
                      aria-hidden="true"
                    />
                    {isCurrentUser ? "My Offers" : "Offers Made"}
                  </button>
                  <button
                    onClick={() => selectTab("offersReceived")}
                    className={classNames(
                      tab === "offersReceived"
                        ? "bg-gray-100 text-gray-900 dark:bg-zinc-600 dark:text-white"
                        : "",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                    )}
                  >
                    <ArrowDownIcon
                      className={classNames(
                        tab === "offersReceived"
                          ? "text-gray-900 dark:text-white"
                          : "",
                        "mr-3 flex-shrink-0 h-6 w-6 transform -rotate-45"
                      )}
                      aria-hidden="true"
                    />
                    {"Received Offers"}
                  </button>
                  <button
                    onClick={() => selectTab("history")}
                    className={classNames(
                      tab === "history"
                        ? "bg-gray-100 text-gray-900 dark:bg-zinc-600 dark:text-white"
                        : "",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                    )}
                  >
                    <TrendingUpIcon
                      className={classNames(
                        tab === "history"
                          ? "text-gray-900 dark:text-white"
                          : "",
                        "mr-3 flex-shrink-0 h-6 w-6 transform"
                      )}
                      aria-hidden="true"
                    />
                    {"Activity"}
                  </button>
                  {/* {isCurrentUser && (
                    <button
                      onClick={() => selectTab("settings")}
                      className={classNames(
                        tab === "settings"
                          ? "bg-gray-100 text-gray-900 dark:bg-zinc-600 dark:text-white"
                          : "",
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
                      )}
                    >
                      <UserCircleIcon
                        className={classNames(
                          tab === "settings"
                            ? "text-gray-900 dark:text-white"
                            : "",
                          "mr-3 flex-shrink-0 h-6 w-6 transform"
                        )}
                        aria-hidden="true"
                      />
                      {tabs[4].title}
                    </button>
                  )} */}
                </div>
              </nav>
            </div>
          </div>

          <div className="flex flex-1 flex-col w-full overflow-y-scroll">
            <div className="flex flex-1 flex-col">
              <div className="w-full sm:hidden">
                <div className="sm:hidden mt-12 flex flex-col">
                  <div className="mb-5 ml-4 text-2xl">
                    <AccountName pubkey={pubkey!} />
                  </div>
                  <Listbox value={tab} onChange={selectTab}>
                    <div className="m-4 mt-1 relative">
                      <Listbox.Button className="relative w-full border bg-white dark:bg-zinc-600 text-black dark:text-gray-300 border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none sm:text-sm">
                        <span className="block truncate">
                          {getCurrentTabTitle()}
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <SelectorIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-600 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {tabs
                            .slice(
                              0,
                              isCurrentUser ? tabs.length : tabs.length - 1
                            )
                            .map((tab) => (
                              <Listbox.Option
                                key={tab.key}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-gray-600 dark:text-white"
                                      : "text-gray-600 dark:text-white",
                                    "cursor-pointer relative py-2 pl-3 pr-9"
                                  )
                                }
                                value={tab.key}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate"
                                      )}
                                    >
                                      {typeof tab.title === "function"
                                        ? tab.title(isCurrentUser)
                                        : tab.title}
                                    </span>

                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-white",
                                          "absolute inset-y-0 right-0 flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
              </div>

              <div className="sm:py-8 sm:px-6 w-full lg:max-w-7xl ">
                <div className="flex flex-1 sm:px-6 lg:px-8 w-full">
                  <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-6 w-full">
                    {tab !== "history" && progress ? (
                      <div>
                        <div className="mb-8 h-8 w-96 overflow-hidden bg-gray-200 rounded-sm" />
                        <FakeSimpleTokenList count={16} />
                      </div>
                    ) : (
                      <>
                        {tab === "nfts" && (
                          <TokenListing
                            collections={collections}
                            tokens={tokenList}
                            title={
                              <>
                                <AccountName pubkey={pubkey!} />
                                {"'s NFTs"}{" "}
                              </>
                            }
                            emptyText={"There is no token in the account"}
                            showField={"lastPrice"}
                            isLoading={progress}
                          />
                        )}
                        {tab === "offersMade" && (
                          <TokenListing
                            collections={collections}
                            tokens={offerTokenList}
                            title={
                              isCurrentUser ? (
                                "My Offers"
                              ) : (
                                <>
                                  <AccountName pubkey={pubkey!} />
                                  {"'s Offers"}{" "}
                                </>
                              )
                            }
                            isLoading={progress}
                            showField={"offerPrice"}
                            emptyText={"There is no active offer"}
                            showCancelOffer={isCurrentUser}
                            offers={offers}
                          />
                        )}
                        {tab === "offersReceived" && (
                          <TokenListing
                            tokens={receivedOfferTokenList}
                            title={
                              isCurrentUser ? (
                                "Received Offers"
                              ) : (
                                <>
                                  <AccountName pubkey={pubkey!} />
                                  {"'s Received Offers"}{" "}
                                </>
                              )
                            }
                            emptyText={"There is no active offer"}
                            showField={"offerPrice"}
                            isLoading={progress}
                          />
                        )}
                      </>
                    )}
                    {tab === "history" && (
                      <TradingHistory
                        resourceType="USER"
                        id={pubkey!}
                        title="Activity"
                      />
                    )}
                    {tab === "settings" && (
                      <Profile
                        publicKey={pubkey!}
                        user={user}
                        collections={collections}
                      />
                    )}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}