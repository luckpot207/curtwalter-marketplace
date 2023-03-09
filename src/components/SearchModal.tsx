/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CollectionSearch from "./CollectionSearch";
import { NFTSearch } from "./NFTSearch";

export function Image(props: { src: string; alt?: string }) {
  //https://assets.alpha.art/opt/c/d/cd5215107005896ce88e2b0cc3ce3b9b9340250b/original.png
  if (props.src && props.src.startsWith("https://assets.alpha.art/opt/")) {
    const pp = props.src.split("/");
    const parts = pp.slice(0, pp.length - 1);
    return (
      <div className="rounded-md w-20 h-20 group-hover:opacity-60">
        <picture className="bg-gray-100 w-full h-full">
          <source
            type="image/webp"
            srcSet={[
              [...parts, "60.webp"].join("/"),
              [...parts, "120.webp 2x"].join("/"),
            ].join(", ")}
          />
          <img
            loading="lazy"
            src={[...parts, "60.png"].join("/")}
            srcSet={[
              [...parts, "60.png"].join("/"),
              [...parts, "120.png 2x"].join("/"),
            ].join(", ")}
            width="80"
            height="80"
            alt={props.alt}
          />
        </picture>
      </div>
    );
  }
  return (
    <img
      src={props.src}
      alt={props.alt}
      width="80"
      height="80"
      className="rounded-md w-20 h-20 bg-gray-100 group-hover:opacity-60"
    />
  );
}

export function SearchModal({
  collectionKey,
  open,
  onClose,
}: {
  collectionKey?: string;
  open: boolean;
  onClose: () => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={() => onClose()}
      >
        <div className="flex min-h-screen pt-4 px-4 pb-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-center">
              {collectionKey ? (
                <NFTSearch collectionKey={collectionKey} onClose={onClose} />
              ) : (
                <div className="max-w-lg w-full h-full max-h-80 sm:max-h-96">
                  <CollectionSearch onClose={onClose} />
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
