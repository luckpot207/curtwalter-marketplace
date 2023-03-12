import React, { useEffect, useState } from "react";
import SimpleToken, { ItemShowField } from "../../components/simpleToken";
import CollectionHeader from "../../components/collectionHeader";
import FilterBar from "../../components/filterBar";
import { Filters, MobileFilters } from "../../components/filters";
// import { useDispatch, useSelector } from "../../api/store";
// import { listCollection, fetchNextPage } from "../../api/actions";
import { FakeSimpleTokenList } from "../../components/fakes/FakeSimpleTokenList";
import { FakeSimpleToken } from "../../components/fakes/FakeSimpleToken";
import { OrderBy, TokenAPISimple } from "../../data/marketplace.pb";
import { useParams } from "react-router-dom";
import useURLFilter from "../../utils/useURLFilter";
import useCollection from "../../utils/useCollection";
import { SearchModal } from "../../components/SearchModal";
import { classNames } from "../../utils/clsx";
import {
  TwitterStyleCollections,
  ObjectContainCollections,
} from "../../custom";
import { Layout } from "../../componentsV3/layout/Layout";
import MoonkeesNft from "../../assets/nfts/moonkes.png";
import { NFT } from "../../typechain-types";
import useMarketplaceContract from "../../hooks/useMarketplaceContract";
import { NftCollection as INftCollection } from "../../types/nft";
import { BigNumber, ethers } from "ethers";
import { useContract, useSigner } from "wagmi";
import { NFT_ABI } from "../../utils/abi";

export function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const { getCollection, allSales } = useMarketplaceContract();
  const [collection, setCollection] = useState<INftCollection | null>(null);
  const [tokenList, setTokenList] = useState<TokenAPISimple[]>([]);
  const [expectedTokenCount, setExpectedTokenCount] = useState<number>(0);
  // const [collectionMeta] = useCollection(slug!);
  const { data: signer } = useSigner();
  const nftContract = useContract({
    address: slug,
    abi: NFT_ABI,
    signerOrProvider: signer,
  });

  const getCollectionData = async (address: string) => {
    const nfts = allSales.filter((sale) => sale.nftContractAddr == address);
    // const collection = await getCollection(address);
    // setCollection(collection);
    if (nfts.length && nftContract) {
      setExpectedTokenCount(nfts.length);
      const tokenlist: TokenAPISimple[] = await Promise.all(
        nfts.map(async (nft) => {
          const metadataUri = await nftContract.tokenURI(nft.tokenId);
          const metadata = await fetch(metadataUri).then((res) => res.json());
          return {
            mintId: nft.tokenId.toString(),
            title: nft.tokenId.toString(),
            image: metadata.image,
            listedForSale: true,
            price: ethers.utils.formatEther(nft.price),
            offerPrice: ethers.utils.formatEther(nft.price),
            last: ethers.utils.formatEther(nft.price),
            collectionId: nft.nftContractAddr,
          };
        })
      );

      setTokenList(tokenlist);
    }
  };

  const progress = false;
  const filterIndex = 0;
  const nextPageToken = "aaaaa";
  const orderBy = "HIGHEST_CURRENT_OFFER";

  // const [isQueryParsed] = useURLFilter(slug!);
  const test_isQueryParsed = false;
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // const dispatch = useDispatch();
  const [gridColsValue, setGridColsValue] = useState(1);

  useEffect(() => {
    if (slug) getCollectionData(slug);
  }, [slug]);

  useEffect(() => {
    if (
      test_isQueryParsed &&
      filterIndex > 0 &&
      typeof nextPageToken === "undefined"
    ) {
      // listCollection(slug!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterIndex, test_isQueryParsed, nextPageToken, slug]);

  useEffect(() => {
    if (test_isQueryParsed) {
      // dispatch({ type: "ResetCollectionInfo" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Listener that calculated how much items will be in single collection row
  useEffect(() => {
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
        {/* <MobileFilters
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          idOrSlug={slug!}
        /> */}

        <CollectionHeader collection={collection} />
        <div className="flex flex-1 sm:px-6 lg:px-8">
          {/* <Filters idOrSlug={slug!} /> */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-6">
            <h2 id="products-heading" className="sr-only">
              Items
            </h2>

            {/* <FilterBar
              setMobileFiltersOpen={setMobileFiltersOpen}
              onClickSearch={() => setSearchOpen(true)}
            /> */}
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
                {tokenList.map((product: any) => (
                  <SimpleToken
                    key={product.mintId}
                    {...product}
                    showField={getShowFieldFromOrderBy(orderBy)}
                    size={
                      TwitterStyleCollections.includes(slug!)
                        ? "twitter"
                        : "rect"
                    }
                    resize={
                      ObjectContainCollections.includes(slug!)
                        ? "contain"
                        : "cover"
                    }
                  />
                ))}

                {/* {typeof nextPageToken === "string" && (
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
                )} */}
              </div>
            )}
          </main>
        </div>
        {/* {collectionMeta?.collection?.id && (
          <SearchModal
            collectionKey={collectionMeta?.collection?.id}
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        )} */}
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
