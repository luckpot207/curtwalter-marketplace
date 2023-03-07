import { useEffect, useState } from "react";
// import { useSelector } from "../api/store";
// import { setFiltersAndOrder } from "../api/actions";
import {
  ALL_FilterByStatus_VALUES,
  ALL_OrderBy_VALUES,
  FilterByStatus,
  FilterByStatus_BUY_NOW,
  OrderBy,
  OrderBy_PRICE_LOW_TO_HIGH,
} from "../data/marketplace.pb";
import { useLocation } from "react-router-dom";
// import { Filter } from "../api/types";

const STATUS = "Status";
const ORDER_BY = "OrderBy";

export default function useURLFilter(slug: string) {
  // const { filters, orderBy, collectionMetas } = useSelector((data: { filters: any; orderBy: any; collectionMetas: { [x: string]: any; }; }) => ({
  //   filters: data.filters,
  //   orderBy: data.orderBy,
  //   collectionMetas: data.collectionMetas[slug],
  // }));
  // const [isQueryParsed, setIsQueryParsed] = useState(false);

  // const location = useLocation();

  // useEffect(() => {
  //   if (!collectionMetas) {
  //     return;
  //   }
  //   const query = new URLSearchParams(location.search);

  //   const queryFilters: Filter[] = [];
  //   const traits = collectionMetas.traits;

  //   let statusQuery = query.get(STATUS);
  //   let buyNowDisabled = false;
  //   if (statusQuery) {
  //     statusQuery = decodeURI(statusQuery);

  //     buyNowDisabled = statusQuery.indexOf("-" + FilterByStatus_BUY_NOW) > -1;

  //     let statusValues = statusQuery.split(",");
  //     const validStatuses = statusValues.filter(
  //       (statusVal) => !!ALL_FilterByStatus_VALUES.find((s) => s === statusVal)
  //     );
  //     validStatuses.forEach((st) => {
  //       if (st) {
  //         queryFilters.push({
  //           type: "status",
  //           status: st as FilterByStatus,
  //         });
  //       }
  //     });
  //   }
  //   if (queryFilters.length === 0 && !buyNowDisabled) {
  //     queryFilters.push({
  //       type: "status",
  //       status: "BUY_NOW",
  //     });
  //   }

  //   traits?.forEach((t: { key: string; numbers: any[]; }) => {
  //     let q = query.get(t.key!);
  //     if (q) {
  //       q = decodeURIComponent(q);
  //       const filterValues = q.split(",");
  //       const validFilters = filterValues.filter(
  //         (filterVal) => !!t.numbers?.find((val: { value: string; }) => val.value === filterVal)
  //       );
  //       if (validFilters.length > 0) {
  //         validFilters.forEach((f) => {
  //           queryFilters.push({
  //             type: "trait",
  //             key: t.key!,
  //             value: f,
  //           });
  //         });
  //       }
  //     }
  //   });

  //   const orderByQuery = query.get(ORDER_BY);
  //   let sortBy;
  //   if (orderByQuery) {
  //     let orderByValue = ALL_OrderBy_VALUES.find((o) => o === orderByQuery);
  //     if (orderByValue) {
  //       sortBy = orderByValue;
  //     }
  //   }
  //   if (!sortBy) {
  //     sortBy = OrderBy_PRICE_LOW_TO_HIGH;
  //   }

  //   if (
  //     !isQueryParsed ||
  //     getQueryFromFilters(queryFilters, sortBy) !==
  //       getQueryFromFilters(filters, orderBy)
  //   ) {
  //     setFiltersAndOrder(queryFilters, sortBy);
  //   }
  //   setIsQueryParsed(true);
  // }, [collectionMetas]);

  // useEffect(() => {
  //   // Update Query from filters
  //   if (!isQueryParsed) {
  //     return;
  //   }
  //   const params = getQueryFromFilters(filters, orderBy);
  //   window.history.replaceState(
  //     null,
  //     window.document.title,
  //     params ? "?" + params : window.location.pathname
  //   );
  // }, [isQueryParsed, filters, orderBy]);

  // return [isQueryParsed];
}

function getQueryFromFilters(filters: any[], orderBy?: OrderBy) {
  const filterMap: { [key: string]: string[] } = {};
  const params = new URLSearchParams("");
  filters.forEach((f) => {
    if (f.type === "status") {
      if (!filterMap[STATUS]) {
        filterMap[STATUS] = [];
      }
      filterMap[STATUS].push(f.status);
    }

    if (f.type === "trait") {
      if (!filterMap[f.key]) {
        filterMap[f.key] = [];
      }
      filterMap[f.key].push(f.value);
    }
  });

  // Special handling for default filter & order
  if (orderBy && orderBy !== "PRICE_LOW_TO_HIGH") {
    filterMap[ORDER_BY] = [orderBy];
  }

  if (!filterMap[STATUS]) {
    filterMap[STATUS] = ["-" + FilterByStatus_BUY_NOW];
  }

  if (
    filterMap[STATUS]?.length === 1 &&
    filterMap[STATUS][0] === FilterByStatus_BUY_NOW
  ) {
    delete filterMap[STATUS];
  }
  //

  Object.keys(filterMap).forEach((k) => {
    params.set(k, filterMap[k].join(","));
  });
  return params.toString();
}
