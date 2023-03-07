import React from "react";
import {Img} from "./Img";

export type PictureProps = {
  src: string
  srcSet: string
  loading?: 'lazy' | 'eager'
  alt?: string;
  resize?: "contain" | "cover";
  className?: string,
  placeholder?: 'blur' | 'empty'
  placeholderImgSrc?: string
}

export function Picture({ src, srcSet, loading, alt, resize, className, placeholder, placeholderImgSrc }: PictureProps) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={srcSet}
      />
      <Img
        src={src}
        srcSet={srcSet}
        loading={loading}
        alt={alt}
        resize={resize}
        className={className}
        placeholder={placeholder}
        placeholderImgSrc={placeholderImgSrc}
      />
    </picture>
  );
}