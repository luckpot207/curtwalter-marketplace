import React from "react";
// import { useSelector } from "../api/store";
import { lamportsToSOL } from "../utils/sol";
import { Spinner } from "./spiners";
import useCollection from "../utils/useCollection";
import { Link, useLocation } from "react-router-dom";
import { BiPencil, BiCollection, BiTrendingUp } from "react-icons/bi";
import { Helmet } from "react-helmet";
import { classNames } from "../utils/clsx";
import { TwitterIcon, HowRareIsIcon, DiscordIcon, WebsiteIcon } from "./icons";
import Tooltip from "./tooltip";

export function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : num.toFixed(digits);
}

function Image(props: { src: string; alt?: string }) {
  //https://assets.alpha.art/opt/c/d/cd5215107005896ce88e2b0cc3ce3b9b9340250b/original.png
  if (props.src && props.src.startsWith("https://assets.alpha.art/opt/")) {
    const pp = props.src.split("/");
    const parts = pp.slice(0, pp.length - 1);
    return (
      <picture>
        <source
          type="image/webp"
          srcSet={[
            [...parts, "196.webp"].join("/"),
            [...parts, "256.webp 2x"].join("/"),
          ].join(", ")}
        />
        <img
          loading="lazy"
          src={[...parts, "196.png"].join("/")}
          srcSet={[
            [...parts, "196.png"].join("/"),
            [...parts, "256.png 2x"].join("/"),
          ].join(", ")}
          alt={props.alt}
          className="bg-gray-300 w-40 h-40 shadow-lg border-black border-2 object-center object-cover rounded-full"
        />
      </picture>
    );
  }
  return (
    <img
      src={props.src}
      alt={props.alt}
      className="bg-gray-300 w-40 h-40 shadow-lg border-black border-2 object-center object-cover rounded-full"
    />
  );
}

interface CollectionLink {
  to: string;
  title?: string;
  alt: string;
  Icon: React.ComponentType<{ className?: string }>;
}

function LinksGroup(props: {
  slug: string;
  className?: string;
  links: string[];
}) {
  const location = useLocation();
  const links: CollectionLink[] = [];
  if (location.pathname.endsWith("/activity")) {
    links.push({
      Icon: BiCollection,
      alt: "Collection",
      title: "Collection",
      to: "/collection/" + props.slug,
    });
  } else {
    links.push({
      Icon: BiTrendingUp,
      alt: "Activity",
      title: "Activity",
      to: "/collection/" + props.slug + "/activity",
    });
  }
  /*
  links.push({
    Icon: PencilIcon,
    alt: "Edit",
    to: "/collection/" + props.slug + "/edit",
  });
  */
  for (const link of props.links) {
    if (link.startsWith("https://twitter.com/")) {
      links.push({
        Icon: TwitterIcon,
        alt: "Twitter",
        to: link,
      });
    } else if (link.startsWith("https://discord.gg/")) {
      links.push({
        Icon: DiscordIcon,
        alt: "Discord",
        to: link,
      });
    } else if (link.startsWith("https://howrare.is/")) {
      links.push({
        Icon: HowRareIsIcon,
        alt: "Howrare",
        to: link,
      });
    } else {
      links.push({
        Icon: WebsiteIcon,
        alt: "website",
        to: link,
      });
    }
  }
  return (
    <span
      className={classNames(
        "z-0 inline-flex shadow-sm rounded-md",
        props.className
      )}
    >
      {links.map((l, i) => {
        const isFirst = i === 0;
        const isLast = i === links.length - 1;
        const Icon = l.Icon;
        const Cmp: any = l.to.startsWith("http") ? "a" : Link;
        const newtab = l.to.startsWith("http");
        return (
          <Cmp
            to={l.to}
            href={l.to}
            key={l.to}
            target={newtab ? "_blank" : undefined}
            rel={newtab ? "noreferrer" : undefined}
          >
            <button
              type="button"
              className={classNames(
                "relative inline-flex items-center px-2 py-2",
                isFirst ? "rounded-l-md" : "",
                isLast ? "rounded-r-md" : "",
                "border border-gray-300 bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-600 text-sm font-medium hover:bg-gray-50 focus:z-10 focus:outline-none"
              )}
            >
              <span className="sr-only">{l.alt}</span>
              <Icon className="flex-shrink-0 h-6 w-6" />
              {l.title ? <span className="ml-1">{l.title}</span> : null}
            </button>
          </Cmp>
        );
      })}
    </span>
  );
}

export default function CollectionHeader(props: { collectionID: string }) {
  const [collectionMeta, isLoading] = useCollection(props.collectionID);
  // const floorPrice = useSelector(
  //   (data) => data.floorPrices[props.collectionID]
  // );
  const floorPrice = 10;

  const stats = [
    {
      name: "items",
      stat: isLoading
        ? 0
        : nFormatter(collectionMeta?.collection?.total_items ?? 10000, 1),
    },
    {
      name: "owners",
      stat: isLoading
        ? 0
        : nFormatter(collectionMeta?.collection?.ownerCount ?? 0, 1),
    },
    {
      name: "floor",
      stat: isLoading
        ? 0
        : "◎" + lamportsToSOL(floorPrice ?? collectionMeta?.floorPrice ?? 0),
    },
    {
      name: "volume",
      stat: isLoading
        ? 0
        : "◎" +
          nFormatter(lamportsToSOL(collectionMeta?.collection?.volume ?? 0), 1),
    },
  ];

  return (
    <div>
      <Helmet>
        <title>
          Alpha.art | {collectionMeta?.collection?.title ?? props.collectionID}
        </title>
      </Helmet>
      <img
        src={collectionMeta?.collection?.banner}
        alt=""
        className="w-full h-52 object-center object-cover"
      />
      <div className="flex flex-col items-center justify-center -mt-24 relative">
        <Link to={"/collection/" + props.collectionID}>
          <Image src={collectionMeta?.collection?.thumbnail!} alt="" />
        </Link>
        <LinksGroup
          slug={props.collectionID}
          className="hidden sm:inline-flex absolute right-16 top-28"
          links={collectionMeta?.collection?.links ?? []}
        />
        <h1 className="text-4xl font-extrabold tracking-tight mt-4">
          {collectionMeta?.collection?.title}
        </h1>
        <dl className="mt-5 grid grid-cols-4 gap-1 sm:gap-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="has-tooltip px-2 py-2 bg-white dark:bg-zinc-800 border-gray-100 dark:border-zinc-600 shadow-lg hover:shadow-2xl border rounded-lg overflow-hidden sm:p-4 sm:px-8 transition-shadow duration-500 "
            >
              {isLoading ? (
                <dd className="text-xl text-center font-semibold">
                  <Spinner size={16} />
                </dd>
              ) : (
                <dd className="text-xl text-center font-semibold">
                  {item.stat}
                </dd>
              )}
              <dt className="text-sm text-center font-light truncate mt-1 ">
                {item.name}
              </dt>
            </div>
          ))}
        </dl>
        <h3 className="text-lg ml-2 mr-2 font-normal text-center tracking-tight mt-4 max-w-2xl">
          {collectionMeta?.collection?.description}
        </h3>
        <LinksGroup
          slug={props.collectionID}
          className="inline-flex sm:hidden mt-2"
          links={collectionMeta?.collection?.links ?? []}
        />
      </div>
    </div>
  );
}
