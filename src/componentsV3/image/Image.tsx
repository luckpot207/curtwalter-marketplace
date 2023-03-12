import React, { useState } from "react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { Picture } from "./Picture";
import { Img } from "./Img";

import placeholder60transparent from "../../assets/placeholder_60_60_transparent.png";
import placeholder120transparent from "../../assets/placeholder_120_120_transparent.png";
import placeholder196transparent from "../../assets/placeholder_196_196_transparent.png";
import placeholder256transparent from "../../assets/placeholder_256_256_transparent.png";
import placeholder340transparent from "../../assets/placeholder_340_340_transparent.png";
import placeholder512transparent from "../../assets/placeholder_512_512_transparent.png";
import placeholder680transparent from "../../assets/placeholder_680_680_transparent.png";

import placeholder60gray from "../../assets/placeholder_60_60_gray400.png";
import placeholder120gray from "../../assets/placeholder_120_120_gray400.png";
import placeholder196gray from "../../assets/placeholder_196_196_gray400.png";
import placeholder256gray from "../../assets/placeholder_256_256_gray400.png";
import placeholder340gray from "../../assets/placeholder_340_340_gray400.png";
import placeholder512gray from "../../assets/placeholder_512_512_gray400.png";
import placeholder680gray from "../../assets/placeholder_680_680_gray400.png";

export type ImageProps = {
  src: string;
  enforceSrc?: boolean;
  alt?: string;
  resize?: "contain" | "cover";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  placeholder?: "blur" | "empty";
  loading?: "lazy" | "eager";
};

export const ImageSizeMapper = {
  xs: [60, 120],
  sm: [120, 196],
  md: [196, 256],
  lg: [256, 340],
  xl: [340, 512],
  "2xl": [512, 680],
  "3xl": [680, 960],
};

export function placeholderImgSrc(
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl",
  color: "gray" | "transparent"
) {
  if (size === "xs") {
    if (color === "transparent") return placeholder60transparent;
    if (color === "gray") return placeholder60gray;
  }
  if (size === "sm") {
    if (color === "transparent") return placeholder120transparent;
    if (color === "gray") return placeholder120gray;
  }
  if (size === "md") {
    if (color === "transparent") return placeholder196transparent;
    if (color === "gray") return placeholder196gray;
  }
  if (size === "lg") {
    if (color === "transparent") return placeholder256transparent;
    if (color === "gray") return placeholder256gray;
  }
  if (size === "xl") {
    if (color === "transparent") return placeholder340transparent;
    if (color === "gray") return placeholder340gray;
  }
  if (size === "2xl") {
    if (color === "transparent") return placeholder512transparent;
    if (color === "gray") return placeholder512gray;
  }
  if (size === "3xl") {
    if (color === "transparent") return placeholder680transparent;
    if (color === "gray") return placeholder680gray;
  }
  return placeholder680transparent;
}

export function cloudinaryImageUrl(src: string, width: number) {
  return new CloudinaryImage(src, { cloudName: "alpha-art" })
    .addTransformation(`w_256`)
    .setDeliveryType("fetch")
    .toURL();
}

export function imageProxyUrl(
  url: string,
  type: "token" | "collection" | "listing"
) {
  if (url.startsWith("https://assets.alpha.art/opt/")) {
    return url;
  }
  if (url.startsWith("ipfs://")) {
    const pp = url.split("/");
    const cid = pp.slice(0, pp.length)[2];
    const filename = pp.slice(0, pp.length)[3]
      ? "/" + pp.slice(0, pp.length)[3]
      : "";
    const hostname = "https://ipfs.io/ipfs/";
    const src = hostname + cid + filename;
    // console.log(src);
    return src;
  }
  // return `https://img.alpha.art/${type}/${url}`;
  return url;
}

export function Image({
  src,
  enforceSrc,
  alt,
  resize,
  size,
  className,
  placeholder,
  loading,
}: ImageProps) {
  if (!src) {
    return (
      <Img
        src={placeholderImgSrc(size, "transparent")}
        alt={alt}
        className={className}
        resize={resize}
      />
    );
  }

  if (!enforceSrc && src.startsWith("https://assets.alpha.art/opt/")) {
    const pp = src.split("/");
    const parts = pp.slice(0, pp.length - 1);

    return (
      <Picture
        src={[...parts, `${ImageSizeMapper[size][0]}.png`].join("/")}
        srcSet={[
          [...parts, `${ImageSizeMapper[size][0]}.png`].join("/"),
          [...parts, `${ImageSizeMapper[size][1]}.png 2x`].join("/"),
        ].join(", ")}
        loading={loading}
        alt={alt}
        resize={resize}
        className={className}
        placeholder={placeholder}
        placeholderImgSrc={placeholderImgSrc(size, "gray")}
      />
    );
  } else {
    if (enforceSrc) {
      return (
        <Img
          src={src}
          loading={loading}
          alt={alt}
          resize={resize}
          className={className}
          placeholder={placeholder}
          placeholderImgSrc={placeholderImgSrc(size, "gray")}
        />
      );
    }

    return (
      <Img
        // src={cloudinaryImageUrl(src, ImageSizeMapper[size][0])}
        src={src}
        srcSet={[
          cloudinaryImageUrl(src, ImageSizeMapper[size][0]),
          cloudinaryImageUrl(src, ImageSizeMapper[size][1]),
        ].join(", ")}
        loading={loading}
        alt={alt}
        resize={resize}
        className={className}
        placeholder={placeholder}
        placeholderImgSrc={placeholderImgSrc(size, "gray")}
      />
    );
  }
}
