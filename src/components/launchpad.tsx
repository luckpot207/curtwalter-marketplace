import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { getLastListedToken, listTrendingCollections } from "../api/api";
import { TokenInfo } from "../data/custom";
import { Image } from "./simpleToken";
import Slider, { CustomArrowProps, Settings } from "react-slick";
import { BaseCollection } from "./collection/BaseCollection";
import { BaseCollectionData, TrendingCollectionData } from "../data/collection";
import { useSelector } from "../api/store";
import { NextArrow, PrevArrow } from "../pages/HomePage";

enum launchPadBaseCollectionStatus {
  LIVE = "LIVE",
  UPCOMING = "UPCOMING",
  ENDED = "ENDED",
}

export function LaunchPadBaseCollection(props: {
  collection: BaseCollectionData;
  status: launchPadBaseCollectionStatus;
}) {
  const [collection, setCollection] = useState(props.collection);
  const darkMode = useSelector((data) => data.darkMode);

  return (
    <div className="relative w-full">
      <BaseCollection
        collection={collection}
        sold={props.status === launchPadBaseCollectionStatus.ENDED}
      />
      <div
        className={`absolute top-0 right-0 mt-6 mr-6 px-2 py-[1px] rounded-[43px] uppercase ${props.status === launchPadBaseCollectionStatus.ENDED
          ? "bg-black dark:bg-black"
          : "bg-velvet"
          } text-white dark:text-white`}
      >
        {props.status === launchPadBaseCollectionStatus.LIVE
          ? "Live"
          : props.status === launchPadBaseCollectionStatus.UPCOMING
            ? "Upcoming"
            : "Ended"}
      </div>
    </div>
  );
}

export default function Launchpad() {
  const [lastListedToken, setLastListedToken] = useState<TokenInfo>({});
  const [trendingCarouselList, setTrendingCarouselList] = React.useState<
    TrendingCollectionData[]
  >([]);

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

  useEffect(() => {
    getLastListedToken().then((res) => {
      setLastListedToken(res);
    });
    listTrendingCollections({ limit: 24 }).then((res) => {
      setTrendingCarouselList(res);
    });
  }, []);
  return (
    <div className="bg-white" onClick={() => console.log("")}>
      <Helmet>
        <title>Alpha Art Market</title>
      </Helmet>
      <div className="relative overflow-hidden container mx-auto pt-4 pb-[6px] w-full">
        {/* Hero */}
        <div className="pt-16">
          <div className="mx-auto px-4 lg:px-0 ">
            {lastListedToken.token ? (
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, k) => (
                  <div key={k}>
                    <div
                    //   onClick={() =>
                    //     window.open(
                    //       `/t/${lastListedToken.token?.mintPubkey}`,
                    //       "_blank"
                    //     )
                    //   }
                    //   to={`/t/${lastListedToken.token?.mintPubkey}`}
                    >
                      <div className="flex flex-col md:flex-row bg-silver dark:bg-darkgray justify-between card-drop-small-shadow rounded-3xl p-6 items-center">
                        <div className="w-full sm:max-w-lg  flex flex-col justify-between py-10 lg:ml-20">
                          <h4 className="uppercase bg-velvet text-white dark:bg-paperwhite py-[2px] px-2 rounded-[4px] mb-4 w-max">
                            Featured launch
                          </h4>
                          <h1 className="text-2xl lg:text-4xl font font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:w-max ">
                            Bringing virtual games into the real world
                          </h1>
                          <p className="mt-4 text:sm lg:text-l text-black dark:text-white">
                            The Remarkable Women NFT collection by Rachel Winter
                            is a celebration and ode to all women inspired by
                            the perspectives of fashion, feminism, and cultural
                            diversity.
                          </p>
                          <button className="mt-4 text-sm lg:text-l text-white  dark:text-white bg-velvet h-10 w-32 flex justify-center items-center rounded-lg">
                            Launchpad
                          </button>
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
                            <div className="object-center object-cover w-1/2 h-full rounded-2xl header-banner-image">
                              <Image
                                src={
                                  (lastListedToken?.token?.optimizedImage ??
                                    lastListedToken?.token?.image) as string
                                }
                                resize={"contain"}
                                rounded={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Launchpad LIVE*/}
        <div className="mt-16">
          <h1 className="text-4xl font-bold ml-2 mb-8">Live</h1>
          <div>
            {trendingCarouselList.length > 0 && (
              <Slider {...slickCarouselSettings}>
                {trendingCarouselList.map((product, k) => (
                  <div className="" key={k}>
                    <div className="flex justify-center px-2">
                      <LaunchPadBaseCollection
                        status={launchPadBaseCollectionStatus.LIVE}
                        collection={product}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>

        {/* Launchpad UPCOMING*/}
        <div className="mt-16">
          <h1 className="text-4xl font-bold ml-2 mb-8">Upcoming</h1>
          {trendingCarouselList.length > 0 && (
            <Slider {...slickCarouselSettings}>
              {trendingCarouselList.map((product, k) => (
                <div className="" key={k}>
                  <div className="flex justify-center px-2">
                    <LaunchPadBaseCollection
                      status={launchPadBaseCollectionStatus.UPCOMING}
                      collection={product}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>

        {/* Launchpad ENDED*/}
        <div className="mt-16 mb-20">
          <h1 className="text-4xl font-bold ml-2 mb-8">Ended</h1>
          {trendingCarouselList.length > 0 && (
            <Slider {...slickCarouselSettings}>
              {trendingCarouselList.map((product, k) => (
                <div className="" key={k}>
                  <div className="flex justify-center px-2">
                    <LaunchPadBaseCollection
                      status={launchPadBaseCollectionStatus.ENDED}
                      collection={product}
                    />
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
}
