import {
  BiTrendingUp as TrendingUpIcon,
  BiShoppingBag as ShoppingCartIcon,
  BiTag as TagIcon,
  BiLeaf as HandIcon,
  BiRefresh as RefreshIcon,
} from "react-icons/bi";
import { formatDistance } from "date-fns";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tokenHistory, tokenHistoryRefresh } from "../../api/api";
import { TokenInfo } from "../../data/custom";
import { TradingHistoryItem } from "../../data/marketplace.pb";
import { addNotification } from "../../utils/alert";
import { classNames } from "../../utils/clsx";
import { lamportsToSOL } from "../../utils/sol";
import Tooltip from "../tooltip";
import AccountName from "../accountName";

export function TradingHistory(props: {
  nft: TokenInfo;
  refetch?: () => void;
}) {
  const { nft } = props;
  const [history, setHistory] = useState<TradingHistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    tokenHistory(nft.token?.mintPubkey!).then((res) => {
      setHistory(
        res.filter((h) => {
          if (h.tradingType === "SALE" || h.tradingType === "OFFER") {
            return true;
          }
          if (
            h.tradingType === "LISTING" &&
            (h.marketplace === "market.piggygang.com" ||
              h.marketplace === "alpha.art")
          ) {
            return true;
          }
          return false;
        })
      );
    });
  }, [nft.token?.mintPubkey]);

  const onRefreshToken = () => {
    if (refreshing) {
      return;
    }
    setRefreshing(true);
    tokenHistoryRefresh(nft.token?.mintPubkey!).then((res) => {
      props.refetch?.();
      const filtered = res.filter((h) => {
        if (h.tradingType === "SALE" || h.tradingType === "OFFER") {
          return true;
        }
        if (
          h.tradingType === "LISTING" &&
          (h.marketplace === "market.piggygang.com" ||
            h.marketplace === "alpha.art")
        ) {
          return true;
        }
        return false;
      });
      setHistory(filtered);
      setRefreshing(false);
      addNotification("Trading history reloaded");
    });
  };

  return (
    <div className="border-t border-gray-200 mt-10 pt-10">
      <div className="border border-gray-300 rounded-tl-md rounded-md">
        <div className="flex p-4 border-b border-gray-300">
          <TrendingUpIcon className="flex-shrink-0 mr-1 h-5 w-5 text-gray-700 " />
          <h3 className="text-sm font-medium text-gray-900">Trading History</h3>
          <div className="flex-1" />
          <button
            className="has-tooltip text-gray-700 hover:text-gray-900"
            onClick={onRefreshToken}
            disabled={refreshing}
          >
            {/*
            <Tooltip
              text={
                refreshing
                  ? "Trading History Reloading"
                  : "Refresh Trading History"
              }
              className="-mt-12 -ml-20"
            />
            */}
            <RefreshIcon
              className={classNames(
                "flex-shrink-0 mr-3 h-5 w-5",
                refreshing ? "counterclockwise-spin" : ""
              )}
            />
          </button>
        </div>
        {!history.length && (
          <div className="flex flex-col items-center justify-center h-44">
            <TrendingUpIcon className="flex-shrink-0 mr-1 h-9 w-9 mb-2 text-gray-400 " />
            <span>No trading history yet</span>
          </div>
        )}
        {!!history.length && (
          <div className="">
            <table className="w-full text-gray-500">
              <caption className="sr-only">Offers</caption>
              <thead className="sr-only text-sm text-gray-500 text-left sm:not-sr-only">
                <tr>
                  <th
                    scope="col"
                    className="hidden font-normal sm:table-cell p-4"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="hidden font-normal sm:table-cell p-4"
                  >
                    Price
                  </th>

                  <th scope="col" className="font-normal p-4">
                    From
                  </th>
                  <th scope="col" className=" font-normal p-4">
                    To
                  </th>
                  <th scope="col" className="font-normal p-4 w-56">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="border-b border-gray-200 divide-y divide-gray-200 text-sm sm:border-t">
                {history.map((historyItem) => {
                  const pk = historyItem.toPubkey!;
                  const user = historyItem.user!;
                  return (
                    <tr key={historyItem.signature}>
                      <td className="hidden py-6 pr-8 sm:table-cell p-4">
                        <a
                          href={
                            "https://explorer.solana.com/tx/" +
                            historyItem.signature
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className="flex flex-row">
                            {historyItem.tradingType === "SALE" && (
                              <ShoppingCartIcon className="flex-shrink-0 mr-3 h-5 w-5 text-gray-700 " />
                            )}
                            {historyItem.tradingType === "LISTING" && (
                              <TagIcon className="flex-shrink-0 mr-3 h-5 w-5 text-gray-700 " />
                            )}
                            {historyItem.tradingType === "OFFER" && (
                              <HandIcon className="flex-shrink-0 mr-3 h-5 w-5 text-gray-700 " />
                            )}
                            <span>{historyItem.tradingType}</span>
                          </div>
                        </a>
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell p-4">
                        ◎ {lamportsToSOL(Number(historyItem.price))}
                      </td>
                      <td className="py-6 font-medium whitespace-nowrap p-4 text-indigo-500">
                        <Link to={"/user/" + user}>
                          <AccountName pubkey={user} />
                        </Link>
                      </td>
                      <td className="py-6 font-medium whitespace-nowrap p-4 text-indigo-500">
                        {historyItem.tradingType === "SALE" && (
                          <Link to={"/user/" + pk}>
                            <AccountName pubkey={pk} />
                          </Link>
                        )}
                      </td>
                      <td className="has-tooltip py-6 font-medium p-4 ">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
