import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getLastListedToken,
  listCategories,
  listCollections,
  listNewCollections,
  listTrendingCollections,
  listUpcomingCollections,
} from "../api/api";
import * as marketplacepb from "../data/marketplace.pb";
import { lamportsToSOL } from "../utils/sol";
import { nFormatter } from "../components/collectionHeader";
import { Helmet } from "react-helmet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "../api/store";
import { useWindowSize } from "../utils/useWindowSize";
// import GhostContentAPI, { PostOrPage } from "@tryghost/content-api";
import Slider, { CustomArrowProps, Settings } from "react-slick";
import { TokenInfo } from "../data/custom";
import {
  CategoryData,
  NewCollectionData,
  TrendingCollectionData,
  UpcomingCollectionData,
} from "../data/collection";
import { UpcomingCollection } from "../components/collection/UpcominCollection";
import { BaseCollection } from "../components/collection/BaseCollection";
import { TrendingListCollection } from "../components/collection/TrendingListCollection";
import { ObjectContainCollections, TwitterStyleCollections } from "../custom";
import { Image } from "../components/simpleToken";

// UNUSED for now

// const footerNavigation = {
//   bottomLinks: [
//     { name: "FAQ", href: "/faq" },
//     { name: "Privacy", href: "/privacy" },
//     // { name: "Terms", href: "#" },
//   ],
// };

// const DecorativeImages = [
//   "https://assets.alpha.art/opt/7/c/7cf447caaa3d597a9d21eede4c1cd0872c469cbc/original.png",
//   "https://assets.alpha.art/opt/7/d/7d4063649b8c33ff077fc8b3031ca5afdc202b21/original.png",
//   "https://assets.alpha.art/opt/0/b/0b1e4a821d24e571d2f5265fb5fa149289aacb91/original.png",
//   "https://assets.alpha.art/opt/b/7/b7870ac06fb279514b897e024ba9e5ad3a48340b/original.png",
//   "https://assets.alpha.art/opt/0/2/0289e4a9c5641cd1da4fd9df0e2fa55db28270e8/original.png",
//   "https://assets.alpha.art/opt/0/4/04f505fc66faad3845af0ee058e236fc2e7c8cc0/original.png",
//   "https://assets.alpha.art/opt/4/1/41ac75c4a7e3efa84e07df55cbeff41927ded201/original.png",
// ];

// function DecorImage(props: { src: string }) {
//   if (props.src.startsWith("https://assets.alpha.art/opt/")) {
//     const pp = props.src.split("/");
//     const parts = pp.slice(0, pp.length - 1);
//     return (
//       <picture>
//         <source
//           type="image/webp"
//           srcSet={[
//             [...parts, "256.webp"].join("/"),
//             [...parts, "512.webp 2x"].join("/"),
//           ].join(", ")}
//         />
//         <img
//           loading="lazy"
//           src={[...parts, "256.png"].join("/")}
//           srcSet={[
//             [...parts, "256.png"].join("/"),
//             [...parts, "512.png 2x"].join("/"),
//           ].join(", ")}
//           alt=""
//           className="w-full h-full object-center object-cover"
//         />
//       </picture>
//     );
//   }
//   return (
//     <img
//       loading="lazy"
//       src={props.src}
//       alt=""
//       className="w-full h-full object-center object-cover"
//     />
//   );
// }

export function BigCollection(props: {
  collection: CategoryData;
  show: "items" | "volume";
}) {
  const { collection } = props;
  const darkMode = useSelector((data) => data.darkMode);

  return (
    <div
      key={collection.id}
      className={`group bg-gray-100 dark:bg-zinc-800 relative mb-6 shadow-md rounded-2xl py-2`}
    >
      <div className="bg-silver dark:bg-darkgray rounded-2xl p-4">
        <div
          className="relative w-full flex justify-center items-center overflow-hidden group-hover:opacity-75 sm:aspect-h-1 md:aspect-h-1 category-bg bg-no-repeat bg-contain bg-center "
          style={{
            backgroundImage: `url("./img/itunes-categories-bg.png")
            `,
          }}
        >
          <img
            src={collection.thumbnail}
            alt={collection.name}
            loading="lazy"
            className="object-center object-cover w-1/2 rounded-2xl collection-image max-h-32 "
          />
        </div>
      </div>
      <h3 className="text-base text-center">
        <Link to={`/explore/category/${collection.id}`}>
          <span className="absolute inset-0" />
          {collection.name}
        </Link>
      </h3>
      {props.show === "volume" ? (
        <p className="text-base font-semibold text-center">
          {nFormatter(lamportsToSOL(collection.volume ?? 0), 1)}{" "}
          <span className="font-light">total volume</span>
        </p>
      ) : (
        <p className="mt-1 text-center">
          {collection.volume} items
        </p>
      )}
    </div>
  );
}

export function NextArrow({
  currentSlide,
  slideCount,
  ...props
}: CustomArrowProps) {
  const darkMode = useSelector((data) => data.darkMode);

  return (
    <div {...props}>
      <div
        className={`flex justify-center items-center bg-lightgray dark:bg-black rounded-2xl purple-bg-on-hover w-12 h-12 ${darkMode ? "nav-border" : ""
          } hidden md:flex`}
      >
        <img alt="" src="/icons/nav-right.svg" />
      </div>
    </div>
  );
}

export function PrevArrow({
  currentSlide,
  slideCount,
  ...props
}: CustomArrowProps) {
  const darkMode = useSelector((data) => data.darkMode);

  return (
    <div {...props}>
      <div
        className={`hidden md:flex justify-center items-center bg-lightgray dark:bg-black rounded-2xl purple-bg-on-hover w-12 h-12 ${darkMode ? "nav-border" : ""
          } `}
      >
        <img className="" alt="" src="/icons/nav-left.svg" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [lastListedToken, setLastListedToken] = React.useState<TokenInfo>({});
  const [popularColl, setPopularColl] = React.useState<
    marketplacepb.Collection[]
  >([]);

  const darkMode = useSelector((data) => data.darkMode);
  const windowSize = useWindowSize();

  // const [featuredPosts, setFeaturedPosts] = React.useState<PostOrPage[]>([]);
  // const [otherPosts, setOtherPosts] = React.useState<PostOrPage[]>([]);

  const [trendingCarouselList, setTrendingCarouselList] = React.useState<
    TrendingCollectionData[]
  >([]);
  const [upcomingCarouselList, setUpcomingCarouselList] = React.useState<
    UpcomingCollectionData[]
  >([]);
  const [newCarouselList, setNewCarouselList] = React.useState<
    NewCollectionData[]
  >([]);

  const [categoryList, setCategoryList] = React.useState<CategoryData[]>([]);

  const [trendingList, setTrendingList] = React.useState<
    TrendingCollectionData[]
  >([]);
  const [trendingListPeriod, setTrendingListPeriod] =
    React.useState<string>("7d");
  const [trendingListDropdownActive, setTrendingListDropdownActive] =
    React.useState<boolean>(false);
  const [trendingCollectorsLoading, setTrendingCollectorsLoading] =
    React.useState<boolean>(false);

  // const [showSubscriptionModal, setShowSubscriptionModal] =
  //   React.useState<boolean>(true);

  const trendingListPeriodMapping = {
    "24h": "last 24 hours",
    "7d": "last 7 days",
    "14d": "last 14 days",
    "1m": "last month",
    "3m": "last 3 months",
    "6m": "last 6 months",
    "1y": "last year",
  };

  const slickCarouselSettings: Settings = {
    infinite: false,
    speed: 500,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 480,
        settings: { slidesToShow: 1.1, slidesToScroll: 1, arrows: undefined },
      },
      {
        breakpoint: 720,
        settings: { slidesToShow: 2.2, slidesToScroll: 2, arrows: false },
      },
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3, slidesToScroll: 3, arrows: true },
      },
      { breakpoint: 1536, settings: { slidesToShow: 5, slidesToScroll: 5 } },
      { breakpoint: 4000, settings: { slidesToShow: 6, slidesToScroll: 6 } },
    ],

    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  function convertToDate(date: string) {
    const convertedDate = new Date(date);
    return convertedDate.toDateString();
  }

  function getBlogPosts() {
    // const api = new GhostContentAPI({
    //   url: "https://alpha-blog.ghost.io",
    //   key: "42dc51cb3f2135c98096fa2343",
    //   version: "v3",
    // });

    // api.posts
    //   .browse({ limit: 10, include: "tags" })
    //   .then((posts: any) => {
    //     let temporaryFeaturedPosts: any[] = [];
    //     let temporaryOtherPosts: any[] = [];
    //     posts.forEach((post: any) => {
    //       if (post.primary_tag?.name === "Featured") {
    //         temporaryFeaturedPosts.push(post);
    //       } else {
    //         temporaryOtherPosts.push(post);
    //       }
    //     });

    //     setFeaturedPosts(temporaryFeaturedPosts);
    //     setOtherPosts(temporaryOtherPosts.slice(0, 3));
    //   })
    //   .catch((err: any) => {
    //     console.error(err);
    //   });
  }

  useEffect(() => {
    getLastListedToken().then((res) => {
      setLastListedToken(res);
    });
    listTrendingCollections({ limit: 24 }).then((res) => {
      setTrendingCarouselList(res);
    });
    listUpcomingCollections({ limit: 24 }).then((res) => {
      setUpcomingCarouselList(res);
    });
    listNewCollections({ limit: 24 }).then((res) => {
      setNewCarouselList(res);
    });
    listCategories().then((res) => {
      setCategoryList(res);
    });
    getBlogPosts();
  }, []);

  React.useEffect(() => {
    setTrendingCollectorsLoading(true);
    listTrendingCollections({ limit: 18, interval: trendingListPeriod }).then(
      (res) => {
        setTrendingList(res);
        setTrendingCollectorsLoading(false);
      }
    );
  }, [trendingListPeriod]);

  return (
    <div
      className="bg-white"
      onClick={() => setTrendingListDropdownActive(false)}
    >
      <Helmet>
        <title>Alpha Art Market</title>
      </Helmet>
      <div className="relative overflow-hidden container mx-auto pt-4 pb-[6px]">
        {/* Hero */}
        <div className="pt-16">
          <div className="mx-auto px-4 lg:px-0 ">
            {lastListedToken.token ? (
              <Link to={`/t/${lastListedToken.token?.mintPubkey}`}>
                <div className="flex flex-col md:flex-row bg-silver dark:bg-darkgray justify-between card-drop-small-shadow rounded-3xl p-6">
                  <div className="w-full sm:max-w-lg  flex flex-col justify-between py-10 lg:ml-20">
                    <h1 className="text-2xl lg:text-4xl font font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:w-max ">
                      Latest NFT Deal
                    </h1>
                    <p className="mt-4 text:lg lg:text-xl text-velvet dark:text-velvet">
                      {lastListedToken.collection?.title}
                    </p>
                    <p className="mt-4 text:sm lg:text-l text-black dark:text-white">
                      {lastListedToken.collection?.description}
                    </p>
                    <p className="mt-4 text-sm lg:text-l text-white  dark:text-white bg-velvet h-10 w-32 flex justify-center items-center rounded-lg">
                      <b>Price: &nbsp;</b>{" "}
                      {nFormatter(
                        lamportsToSOL(lastListedToken.listing?.price),
                        2
                      )}{" "}
                      SOL
                    </p>
                  </div>
                  <div className="z-0 w-full lg:w-96 h-64 mt-4 lg:mt-0 rounded-lg overflow-hidden lg:mr-20">
                    <div
                      className="relative w-full h-full flex justify-center items-center overflow-hidden group-hover:opacity-75 sm:aspect-h-1 md:aspect-h-1 category-bg bg-no-repeat bg-contain bg-center "
                      style={
                        {
                          //backgroundImage: `url("./img/hero-banner-bg.png")`,
                        }
                      }
                    >
                      <div className="object-center object-cover w-1/2 rounded-2xl header-banner-image">
                        <Image
                          src={
                            (lastListedToken.token.optimizedImage ??
                              lastListedToken.token.image) as string
                          }
                          resize={"contain"}
                          rounded={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <main>
        {/* Trending Carousel List */}
        {trendingCarouselList.length > 0 && (
          <section
            aria-labelledby="trending-heading"
            className="bg-white container mx-auto"
          >
            <div className="py-8 sm:pt-12 lg:pb-0 lg:pt-8 lg:mx-auto pl-4 lg:px-0">
              <div className="px-4 flex items-center justify-between sm:px-6 lg:px-0">
                <h2
                  id="trending-heading"
                  className="text-3xl font-bold tracking-tight text-gray-900 mb-4"
                >
                  Trending
                </h2>
                {/*
                <h4 className="w-full text-right underline">
                  {" "}
                  <Link to="/explore/trending" className="cursor-pointer mr-4">
                    View all
                  </Link>
                </h4>
                */}
              </div>

              {trendingCarouselList.length > 0 && (
                <Slider {...slickCarouselSettings}>
                  {trendingCarouselList.map((product, k) => (
                    <div className="" key={k}>
                      <div className="flex justify-center px-2">
                        <BaseCollection key={product.id} collection={product} />
                      </div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </section>
        )}

        {/* Upcoming Carousel List */}
        {upcomingCarouselList.length > 0 && (
          <section
            aria-labelledby="featured-heading"
            className="container mx-auto"
          >
            <div className="py-8 sm:pt-8 lg:pb-0 lg:pt-8 lg:mx-auto pl-4 lg:px-0">
              <div className="px-4 flex items-center justify-between sm:px-6 lg:px-0">
                <h2
                  id="featured-heading"
                  className="text-3xl font-bold tracking-tight text-gray-900 mb-4"
                >
                  Upcoming
                </h2>
                {/*
                <h4 className="w-full text-right underline">
                  {" "}
                  <Link to="/explore/upcoming" className="cursor-pointer mr-4">
                    View all
                  </Link>
                </h4>
                */}
              </div>
              {upcomingCarouselList.length > 0 && (
                <Slider {...slickCarouselSettings}>
                  {upcomingCarouselList.map((f, k) => (
                    <div key={k}>
                      <div className="flex justify-center px-2">
                        <UpcomingCollection collection={f} />
                      </div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </section>
        )}

        {/* New Carousel List */}
        {newCarouselList.length > 0 && (
          <section
            aria-labelledby="new-heading"
            className="container mx-auto bg-white"
          >
            <div className="py-8 sm:pt-16 lg:pb-0 lg:pt-8 lg:mx-auto pl-4 lg:px-0">
              <div className="px-4 flex items-center justify-between sm:px-6 lg:px-0">
                <h2
                  id="trending-heading"
                  className="text-3xl font-bold tracking-tight text-gray-900 mb-4"
                >
                  New
                </h2>
                {/*
                <h4 className="w-full text-right underline">
                  {" "}
                  <Link to="/explore/new" className="cursor-pointer mr-4">
                    View all
                  </Link>
                </h4>
                */}
              </div>
              {newCarouselList.length > 0 && (
                <Slider {...slickCarouselSettings}>
                  {newCarouselList.map((product, k) => (
                    <div key={k}>
                      <div className="flex justify-center px-2">
                        <BaseCollection
                          key={product.id}
                          collection={product as any}
                        />
                      </div>
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </section>
        )}

        {/* Modal for success subscription don't know where it should appear */}
        {/* <InfoModal
          title="Welcome to the club!"
          visible={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        >
          You’ve just made a terrific decision. Please make sure to check your
          inbox and confirm the subscription.
        </InfoModal> */}

        {/* All categories */}
        <section
          id="popular"
          aria-labelledby="collections-heading"
          className="bg-white container mx-auto"
        >
          <div className="mx-auto px-4 lg:px-0">
            <div className="max-w-2xl mx-auto pt-8 sm:py-12 lg:py-16 md:max-w-none">
              <h2
                id="collections-heading"
                className="text-3xl font-extrabold text-gray-900 w-full flex justify-between"
              >
                <span>Categories</span>

                <Link
                  className="text-lg underline font-medium cursor-pointer flex items-end"
                  to={"/explore"}
                >
                  Explore All
                </Link>
              </h2>
              <div className="mt-4 gap-y-12 md:gap-y-4 md:grid md:grid-cols-3 md:gap-x-3 lg:gap-y-8 lg:grid-cols-4 lg:gap-x-6">
                {categoryList.map((category) => (
                  <BigCollection
                    key={category.id}
                    collection={category}
                    show="volume"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stake to earn post */}
        <div className="relative pt-0 lg:pt-9 overflow-hidden container mx-auto">
          <div className="">
            <div className="px-4 lg:px-0 ">
              <div className="flex flex-col md:flex-row bg-silver dark:bg-velvet justify-between card-drop-small-shadow rounded-3xl">
                <div
                  className="rounded-bl-3xl w-1/4  "
                  style={{
                    backgroundImage: `url("./img/fee-reduction-piggy-left.png")`,
                    backgroundPosition: "left bottom" /*Positioning*/,
                    backgroundSize: "contain",
                    filter: "grayscale(50%)",
                    backgroundRepeat:
                      "no-repeat" /*Prevent showing multiple background images*/,
                  }}
                />

                <div className="relative py-6 md:py-16  sm:py-16 px-4 lg:px-0">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                    Stake to Earn
                  </h1>
                  <p className="mt-6 text-xl text-black max-w-3xl">
                    Earn Solana on alpha.art by owning and staking Piggy Sol
                    Gang NFTs. Payments will be distributed equally among staked
                    Pigs.
                  </p>
                  <div className="flex justify-between flex-col md:flex-row md:justify-start">
                    <Link
                      to="/collection/piggy-sol-gang"
                      className="mt-4 inline-block text-center bg-black dark:bg-black border border-transparent rounded-md py-3 px-6 lg:px-8 font-medium text-white dark:text-white hover:bg-gray-700"
                    >
                      Get Your Piggy
                    </Link>
                    <Link
                      to="/stake"
                      className="mt-4 lg:ml-4 inline-block text-center bg-black dark:bg-black border border-transparent rounded-md py-3 px-8 font-medium text-white dark:text-white hover:bg-gray-700"
                    >
                      Stake Your Piggy
                    </Link>
                  </div>
                </div>
                <div
                  className="rounded-br-3xl w-1/4"
                  style={{
                    backgroundImage: `url("./img/fee-reduction-right.png")`,
                    backgroundPosition: "right bottom" /*Positioning*/,
                    backgroundSize: "cover",
                    filter: "grayscale(50%)",
                    backgroundRepeat:
                      "no-repeat" /*Prevent showing multiple background images*/,
                  }}
                />
                <div className="hidden absolute inset-0 bg-white opacity-75" />
              </div>
            </div>
          </div>
        </div>

        {/* Trending List */}
        <section
          id="trending-collectors"
          aria-labelledby="collections-heading"
          className="bg-white container mx-auto mt-20"
        >
          <div className="px-4 lg:px-0">
            <span className="text-xl md:text-2xl lg:text-3xl font-bold flex">
              <h1>Trending in</h1>{" "}
              <h1
                className="cursor-pointer h-14 text-velvet font-bold flex flex-col items-center z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setTrendingListDropdownActive(!trendingListDropdownActive);
                }}
              >
                <div className="relative flex ml-2 ">
                  {(trendingListPeriodMapping as any)[trendingListPeriod]}{" "}
                  <img
                    alt="arrow-down"
                    src="/icons/arrow-down.svg"
                    width={12}
                    className={`ml-4 transition-all invert-icon ${trendingListDropdownActive ? "rotate-180" : ""
                      }`}
                  />
                  {trendingListDropdownActive && (
                    <div className="absolute top-8 left-0 lg:top-12 right-0  text-mediumgray bg-white rounded-b-xl">
                      {Object.keys(trendingListPeriodMapping).map((k) => (
                        <div
                          className="text-sm md:text-l lg:text-xl hover:text-velvet flex justify-end border-t border-lightgray py-2 pr-4"
                          onClick={() => setTrendingListPeriod(k)}
                          key={k}
                        >
                          {(trendingListPeriodMapping as any)[k]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </h1>
            </span>
            <div className="flex flex-wrap w-full gap-x-4 gap-y-2 md:gap-x-8 md:gap-y-4 mt-10">
              {trendingList.map((collection, k) => (
                <div key={k} className="trending-collector-width">
                  <TrendingListCollection
                    collection={collection}
                    loader={trendingCollectorsLoading}
                  />
                </div>
              ))}
              {/* <div className="w-full flex justify-center mt-5">
                <button className="text-white dark:text-white px-7 py-3 bg-black dark:bg-velvet rounded-lg mb-24">
                  Go to rankings
                </button>
              </div> */}
            </div>
          </div>
        </section>

        {/* Latest posts carousel */}
        <div className="bg-white container mx-auto mt-[80px]">
          <div className="px-4 lg:px-0 ">
            <h1 className="mb-8 text-3xl font-bold">
              {" "}
              Read our latest blog post
            </h1>
            <Slider
              {...{
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                dotsClass: "slider-custom-dots",
              }}
              className="banner-blog-posts"
            >
              {/* {featuredPosts.map((post, k) => (
                <div
                  key={k}
                  className="bg-silver dark:bg-darkgray rounded-3xl !flex flex-col md:flex-row p-4 lg:p-8 items-center justify-between card-drop-small-shadow"
                >
                  <div className="w-full md:w-3/5 flex flex-col lg:px-10 ">
                    {" "}
                    <h1 className="font-extrabold text-2xl md:text-3xl lg:text-5xl mb-2">
                      {post.title}
                    </h1>
                    <h4 className="text-xl mb-7 mt-7 text-black dark:text-white lines-2">
                      {post.excerpt}
                    </h4>
                    {windowSize.width && windowSize.width > 766 && (
                      <button
                        className="bg-black dark:bg-velvet rounded-lg text-white dark:text-white w-32 px-7 py-3"
                        onClick={() => window.open(post.url, "_blank")}
                      >
                        View post
                      </button>
                    )}
                  </div>
                  {post.feature_image && (
                    <div className="w-full sm:w-60 sm:h-60 lg:w-96 lg:h-96 relative rounded-2xl overflow-hidden">
                      <img
                        alt="latest-post"
                        src={post.feature_image}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {windowSize.width && windowSize.width < 767 && (
                    <button className="bg-black dark:bg-velvet rounded-lg text-white dark:text-white w-32 px-7 py-3 mt-6">
                      View post
                    </button>
                  )}
                </div>
              ))} */}
            </Slider>
          </div>
        </div>

        {/* STORIES section */}
        <div className="bg-white mt-12 mb-20 lg:mb-32 container mx-auto px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* {otherPosts.map((post, k) => {
              return (
                <div
                  key={k}
                  className="mx-auto bg-white cursor-pointer w-full h-full"
                  onClick={() => window.open(post.url, "_blank")}
                >
                  <div
                    className={`w-full h-full border purple-border-hover custom-border-lightgray rounded-2xl p-4 dark:text-paperwhite dark:bg-darkgray `}
                  >
                    <div className="w-full md:h-[305px] mb-4 ">
                      {post.feature_image && (
                        <img
                          alt={
                            post.feature_image_alt
                              ? post.feature_image_alt
                              : "post-image"
                          }
                          className="object-cover w-full h-full"
                          height={304}
                          src={post.feature_image}
                          loading="lazy"
                        />
                      )}
                    </div>

                    <button className="w-full flex justify-center items-center border border-lightgray dark:border-lightgray rounded-xl text-velvet dark:text-paperwhite mb-4 py-2">
                      {" "}
                      {post.primary_tag?.name ? post.primary_tag?.name : "Read"}
                    </button>

                    <h4 className="mb-4 text-sm">
                      {convertToDate(post.published_at ?? "")}
                    </h4>

                    <h2 className="font-extrabold text-2xl mb-4">
                      {post.title}
                    </h2>
                    <h4 className="text-xl mb-7 text-black dark:text-white lines-2">
                      {post.excerpt}
                    </h4>
                  </div>
                </div>
              );
            })} */}
          </div>
          <div className="w-full flex justify-center mt-12">
            <button
              className="flex justify-center items-center py-3 px-8 text-white dark:text-white bg-black dark:bg-velvet rounded-lg"
              onClick={() => window.open("https://blog.alpha.art/", "_blank")}
            >
              Read more stories
            </button>
          </div>
        </div>
        {/* Sale and testimonials */}
        <div className="relative overflow-hidden">
          {/* Decorative background image and gradient */}
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute inset-0  mx-auto overflow-hidden xl:px-8">
              <img
                src="https://cdn.piggygang.com/c/j6894aRvRMJlE/5rE3qqmLg64Rd.png"
                alt=""
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-white bg-opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white" />
          </div>
        </div>
      </main>
    </div>
  );
}
