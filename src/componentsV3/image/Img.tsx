import classNames from "classnames";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useIntersection} from "../../lib/next/client/use-intersection";

const loadedImageURLs = new Set<string>()

export type ImgProps = {
  src: string
  srcSet?: string
  loading?: 'lazy' | 'eager'
  alt?: string;
  resize?: "contain" | "cover";
  className?: string,
  placeholder?: 'blur' | 'empty'
  placeholderImgSrc?: string
}

type ImgElementWithDataProp = HTMLImageElement & {
  'data-loaded-src': string | undefined
}

type OnLoadingComplete = (result: {
  naturalWidth: number
  naturalHeight: number
}) => void


export function Img({ src, srcSet, alt, loading, resize, className, placeholder, placeholderImgSrc }: ImgProps) {
  const imgProps: ImgProps = { src }
  if (srcSet) imgProps.srcSet = srcSet
  if (alt) imgProps.alt = alt

  let isLazy = (loading === 'lazy' || typeof loading === 'undefined')
  if (src.startsWith('data:') || src.startsWith('blob:')) {
    isLazy = false
  }
  if (typeof window !== 'undefined' && loadedImageURLs.has(src)) {
    isLazy = false
  }

  const [blurComplete, setBlurComplete] = useState(false)
  const [setIntersection, isIntersected, resetIntersected] = useIntersection<HTMLImageElement>({
    rootRef: null,
    rootMargin: '200px',
    disabled: !isLazy,
  })
  const isVisible = !isLazy || isIntersected

  const blurStyle =
    placeholder === 'blur' && !blurComplete
      ? {
        filter: 'blur(20px)',
        backgroundSize: resize,
        backgroundImage: `url("${placeholderImgSrc}")`,
        backgroundPosition: '0% 0%',
      }
      : {}

  return (
    <>
      <img
        loading={ loading || 'lazy' }
        src={isVisible ? src : placeholderImgSrc}
        srcSet={isVisible ? src : srcSet}
        alt={alt}
        decoding="async"
        style={{...blurStyle }}
        className={classNames(
          'w-full h-full object-center',
          {
            'object-contain': resize === 'contain',
            'object-cover': resize === 'cover',
          },
          className
        )}
        ref={useCallback(
          (img: ImgElementWithDataProp) => {
            setIntersection(img)
            if (img?.complete) {
              handleLoading(
                img,
                src,
                placeholder ? placeholder : 'empty',
                setBlurComplete
              )
            }
          },
          [
            setIntersection,
            src,
            placeholder,
            setBlurComplete,
          ]
        )}
        onLoad={(event) => {
          const img = event.currentTarget as ImgElementWithDataProp
          handleLoading(
            img,
            src,
            placeholder ? placeholder : 'empty',
            setBlurComplete
          )
        }}
        onError={(event) => {
          if (placeholder === 'blur') {
            // If the real image fails to load, this will still remove the placeholder.
            setBlurComplete(true)
          }
        }}
      />
    </>
  )
}

function handleLoading(
  img: ImgElementWithDataProp,
  src: string,
  placeholder: 'blur' | 'empty',
  setBlurComplete: (b: boolean) => void
) {
  if (!img || img['data-loaded-src'] === src) {
    return
  }
  img['data-loaded-src'] = src
  const p = 'decode' in img ? img.decode() : Promise.resolve()
  p.catch(() => {}).then(() => {
    if (!img.parentNode) {
      // Exit early in case of race condition:
      // - onload() is called
      // - decode() is called but incomplete
      // - unmount is called
      // - decode() completes
      return
    }
    loadedImageURLs.add(src)
    if (placeholder === 'blur') {
      setBlurComplete(true)
    }
  })
}