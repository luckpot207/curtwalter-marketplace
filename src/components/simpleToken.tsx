import { TokenAPISimple } from "../data/marketplace.pb";
import { lamportsToSOL } from "../utils/sol";
import { Link } from "react-router-dom";
import React from "react";

export type ItemShowField = "lastPrice" | "offerPrice";

export function Image(props: {
  src: string;
  alt?: string;
  resize: "contain" | "cover";
  rounded?: boolean;
}) {
  const rounded = props.rounded ? " rounded-2xl" : "";

  //https://assets.alpha.art/opt/c/d/cd5215107005896ce88e2b0cc3ce3b9b9340250b/original.png
  if (props.src.startsWith("ipfs://")) {
    const pp = props.src.split("/");
    const cid = pp.slice(0, pp.length)[2];
    const filename = pp.slice(0, pp.length)[3];
    const hostname = "https://ipfs.io/ipfs/";
    const sublink = ".ipfs.nftstorage.link/";
    const src = hostname + cid + "/" + filename;
    console.log(src);
    const parts = pp.slice(0, pp.length - 1);
    return (
      <picture>
        <source
          type="image/webp"
          srcSet={[
            [...parts, "340.webp"].join("/"),
            [...parts, "680.webp 2x"].join("/"),
          ].join(", ")}
        />
        <img
          loading="lazy"
          src={src}
          // src={[...parts, "340.png"].join("/")}
          // srcSet={[
          //   [...parts, "340.png"].join("/"),
          //   [...parts, "680.png 2x"].join("/"),
          // ].join(", ")}
          alt={props.alt}
          className={
            props.resize === "contain"
              ? `w-full h-full object-center object-contain group-hover:opacity-60${rounded}`
              : `w-full h-full object-center object-cover group-hover:opacity-60${rounded}`
          }
        />
      </picture>
    );
  }
  return (
    <img
      loading="lazy"
      src={props.src}
      alt={props.alt}
      className={
        props.resize === "contain"
          ? `w-full h-full object-center object-contain group-hover:opacity-60${rounded}`
          : `w-full h-full object-center object-cover group-hover:opacity-60${rounded}`
      }
    />
  );
}

export function LargeImage(props: { src: string; alt?: string }) {
  //https://assets.alpha.art/opt/c/d/cd5215107005896ce88e2b0cc3ce3b9b9340250b/original.png
  if (props.src.startsWith("https://assets.alpha.art/opt/")) {
    const pp = props.src.split("/");
    const parts = pp.slice(0, pp.length - 1);
    return (
      <picture>
        <source
          type="image/webp"
          srcSet={[
            [...parts, "680.webp"].join("/"),
            [...parts, "960.webp 2x"].join("/"),
          ].join(", ")}
        />
        <img
          loading="lazy"
          src={[...parts, "680.png"].join("/")}
          srcSet={[
            [...parts, "680.png"].join("/"),
            [...parts, "960.png 2x"].join("/"),
          ].join(", ")}
          alt={props.alt}
          className="w-full h-full object-center object-cover group-hover:opacity-60 "
        />
      </picture>
    );
  }
  return (
    <img
      loading="lazy"
      src={props.src}
      alt={props.alt}
      className="w-full h-full object-center object-cover group-hover:opacity-60 "
    />
  );
}

export default function Item(
  props: TokenAPISimple & {
    showField?: ItemShowField;
    size?: "twitter" | "rect";
    resize?: "contain" | "cover";
    aProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  }
) {
  const { size = "rect", resize = "cover" } = props;
  let rightPricing = null;
  if (props.listedForSale) {
    const price = <h3 className="text-base">◎ {lamportsToSOL(props.price)}</h3>;
    let second = null;
    if (props.showField === "offerPrice" && (props.offerPrice ?? -1) > 0) {
      second = (
        <div className="flex items-center">
          <p className="text-xs text-right font-light mr-1">Max Offer</p>
          <h3 className="text-sm">◎{lamportsToSOL(props.offerPrice)}</h3>
        </div>
      );
    } else if (props.showField === "lastPrice" && (props.last ?? -1) > 0) {
      second = (
        <div className="flex items-center">
          <p className="text-xs text-right font-light  mr-1">Last</p>
          <h3 className="text-sm">◎{lamportsToSOL(props.last)}</h3>
        </div>
      );
    }
    rightPricing = (
      <div className="flex flex-col items-end">{[price, second]}</div>
    );
  } else if (props.showField === "offerPrice" && (props.offerPrice ?? -1) > 0) {
    rightPricing = (
      <div className="flex flex-col items-end">
        <p className="text-xs text-right font-light">Max Offer</p>
        <h3 className="text-xs">◎{lamportsToSOL(props.offerPrice)}</h3>
      </div>
    );
  } else if (props.last) {
    rightPricing = (
      <div className="flex flex-col items-end">
        <p className="text-xs text-right font-light">Last</p>
        <h3 className="text-sm">◎{lamportsToSOL(props.last)}</h3>
      </div>
    );
  }
  const ap = props.aProps ?? {};
  return (
    <Link to={`/t/${props.mintId}`} className="group" {...ap}>
      <div
        className={
          size === "twitter"
            ? "w-full aspect-w-3 aspect-h-1 rounded-lg overflow-hidden xl:aspect-w-9 xl:aspect-h-3"
            : "w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden xl:aspect-w-8 xl:aspect-h-8"
        }
      >
        {size === "rect" ? (
          <Image src={props.image!} alt={props.title} resize={resize} />
        ) : (
          <LargeImage src={props.image!} alt={props.title} />
        )}
      </div>
      <div className="flex justify-between pl-2 pr-2 mt-4">
        <h3 className="flex-1 mr-1 text-base">{props.title}</h3>
        {rightPricing}
      </div>
    </Link>
  );
}
