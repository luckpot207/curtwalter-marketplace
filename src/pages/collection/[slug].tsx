import React, { useState } from "react";
import SimpleToken, { ItemShowField } from "../../components/simpleToken";
import CollectionHeader from "../../components/collectionHeader";
import FilterBar from "../../components/filterBar";
import { Filters, MobileFilters } from "../../components/filters";
// import { useDispatch, useSelector } from "../../api/store";
// import { listCollection, fetchNextPage } from "../../api/actions";
import { FakeSimpleTokenList } from "../../components/fakes/FakeSimpleTokenList";
import { FakeSimpleToken } from "../../components/fakes/FakeSimpleToken";
import { OrderBy } from "../../data/marketplace.pb";
import { useParams } from "react-router-dom";
import useURLFilter from "../../utils/useURLFilter";
import useCollection from "../../utils/useCollection";
import { SearchModal } from "../../components/SearchModal";
import { classNames } from "../../utils/clsx";
import { TwitterStyleCollections, ObjectContainCollections } from "../../custom";
import {Layout} from "../../componentsV3/layout/Layout";
import MoonkeesNft from "../../assets/nfts/moonkes.png";

export function Collection() {
  const { slug } = useParams<{ slug: string }>();
  // const [collectionMeta] = useCollection(slug!);

  const collectionMeta = {
    collection: {
      id: "999",
      slug: "my_slug",
      description: "this is my nft",
      authorityPubkey: "authority",
      title: "art piece",
      thumbnail: MoonkeesNft,
      banner: MoonkeesNft,
      links: ["d", "w"],
      total_items: 13,

      totalItems: 12,
      verified: true,
      symbol: "my_symbol",
      ownerCount: 23,
      volume: 44,
      alternativeAuthorities: ["favor", "John"],
      collaborators: ["Ted", "Paul"],
      addedAt: new Date().getTime(),
      all_sales: 32
    }
  }
  // const {
  //   progress,
  //   tokenList,
  //   filterIndex,
  //   expectedTokenCount,
  //   nextPageToken,
  //   orderBy,
  // } = useSelector((data:any) => ({
  //   progress: data.filterIsInProgress,
  //   tokenList: data.tokenList,
  //   filterIndex: data.filterIndex,
  //   nextPageToken: data.nextPageToken,
  //   expectedTokenCount: data.expectedTokenCount,
  //   orderBy: data.orderBy,
  // }));

  const progress = false;
  const tokenList = ["aaaaa", "fffff", "bbbbb"];
  const filterIndex = 0;
  let expectedTokenCount = 100;
  const nextPageToken = "aaaaa"
  const orderBy = "HIGHEST_CURRENT_OFFER";
  

  // const [isQueryParsed] = useURLFilter(slug!);
  const test_isQueryParsed = false;
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // const dispatch = useDispatch();
  const [gridColsValue, setGridColsValue] = useState(1);

  React.useEffect(() => {
    if (
      test_isQueryParsed &&
      filterIndex > 0 &&
      typeof nextPageToken === "undefined"
    ) {
      // listCollection(slug!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterIndex, test_isQueryParsed, nextPageToken, slug]);

  React.useEffect(() => {
    if (test_isQueryParsed) {
      // dispatch({ type: "ResetCollectionInfo" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Listener that calculated how much items will be in single collection row
  React.useEffect(() => {
    const collectionDivElement = document.getElementById("collection-wrapper");
    setGridColsValue(
      Math.floor(Number(collectionDivElement?.offsetWidth) / 280)
    );
    function handleResize() {
      setGridColsValue(
        Math.floor(Number(collectionDivElement?.offsetWidth) / 280)
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting) {
      // fetchNextPage();
    }
  };

  return (
    <Layout footer={false}>
      <div className="flex flex-col overflow-x-hidden w-full">
        <MobileFilters
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          idOrSlug={slug!}
        />

        <CollectionHeader collectionID={slug!} />
        <div className="flex flex-1 sm:px-6 lg:px-8">
          <Filters idOrSlug={slug!} />
          <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-6">
            <h2 id="products-heading" className="sr-only">
              Items
            </h2>

            <FilterBar
              setMobileFiltersOpen={setMobileFiltersOpen}
              onClickSearch={() => setSearchOpen(true)}
            />
            {expectedTokenCount > 0 && !progress && (
              <h3 className="text-xs font-semibold tracking-wide mb-4">
                {expectedTokenCount} Items
              </h3>
            )}
            {expectedTokenCount === 0 && !progress && (
              <h3 className="text-base font-semibold w-full text-center tracking-wide mt-8">
                No Result
              </h3>
            )}
            {progress ? (
              <div className="animate-pulse">
                <div className="mb-5 h-4 w-20 overflow-hidden rounded-sm" />
                <FakeSimpleTokenList count={100} />
              </div>
            ) : (
              <div
                id="collection-wrapper"
                className={classNames(
                  `grid grid-cols-${gridColsValue}`,
                  TwitterStyleCollections.includes(slug!)
                    ? "gap-y-10 gap-x-6 xl:gap-x-8"
                    : "gap-y-10 gap-x-6 xl:gap-x-8"
                )}
              >
                {tokenList.map((product:any) => (
                  <SimpleToken
                    key={product.mintId}
                    {...product}
                    showField={getShowFieldFromOrderBy(orderBy)}
                    size={
                      TwitterStyleCollections.includes(slug!)
                        ? "twitter"
                        : "rect" /*TODO: remove custom logic for skyline */
                    }
                    resize={
                      ObjectContainCollections.includes(slug!)
                        ? "contain"
                        : "cover"
                    }
                  />
                ))}

                {typeof nextPageToken === "string" && (
                  <>
                    <div
                      className="animate-pulse"
                      ref={(res) => {
                        if (res) {
                          const observer = new IntersectionObserver(
                            handleObserver,
                            {
                              root: null,
                              threshold: 0.25,
                              rootMargin: "0px",
                            }
                          );
                          observer.observe(res);
                        }
                      }}
                    >
                      <FakeSimpleToken />
                    </div>

                    {Array.from({ length: 3 }, () => (
                      <div className="animate-pulse">
                        <FakeSimpleToken />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </main>
        </div>
        {collectionMeta?.collection?.id && (
          <SearchModal
            collectionKey={collectionMeta?.collection?.id}
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
}

function getShowFieldFromOrderBy(orderBy: OrderBy): ItemShowField | undefined {
  if (orderBy === "HIGHEST_CURRENT_OFFER") {
    return "offerPrice";
  }
  if (orderBy === "HIGHEST_LAST_SALE") {
    return "lastPrice";
  }
  return "lastPrice";
}