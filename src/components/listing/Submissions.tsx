import React, { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  BiChevronRight as ChevronRightIcon,
  BiCheckCircle as CheckCircleIcon,
  BiChevronDown as ChevronDownIcon,
  BiRefresh as RefreshIcon
} from "react-icons/bi";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  listCollectionSubmissions,
  filterCollectionSubmission,
  signToken,
} from "../../api/api";
import { useSelector } from "../../api/store";
import {
  ListingApp,
  ListingAppOrderBy,
  AcceptStatus,
  FilterListingAppReq,
} from "../../data/form.pb";
import { classNames } from "../../utils/clsx";
import format from "date-fns/format";
const PER_PAGE = 30;

export const sortOptions: ListingAppOrderBy[] = [
  "ADDED_NEW_TO_OLD",
  "ADDED_OLD_TO_NEW",
  "MINTED_NEW_TO_OLD",
  "MINTED_OLD_TO_NEW",
];

export const OrderTitles: Record<ListingAppOrderBy, string> = {
  ADDED_NEW_TO_OLD: "Added: New to Old",
  ADDED_OLD_TO_NEW: "Added: Old to New",
  MINTED_NEW_TO_OLD: "Mint Time: New to Old",
  MINTED_OLD_TO_NEW: "Mint Time: Old to New",
  TOTAL_ITEMS_HIGH_TO_LOW: "Total Items: ⬇️",
  TOTAL_ITEMS_LOW_TO_HIGH: "Total Items: ⬆️",
};
type CustomAcceptStatus = "All" | AcceptStatus;

export const StatusText: Record<CustomAcceptStatus, string> = {
  WAITING: "Waiting for Approval",
  REJECTED: "Rejected",
  ACCEPTED: "Accepted",
  All: "All",
};

const AllStatusValues: CustomAcceptStatus[] = [
  "All",
  "WAITING",
  "ACCEPTED",
  "REJECTED",
];

function getStatusText(listing: ListingApp) {
  if (listing.featured === true) {
    return "Featured";
  }
  if (listing.acceptStatus) {
    return StatusText[listing.acceptStatus];
  }
  return listing.accepted ? "Accepted" : "Waiting for Approval";
}
function getStatusColor(listing: ListingApp) {
  if (listing.featured === true) {
    return "text-green-400";
  }
  if (listing.acceptStatus === "ACCEPTED") {
    return "text-blue-400";
  }
  if (listing.acceptStatus === "REJECTED") {
    return "text-red-400";
  }
  return "text-gray-400";
}

function SelectionMenu<T extends string>(props: {
  titles: Record<T, string>;
  value: T;
  allValues: T[];
  onChange: (value: T) => void;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          {props.titles[props.value]}
          <ChevronDownIcon
            className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {props.allValues.map((option) => (
              <Menu.Item key={option}>
                {({ active }) => (
                  <button
                    onClick={() => props.onChange(option)}
                    disabled={option === props.value}
                    className={classNames(
                      option === props.value
                        ? "font-medium text-gray-900"
                        : "text-gray-500",
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    {props.titles[option]}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function Submissions() {
  const { wallet, accessToken } = useSelector((data) => ({
    wallet: data.wallet,
    accessToken: data.accessToken,
  }));
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefresing] = useState(false);
  const [submissions, setSubmissions] = useState<ListingApp[]>([]);
  const [page, setPage] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<ListingAppOrderBy>("ADDED_NEW_TO_OLD");
  const [acceptStatus, setAcceptStatus] = useState<CustomAcceptStatus>("All");
  const hasActiveToken = accessToken && accessToken?.expAt > Date.now() / 1000;
  const isAdmin = accessToken?.admin ?? false;

  const filterCollections = (
    currentPage: number,
    sortBy: ListingAppOrderBy,
    status: CustomAcceptStatus
  ) => {
    setLoading(true);
    const req: FilterListingAppReq = {
      limit: PER_PAGE,
      offset: currentPage * PER_PAGE,
      orderBy: sortBy,
      matchFields: { paths: [] },
      matchValues: {},
    };
    if (status !== "All") {
      req.matchFields!.paths!.push("accept_status");
      req.matchValues!.acceptStatus = [status];
    }
    filterCollectionSubmission(wallet!.publicKey!.toBase58(), req)
      .then((res) => {
        setSubmissions(res);
      })
      .finally(() => {
        setLoading(false);
        setRefresing(false);
      });
  };

  useEffect(() => {
    if (wallet?.publicKey && hasActiveToken) {
      if (accessToken.admin) {
        filterCollections(0, orderBy, acceptStatus);
      } else {
        setLoading(true);
        listCollectionSubmissions(wallet!.publicKey!.toBase58())
          .then((res) => {
            setSubmissions(res);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [wallet?.publicKey, hasActiveToken]);

  const setSort = (value: ListingAppOrderBy) => {
    setOrderBy(value);
    setPage(0);
    filterCollections(0, value, acceptStatus);
  };

  const onRefreshPage = () => {
    setPage(0);
    setRefresing(true);
    filterCollections(0, orderBy, acceptStatus);
  };

  const changePage = (value: number) => {
    setPage(value);
    filterCollections(value, orderBy, acceptStatus);
  };

  const changeStatus = (value: CustomAcceptStatus) => {
    setPage(0);
    setAcceptStatus(value);
    filterCollections(0, orderBy, value);
  };

  // const walletModal = {
  // };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Alpha.art | Collection Submissions</title>
      </Helmet>
      <div className="mx-auto py-20 sm:py-24 lg:max-w-7xl">
        <div className="space-y-8 divide-y divide-gray-200">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div>
              <div className="flex flex-row items-center pb-4 border-b-2">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex-1">
                  Collection Submissions
                </h3>
                {accessToken && (
                  <Link
                    to="/submissions/new"
                    className="bg-indigo-600 dark:bg-indigo-600 dark:text-white border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                  >
                    Submit Collection
                  </Link>
                )}
              </div>

              {!wallet && (
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="flex flex-col flex-1 items-center">
                    <p className="font-base">You need to connect your wallet</p>
                    <button
                      type="button"
                      onClick={() => {
                        // walletModal.setVisible(true);
                      }}
                      className="mt-4 bg-indigo-600 dark:bg-indigo-600 dark:text-white border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                    >
                      Connect Wallet
                    </button>
                  </div>
                </div>
              )}
              {wallet && !hasActiveToken && (
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="flex flex-col flex-1 items-center">
                    <p className="font-base">
                      You need to sign the request to see this page.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        signToken(wallet!.publicKey!.toBase58());
                      }}
                      className="mt-4 bg-indigo-600 dark:bg-indigo-600 dark:text-white border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                    >
                      Sign Request
                    </button>
                  </div>
                </div>
              )}

              {wallet && hasActiveToken && isAdmin && (
                <div className="bg-gray-100 flex items-center mb-4 px-4 py-4 z-10">
                  <button
                    className="text-gray-700 hover:text-gray-900"
                    onClick={onRefreshPage}
                    disabled={refreshing}
                  >
                    <RefreshIcon
                      className={classNames(
                        "flex-shrink-0 mr-3 h-5 w-5",
                        refreshing ? "counterclockwise-spin" : ""
                      )}
                    />
                  </button>
                  <SelectionMenu
                    allValues={sortOptions}
                    onChange={setSort}
                    titles={OrderTitles}
                    value={orderBy}
                  />
                  <p className="ml-4 mr-2 text-sm">Filter By:</p>
                  <SelectionMenu
                    allValues={AllStatusValues}
                    onChange={changeStatus}
                    titles={StatusText}
                    value={acceptStatus}
                  />
                </div>
              )}
              {wallet &&
                hasActiveToken &&
                !loading &&
                submissions.length === 0 && (
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <div className="flex flex-col flex-1 items-center">
                      <p className="font-base">
                        You don't have any active submission.
                      </p>
                      <Link
                        to="/submissions/new"
                        className="mt-4 bg-indigo-600 dark:bg-indigo-600 dark:text-white border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                      >
                        Submit Collection
                      </Link>
                    </div>
                  </div>
                )}
              {loading && (
                <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                  <div className="flex flex-col flex-1 items-center">
                    <p className="font-base">Loading</p>
                  </div>
                </div>
              )}
              {wallet && hasActiveToken && !loading && (
                <ul role="list" className="divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <li key={submission.name}>
                      <Link
                        to={"/submissions/" + submission.id!}
                        className="block hover:bg-gray-50"
                      >
                        <div className="flex items-center py-4">
                          <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0">
                              {submission.pfp ? (
                                <img
                                  className="h-12 w-12 rounded-full"
                                  src={submission.pfp}
                                  alt="Collection Thumbnail"
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-full bg-gray-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                              <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                  {submission.name}
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500">
                                  <span className="truncate">
                                    {submission.description}
                                  </span>
                                </p>
                              </div>
                              <div className="hidden md:block">
                                <div>
                                  {submission.featured ? (
                                    <p className="text-sm text-gray-900">
                                      Featured from{" "}
                                      <time dateTime={submission.featureFrom}>
                                        {format(
                                          new Date(submission.featureFrom!),
                                          "d MMMM yyyy hh:mm O"
                                        )}
                                      </time>{" "}
                                      until{" "}
                                      <time dateTime={submission.featureUntil}>
                                        {format(
                                          new Date(submission.featureUntil!),
                                          "d MMMM yyyy hh:mm O"
                                        )}
                                      </time>
                                    </p>
                                  ) : submission.acceptedAt ? (
                                    <p className="text-sm text-gray-900">
                                      Accepted at{" "}
                                      <time dateTime={submission.acceptedAt}>
                                        {format(
                                          new Date(submission.acceptedAt!),
                                          "d MMMM yyyy hh:mm O"
                                        )}
                                      </time>
                                    </p>
                                  ) : (
                                    <p className="text-sm text-gray-900">
                                      Created at{" "}
                                      <time dateTime={submission.addedAt}>
                                        {format(
                                          new Date(submission.addedAt!),
                                          "d MMMM yyyy hh:mm O"
                                        )}
                                      </time>
                                    </p>
                                  )}
                                  <p className="mt-2 flex items-center text-sm text-gray-500">
                                    <CheckCircleIcon
                                      className={classNames(
                                        "flex-shrink-0 mr-1.5 h-5 w-5",
                                        getStatusColor(submission)
                                      )}
                                      aria-hidden="true"
                                    />
                                    {getStatusText(submission)}
                                  </p>
                                  <p className="text-xs text-gray-900 mt-2">
                                    Mint time:{" "}
                                    <time dateTime={submission.mintTime}>
                                      {format(
                                        new Date(submission.mintTime!),
                                        "d MMMM yyyy hh:mm O"
                                      )}
                                    </time>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <ChevronRightIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {isAdmin && (
              <div className="flex-1 flex justify-between sm:justify-end pt-4">
                <button
                  disabled={page < 1}
                  className={classNames(
                    "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50",
                    page < 1 ? "text-gray-400" : "text-gray-700 "
                  )}
                  onClick={() => {
                    changePage(page - 1);
                  }}
                >
                  Previous
                </button>
                <div className="flex justify-center items-center mx-2">
                  <p className="text-base">{page + 1}</p>
                </div>
                <button
                  disabled={submissions.length < PER_PAGE}
                  className={classNames(
                    "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50",
                    submissions.length < PER_PAGE
                      ? "text-gray-400"
                      : "text-gray-700 "
                  )}
                  onClick={() => {
                    changePage(page + 1);
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
