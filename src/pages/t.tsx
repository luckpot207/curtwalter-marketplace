import { Fragment, useState, useEffect } from "react";
import { Tab, Transition } from "@headlessui/react";
import { BiCheckCircle as CheckCircleIcon } from "react-icons/bi";
import {
  BiX as XIcon,
  BiAlarmExclamation as ExclamationIcon,
} from "react-icons/bi";
import { Link, useParams } from "react-router-dom";
import { useAccounts } from "../utils/useAccounts";
import { TokenInfo } from "../data/custom";
import {
  PublicKey,

} from "@solana/web3.js";
import Links from "../components/links";
import BN from "bn.js";
import { Layout } from "../componentsV3/layout/Layout";
import { TradingHistory } from "../components/TradingHistory";
import { Spinner } from "../lib/flowbite-react";
import classNames from "classnames";
import { Helmet } from "react-helmet";
import { addNotification } from "../utils/alert";
import { lamportsToSOL } from "../lib/utils";
import MoonkeesNft from "../assets/nfts/moonkes.png";
import { FakeTokenPage } from "../components/fakes/FakeTokenPage";
import { ObjectContainCollections, TwitterStyleCollections } from "../custom";
import AccountName from "../components/accountName";
import { Trait } from "../data/metadata.pb";

function Notification(props: any) {
  const [show, setShow] = useState(true);
  return (
    <div className="w-full flex flex-col items-center space-y-4 sm:items-start mt-2">
      {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {props.type === "error" ? (
                  <ExclamationIcon
                    className="h-6 w-6 text-red-400"
                    aria-hidden="true"
                  />
                ) : (
                  <CheckCircleIcon
                    className="h-6 w-6 text-green-400"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  {props.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">{props.subtitle}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    setShow(false);
                  }}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export function NotificationOverlay() {
  // const notifications = useSelector((data) => data.notifications);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="z-50 fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start flex-col-reverse"
      >
        {/* {notifications.map((n) => (
          <Notification key={n.id} {...n} />
        ))} */}
      </div>
    </>
  );
}

export interface EscrowAndPubKey {
  escrow: {
    isInitialized: boolean;
    initializerPubkey: PublicKey;
    tempTokenAccountPubkey: PublicKey;
    mintId: PublicKey;
    price: number | BN;
    updatedAt: number | BN | undefined;
  };
  pubkey: PublicKey;
}

const token = {
  token: {
    currentOwner: "Ted",
    image: MoonkeesNft,
    metadata: {
      name: "Art NFT",
      optimizedImage: MoonkeesNft,
      properties: {
        category: "",
        files: [],
        creator: []
      },
      description: "This is my first NFT",
      attributes: {
        trait_type: "trait1"
      }
    }
  },
  listing: {
    price: 2000
  },
  owner: {},
  collection: {},
  offers: [],
  history: []
}

const escrowdata = {
  escrow: {
    isInitialized: true,
    initializerPubkey: "feijoef9888923jf98329f",
    tempTokenAccountPubkey: "feijoef9888923jf98329f",
    mintId: "feijoef9888923jf98329f",
    price: 72000,
    updatedAt: undefined
  },
  pubkey: "dwwwaw4a3rf3f3f3f"
}

export function Token() {
  const { pubkey } = useParams<{ pubkey: string }>();
  // const wallet = useWallet()
  // const isConnected = wallet.connected
  let isConnected = true;
  // const wallet = {
  //   publicKey: new PublicKey("fesieofisefs343fef3434f"),
  // };
  // const { userNFTS } = useAccounts(wallet?.publicKey?.toString());

  const [currentOwner, setCurrentOwner] = useState<string | undefined>(
    undefined
  );
  const [priceDate, setPriceDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nft, setNFT] = useState<TokenInfo | undefined>(undefined);
  const [escrow, setEscrow] = useState<EscrowAndPubKey | undefined>(
    undefined
  );
  const [isOwner, setIsOwner] = useState(false);
  const fetchTokenData = (pubkey: string) => {
    // getTokenAndEscrow(pubkey, (token) => {
    //   setNFT(token);
    //   if (wallet && wallet?.publicKey && userNFTS.includes(pubkey)) {
    //     setCurrentOwner(wallet.publicKey.toBase58());
    //   } else {
    //     setCurrentOwner(token.token?.currentOwner);
    //   }
    // }).then(([token, escrowdata]) => {
    setNFT(token as unknown as TokenInfo);
    // setEscrow(escrowdata);
    // if (escrowdata) {
    //   setPriceDate(new Date());
    //   setCurrentOwner(escrowdata.escrow.initializerPubkey.toBase58());
    // } else if (wallet && wallet?.publicKey && userNFTS.includes(pubkey)) {
    //   setCurrentOwner(wallet.publicKey.toBase58());
    // } else {
    //   setCurrentOwner(token.token?.currentOwner);
    // }
    // setIsLoading(false);
    // let check = escrow && !token.listing;
    // if (escrowdata && token.listing) {
    //   if (Number(escrowdata.escrow.price) !== Number(token.listing.price)) {
    //     check = true;
    //   }
    // }
    // if (check && escrowdata) {
    //   addNotification("Checking price again");
    //   controlPrice(escrowdata.pubkey);
    // }
    // });
  };

  useEffect(() => {
    fetchTokenData(pubkey!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (userNFTS.includes(pubkey!)) {
  //     setIsOwner(true);
  //   } else if (nft && escrow && wallet) {
  //     const walletPubKey = wallet.publicKey?.toBase58();
  //     setIsOwner(walletPubKey === escrow.escrow.initializerPubkey.toBase58());
  //   } else if (nft && wallet) {
  //     const walletPubKey = wallet.publicKey?.toBase58();
  //     setIsOwner(walletPubKey === nft.token?.currentOwner);
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nft, escrow, wallet, userNFTS]);

  useEffect(() => {
    // if (nft) {
    //   SetNFT(nft);
    // }

    // return () => {
    //   SetNFT({});
    // };
    setNFT(token as unknown as TokenInfo);
  }, [nft]);

  if (!nft) {
    return <FakeTokenPage />;
  }

  return (
    <Layout disableFlex={true}>
      <Helmet>
        <title>
          Alpha.art |{" "}
          {nft.token?.metadata?.name ?? nft.collection?.title ?? "NFT"}
        </title>
        <meta
          property="og:title"
          content={`Alpha Art | ${nft.token?.metadata?.name}`}
        />
        <meta property="og:description" content={nft.collection?.description} />
        <meta
          property="og:image"
          content={nft.token?.optimizedImage ?? nft.token?.image}
        />
        <meta property="og:url" content={`http://localhost:3000/t/${pubkey}`} />
        <meta
          name="twitter:title"
          content={`Alpha Art | ${nft.token?.metadata?.name}`}
        />
        <meta
          name="twitter:description"
          content={nft.collection?.description}
        />
        <meta
          name="twitter:image"
          content={nft.token?.optimizedImage ?? nft.token?.image}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlphaArtMarket" />
      </Helmet>
      <div className="mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:row-end-1 lg:col-span-4">
            <TokenImage nft={nft} />
          </div>

          {/* Product details */}
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mx-0 lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4">
            <div className="flex flex-col-reverse">
              <div className="mt-2">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {nft.token?.metadata?.name}
                </h1>

                <h2 id="information-heading" className="sr-only">
                  Token information
                </h2>

                <Link to={"/user/" + currentOwner}>
                  <p className="text-sm mt-2">
                    Owned by{" "}
                    <AccountName pubkey={currentOwner!} user={nft.owner} />
                  </p>
                </Link>

              </div>

              <div>
                <Link to={"/collection/" + nft.collection?.slug}>
                  <p className="text-sm mt-2">
                    {nft.collection?.title}
                  </p>
                </Link>
              </div>
            </div>

            {isLoading ? (
              <Spinner className="mt-8" />
            ) : (
              <>
                {escrow && (
                  <>
                    <p className="mt-6 text-sm">Current Price:</p>
                    <p className="mt-2 text-3xl font-bold">
                      ◎ {lamportsToSOL(Number(escrow.escrow.price))}
                    </p>
                  </>
                )}
                {/* <NFTButtons
                  nft={nft}
                  escrow={escrow}
                  isOwner={isOwner}
                  disabled={!wallet || !isConnected}
                  priceDate={priceDate}
                  refetch={() => {
                    setNFT(undefined);
                    fetchTokenData(pubkey!);
                  }}
                /> */}
              </>
            )}

            <NftAttributes nft={nft} />
            {/* <NftOffers nft={nft} isOwner={isOwner} escrow={escrow} /> */}
          </div>

          <NftTabInfo nft={nft} />
        </div>
        <NftOtherFiles nft={nft} />
        <div
          className="border-t border-gray-200 mt-16 pt-10"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          <TradingHistory resourceType="TOKEN" id={pubkey!} />
        </div>
      </div>
    </Layout>
  );
}

export function MyToken() {
  const { pubkey } = useParams<{ pubkey: string }>();
  // const wallet = useWallet()
  // const isConnected = wallet.connected
  let isConnected = true;
  // const wallet = {
  //   publicKey: new PublicKey("fesieofisefs343fef3434f"),
  // };
  // const { userNFTS } = useAccounts(wallet?.publicKey?.toString());

  const [currentOwner, setCurrentOwner] = useState<string | undefined>(
    undefined
  );
  const [priceDate, setPriceDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nft, setNFT] = useState<TokenInfo | undefined>(undefined);
  const [escrow, setEscrow] = useState<EscrowAndPubKey | undefined>(
    undefined
  );
  const [isOwner, setIsOwner] = useState(false);
  const fetchTokenData = (pubkey: string) => {
    // getTokenAndEscrow(pubkey, (token) => {
    //   setNFT(token);
    //   if (wallet && wallet?.publicKey && userNFTS.includes(pubkey)) {
    //     setCurrentOwner(wallet.publicKey.toBase58());
    //   } else {
    //     setCurrentOwner(token.token?.currentOwner);
    //   }
    // }).then(([token, escrowdata]) => {
    // setNFT(token as unknown as TokenInfo);
    // setEscrow(escrowdata);
    // if (escrowdata) {
    //   setPriceDate(new Date());
    //   setCurrentOwner(escrowdata.escrow.initializerPubkey.toBase58());
    // } else if (wallet && wallet?.publicKey && userNFTS.includes(pubkey)) {
    //   setCurrentOwner(wallet.publicKey.toBase58());
    // } else {
    //   setCurrentOwner(token.token?.currentOwner);
    // }
    // setIsLoading(false);
    let check = escrow && !token.listing;
    // if (escrowdata && token.listing) {
    //   if (Number(escrowdata.escrow.price) !== Number(token.listing.price)) {
    //     check = true;
    //   }
    // }
    // if (check && escrowdata) {
    //   addNotification("Checking price again");
    //   controlPrice(escrowdata.pubkey);
    // }
    // });
  };

  useEffect(() => {
    fetchTokenData(pubkey!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   // if (userNFTS.includes(pubkey!)) {
  //   //   setIsOwner(true);
  //   // } else if (nft && escrow && wallet) {
  //   //   const walletPubKey = wallet.publicKey?.toBase58();
  //   //   setIsOwner(walletPubKey === escrow.escrow.initializerPubkey.toBase58());
  //   // } else if (nft && wallet) {
  //   //   const walletPubKey = wallet.publicKey?.toBase58();
  //   //   setIsOwner(walletPubKey === nft.token?.currentOwner);
  //   // }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [nft, escrow, wallet, userNFTS]);

  useEffect(() => {
    // if (nft) {
    //   SetNFT(nft);
    // }

    // return () => {
    //   SetNFT({});
    // };
    setNFT(token as unknown as TokenInfo);
  }, [nft]);

  if (!nft) {
    return <FakeTokenPage />;
  }

  return (
    <Layout disableFlex={true}>
      <Helmet>
        <title>
          Alpha.art |{" "}
          {nft.token?.metadata?.name ?? nft.collection?.title ?? "NFT"}
        </title>
        <meta
          property="og:title"
          content={`Alpha Art | ${nft.token?.metadata?.name}`}
        />
        <meta property="og:description" content={nft.collection?.description} />
        <meta
          property="og:image"
          content={nft.token?.optimizedImage ?? nft.token?.image}
        />
        <meta property="og:url" content={`http://localhost:3000/t/${pubkey}`} />
        <meta
          name="twitter:title"
          content={`Alpha Art | ${nft.token?.metadata?.name}`}
        />
        <meta
          name="twitter:description"
          content={nft.collection?.description}
        />
        <meta
          name="twitter:image"
          content={nft.token?.optimizedImage ?? nft.token?.image}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@AlphaArtMarket" />
      </Helmet>
      <div className="mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:row-end-1 lg:col-span-4">
            <TokenImage nft={nft} />
          </div>

          {/* Product details */}
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mx-0 lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4">
            <div className="flex flex-col-reverse">
              <div className="mt-2">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {nft.token?.metadata?.name}
                </h1>

                <h2 id="information-heading" className="sr-only">
                  Token information
                </h2>

                <Link to={"/user/" + currentOwner}>
                  <p className="text-sm mt-2">
                    Owned by{" "}
                    <AccountName pubkey={currentOwner!} user={nft.owner} />
                  </p>
                </Link>

              </div>

              <div>
                <Link to={"/collection/" + nft.collection?.slug}>
                  <p className="text-sm mt-2">
                    {nft.collection?.title}
                  </p>
                </Link>
              </div>
            </div>

            {isLoading ? (
              <Spinner className="mt-8" />
            ) : (
              <>
                {escrow && (
                  <>
                    <p className="mt-6 text-sm">Current Price:</p>
                    <p className="mt-2 text-3xl font-bold">
                      ◎ {lamportsToSOL(Number(escrow.escrow.price))}
                    </p>
                  </>
                )}
                <MyNFTButtons
                />
              </>
            )}

            <NftAttributes nft={nft} />
            {/* <NftOffers nft={nft} isOwner={isOwner} escrow={escrow} /> */}
          </div>

          <NftTabInfo nft={nft} />
        </div>
        {/* <NftOtherFiles nft={nft} /> */}
        {/* <div
          className="border-t border-gray-200 mt-16 pt-10"
          style={{ maxHeight: "calc(100vh - 140px)" }}
        >
          <TradingHistory resourceType="TOKEN" id={pubkey!} />
        </div> */}
      </div>
    </Layout>
  );
}

function TokenImage(props: { nft: TokenInfo }) {
  const { nft } = props;

  const videos =
    props.nft.token?.metadata?.properties?.files?.filter((f) =>
      f.type?.startsWith("video/")
    ) ?? [];
  const frames =
    props.nft.token?.metadata?.properties?.files?.filter(
      (f) => f.type === "text/html"
    ) ?? [];
  if (frames.length >= 1) {
    return (
      <div
        className={classNames(
          "aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
        )}
      >
        <iframe
          src={frames[0].uri}
          title="HTML content"
          sandbox="allow-scripts"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          frameBorder={0}
        />
      </div>
    );
  }
  if (videos?.length >= 1) {
    return (
      <div
        className={classNames(
          "aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
        )}
      >
        <video src={videos[0].uri} muted autoPlay controls loop />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        TwitterStyleCollections.includes(nft.collection?.slug!)
          ? "aspect-w-3 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
          : "aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
      )}
    >
      {!TwitterStyleCollections.includes(nft.collection?.slug!) &&
        typeof nft.token?.optimizedImage === "string" ? (
        <picture>
          <source
            type="image/webp"
            srcSet={nft.token?.optimizedImage.replace(
              "original.png",
              "original.webp"
            )}
          />
          <img
            src={nft.token?.optimizedImage}
            alt={nft.token?.metadata?.description}
            className={
              ObjectContainCollections.includes(nft.collection?.slug!)
                ? "object-center object-contain w-full h-full"
                : "object-center object-cover w-full h-full"
            }
          />
        </picture>
      ) : (
        <img
          src={nft.token?.image}
          alt={nft.token?.metadata?.description}
          className={
            ObjectContainCollections.includes(nft.collection?.slug!)
              ? "object-center object-contain w-full h-full"
              : "object-center object-cover w-full h-full"
          }
        />
      )}
    </div>
  );
}


const NftTabInfo = (props: { nft: TokenInfo }) => {
  const { nft } = props;
  return (
    <div className="w-full max-w-2xl mx-auto mt-16 mb-8 lg:max-w-none lg:mt-0 lg:col-span-4">
      <Tab.Group as="div">
        <div className="border-b border-gray-200 dark:border-zinc-400 mb-3">
          <Tab.List className="-mb-px flex space-x-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? "border-gray-600 dark:border-white"
                    : "border-transparent",
                  "whitespace-nowrap py-6 border-b-2 font-medium text-sm"
                )
              }
            >
              About {nft.collection?.title}
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  selected
                    ? "border-gray-600 dark:border-white"
                    : "border-transparent",
                  "whitespace-nowrap py-6 border-b-2 font-medium text-sm"
                )
              }
            >
              Account Details
            </Tab>
          </Tab.List>
        </div>
        <Tab.Panels as={Fragment}>
          <Tab.Panel className="pt-2">
            <h3 className="sr-only">License</h3>
            <p className="text-base -mt-3">
              {nft.collection?.description}
            </p>
            <Links
              links={nft.collection?.links!}
              name={nft.token?.metadata?.name}
            />
          </Tab.Panel>
          <Tab.Panel as="dl" className="text-sm">
            <h3 className="sr-only">Frequently Asked Questions</h3>
            <AccountInfoRow
              title="Update Authority"
              value={nft.collection?.authorityPubkey!}
              lintToExplorer
            />
            <AccountInfoRow
              title="Token Address"
              value={nft.token?.mintPubkey!}
              lintToExplorer
            />
            <AccountInfoRow title="Collection" value={nft.collection?.title!} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

const NftAttributes = ((props: { nft: TokenInfo }) => {
  const { nft } = props;
  // const [collectionMeta, _] = useCollection(nft?.collection?.slug ?? "");
  const collectionMeta = {
    traits: [
      {
        key: "trait1",
        numbers: [
          {
            value: "traitValue1",
            amount: 340,
            floor: 100
          },
          {
            value: "traitValue2",
            amount: 340,
            floor: 100
          }
        ]
      }
    ]
  };
  return (
    <div className="border-t border-gray-200 mt-10 pt-10">
      <div className="flex flex-wrap">
        {nft.token?.metadata?.attributes?.map((att) => {
          const isVisibleTrait = !!collectionMeta?.traits?.find(
            (t: any) => t.key === att.trait_type
          );
          const body = (
            <div
              key={att.trait_type}
              className="border border-gray-500 rounded-lg pointer-events-none p-2 m-1 w-36"
              aria-hidden="true"
            >
              <p className="text-base font-medium">
                {att.trait_type}
              </p>
              <p className="mt-1 text-sm">{att.value}</p>
              {/*
              <NftAttributePercent
                trait={att}
                collectionMeta={collectionMeta}
              />*/}
            </div>
          );
          if (isVisibleTrait) {
            return (
              <Link
                key={"link_" + att.trait_type}
                to={`/collection/${nft?.collection?.slug}?${encodeURIComponent(
                  att.trait_type!
                )}=${encodeURIComponent(att.value!)}&Status=-BUY_NOW`}
              >
                {body}
              </Link>
            );
          } else {
            return body;
          }
        })}
      </div>
    </div>
  );
});

const AccountInfoRow = ((props: {
  title: string;
  value: string;
  lintToExplorer?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      <dt className="font-medium">{props.title}</dt>
      <dd className="prose prose-sm max-w-none">
        {props.lintToExplorer ? (
          <a
            href={"https://explorer.solana.com/address/" + props.value}
            target="_blank"
            rel="noreferrer"
          >
            <p>{props.value}</p>
          </a>
        ) : (
          <p>{props.value}</p>
        )}
      </dd>
    </div>
  );
})

const NftOtherFiles = ((props: { nft: TokenInfo }) => {
  const images =
    props.nft.token?.metadata?.properties?.files?.filter((f) =>
      f.type?.startsWith("image/")
    ) ?? [];
  if (images?.length < 2) {
    return null;
  }
  return (
    <div className="border-t border-gray-200 mt-8 pt-4 overflow-y-scroll">
      <h3 className="text-sm font-medium text-gray-900">All Files</h3>
      <div className="flex max-h-36">
        {images.map((i) => (
          <img
            key={i.uri}
            src={i.uri}
            alt=""
            className="object-center object-contain h-full max-h-32 mr-2 my-2 rounded-lg"
          />
        ))}
      </div>
    </div>
  );
})

const MyNFTButtons = ((props: {

}) => {




  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 nightwind-prevent-block">

      <button
        type="button"
        className={classNames(
          "w-full border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500",
        )}
        onClick={() => {

        }}
      >
        SELL
      </button>
      <button
        type="button"
        onClick={() => {

        }}
        className={classNames(
          "w-full bg-gray-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 ",
        )}
      >
        Make SOL Offer
      </button>

    </div>
  );

})

// function NftOffers(props: {
//   nft: TokenInfo;
//   isOwner: boolean;
//   escrow?: EscrowAndPubKey;
// }) {
//   const { nft, isOwner } = props;
//   const wallet = useWallet()
//   const { nftOffers } = useSelector((state) => ({
//     nftOffers: state.nftOffers[nft.token?.mintPubkey!],
//   }));
//   const [offers, setOffers] = useState<OfferData[]>([]);
//   const [cancelOffer, setCancelOffer] = useState<OfferData | undefined>(
//     undefined
//   );
//   const [acceptOffer, setAcceptOffer] = useState<OfferData | undefined>(
//     undefined
//   );
//   const [nftOffer, setNFTOffer] = useState<NFTOfferData | undefined>(
//     undefined
//   );
//   const [showActions, setShowActions] = useState<boolean>(isOwner);
//   useEffect(() => {
//     fetchOffers(nft.token?.mintPubkey!);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [nft.token?.mintPubkey]);

//   useEffect(() => {
//     if (nftOffers) {
//       const now = Date.now() / 1000;
//       setOffers(
//         nftOffers
//           .map((r) => {
//             const expiresAtSec = Number(r.offer.expiresAt.toString(10));
//             const expiresAt = new Date(expiresAtSec * 1000);
//             return {
//               ...r,
//               expiresAt: expiresAt,
//               isExpired: expiresAtSec < now,
//             };
//           })
//           .sort((a, b) => Number(b.offer.price) - Number(a.offer.price))
//       );
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [nftOffers]);

//   useEffect(() => {
//     if (isOwner) {
//       setShowActions(true);
//       return;
//     }
//     let sa = false;
//     let wall = wallet?.publicKey?.toBase58();
//     for (const o of offers) {
//       if (wall && o.offer.initializerPubkey.toBase58() === wall) {
//         sa = true;
//       }
//     }
//     setShowActions(sa);
//   }, [isOwner, offers, wallet?.publicKey]);

//   return (
//     <div className="border-t border-gray-200 mt-10 pt-10">
//       <div className="border border-gray-300 rounded-tl-md rounded-md">
//         <div className="flex p-4 border-b border-gray-300">
//           <ClipboardListIcon className="flex-shrink-0 mr-1 h-5 w-5" />
//           <h3 className="text-sm font-medium">Offers</h3>
//         </div>
//         {!offers.length && (
//           <div className="flex flex-col items-center justify-center h-44">
//             <ClipboardListIcon className="flex-shrink-0 mr-1 h-9 w-9 mb-2" />
//             <span>No offers yet</span>
//           </div>
//         )}
//         {!!offers.length && (
//           <div>
//             <table className="w-full text-gray-500 flex flex-col">
//               <caption className="sr-only">Offers</caption>
//               <thead className="sr-only text-sm text-left sm:not-sr-only flex flex-1">
//               <th
//                 scope="col"
//                 className="font-normal sm:table-cell p-4 flex-1"
//               >
//                 Price/NFTs
//               </th>
//               <th
//                 scope="col"
//                 className="font-normal sm:table-cell p-4 flex-1"
//               >
//                 Expiration
//               </th>
//               <th
//                 scope="col"
//                 className={classNames(
//                   "font-normal p-4 flex-1",
//                   showActions ? "text-center" : "text-right"
//                 )}
//                 style={{ flex: 3 }}
//               >
//                 From
//               </th>
//               {showActions && (
//                 <th scope="col" className="font-normal text-right p-4 flex-1">
//                   Actions
//                 </th>
//               )}
//               </thead>
//               <tbody className="border-b border-gray-200 divide-y text-sm sm:border-t w-full flex flex-col max-h-48 overflow-y-scroll">
//               {offers.map((offer) => {
//                 return (
//                   <OfferRow
//                     key={offer.pubkey.toBase58()}
//                     isOwner={props.isOwner}
//                     offer={offer}
//                     setAcceptOffer={setAcceptOffer}
//                     setCancelOffer={setCancelOffer}
//                     showActions={showActions}
//                     viewNFTOffer={setNFTOffer}
//                   />
//                 );
//               })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       {typeof cancelOffer !== "undefined" && (
//         <CancelOfferDialog
//           offer={cancelOffer.offer}
//           nftPubKey={nft.token!.mintPubkey!}
//           isOpen={typeof cancelOffer !== "undefined"}
//           offerAccount={cancelOffer.pubkey}
//           lamports={Number(cancelOffer.offer.price)}
//           onClose={() => setCancelOffer(undefined)}
//         />
//       )}
//       {typeof acceptOffer !== "undefined" && (
//         <AcceptOfferDialog
//           nft={nft}
//           nftPubKey={nft.token!.mintPubkey!}
//           isOpen={typeof acceptOffer !== "undefined"}
//           offer={acceptOffer}
//           escrowAccount={props.escrow?.pubkey}
//           onClose={() => setAcceptOffer(undefined)}
//         />
//       )}
//       {typeof nftOffer !== "undefined" && (
//         <NFTOfferAcceptDialog
//           nft={nft}
//           nftPubKey={nft.token!.mintPubkey!}
//           isOpen={typeof nftOffer !== "undefined"}
//           data={nftOffer}
//           escrowAccount={props.escrow?.pubkey}
//           onClose={() => setNFTOffer(undefined)}
//         />
//       )}
//     </div>
//   );
// }

// interface OfferData extends OfferAndPubKey {
//   expiresAt: Date;
//   isExpired: boolean;
// }