import React, { Fragment } from "react";
import { useSelector } from "../api/store";
import { FakeSimpleTokenList } from "../components/fakes/FakeSimpleTokenList";
import { classNames } from "../utils/clsx";
import { ConnectWalletDialog } from "../components/token/modals";
import { getStakeAccount } from "../api/app/utils";
import { StakeUserData } from "../api/app/instructions";
import { getTokenList } from "../api/api";
import { addNotification } from "../utils/alert";
import { TokenAPISimple } from "../data/marketplace.pb";
import { Helmet } from "react-helmet";
import { Listbox, Transition } from "@headlessui/react";
import { BiCheck as CheckIcon, BiSelection as SelectorIcon } from "react-icons/bi";
import SimpleToken from "../components/simpleToken";
import Button from "../components/button";
import { Link } from "react-router-dom";
import Modal from "../components/dialog";
import { Spinner } from "../components/spiners";
import { stakePiggies, unstakePiggy } from "../api/actions";
import { Layout } from "../componentsV3/layout/Layout";
import { useStore } from "../lib/store";

const footerNavigation = {
  bottomLinks: [
    { name: "FAQ", href: "/faq" },
    { name: "Privacy", href: "/privacy" },
    // { name: "Terms", href: "#" },
  ],
};

function useAccounts(
  pubkey?: "PublicKey" | null,
  refIndex?: number
): {
  ready: boolean;
  userNFTS: string[];
  stake?: StakeUserData;
} {
  const connection = useSelector((data) => data.connection);
  const [userNFTS, setUserNFTS] = React.useState<string[]>();
  const [stakeData, setStakeData] = React.useState<StakeUserData | undefined>();

  React.useEffect(() => {
    setUserNFTS(undefined);
    setStakeData(undefined);
    if (typeof pubkey === "undefined" || !pubkey) {
      return;
    }
    getStakeAccount(connection, pubkey)
      .then(setStakeData)
      .catch((err) => {
        console.log("getting user stake data failed", err);
      });
    connection
      .getParsedTokenAccountsByOwner(
        pubkey,
        { programId: "TOKEN_PROGRAM_ID" },
        "singleGossip"
      )
      .then((res: any) => {
        const tokens = res.value.filter((tx: any) => {
          if (tx.account.data.program !== "spl-token") {
            return false;
          }
          const parsed = tx.account.data.parsed;
          if (parsed.type !== "account") {
            return false;
          }
          return (
            parsed.info.tokenAmount.decimals === 0 &&
            parsed.info.tokenAmount.uiAmount === 1
          );
        });
        const mints: string[] = tokens.map(
          (t: any) => t.account.data.parsed.info.mint
        );
        setUserNFTS(mints);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [pubkey, refIndex]);

  return {
    ready: !!userNFTS,
    userNFTS: userNFTS || [],
    stake: stakeData,
  };
}

const sizes = [
  { id: "4", name: "4" },
  { id: "5", name: "5" },
  { id: "10", name: "10" },
  { id: "custom", name: "Custom" },
];

function StakeSlotSize(props: {
  selected: string;
  startValue: number;
  onSelected: (selectedId: string, selectedNum: number) => void;
}) {
  const [custom, setCustom] = React.useState(`${props.startValue}`);

  return (
    <>
      <Listbox
        value={props.selected}
        onChange={(v) => props.onSelected(v, parseInt(v) ?? 4)}
      >
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              How many piggies will you stake at most?
            </Listbox.Label>
            <div className="mt-1 relative">
              <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <span className="block truncate">
                  {sizes.filter((f) => f.id === props.selected)[0]?.name ?? "4"}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {sizes.map((size) => (
                    <Listbox.Option
                      key={size.id}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-indigo-600" : "text-gray-900",
                          "cursor-default select-none relative py-2 pl-8 pr-4"
                        )
                      }
                      value={size.id}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {size.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 left-0 flex items-center pl-1.5"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {props.selected === "custom" && (
        <div className="mt-1">
          <input
            type="number"
            name="slotNumber"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 mt-2"
            value={custom}
            onChange={(e) => {
              setCustom(e.currentTarget.value);
              props.onSelected("custom", parseInt(e.currentTarget.value) ?? 4);
            }}
          />
        </div>
      )}
    </>
  );
}

export function StakeProgress(props: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const onClose = () => {
    props.onClose?.();
  };
  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <h1 className="mb-4 pb-2 border-b text-xl">
            Approve Transaction on your wallet
          </h1>
        </div>
        <Spinner size={96} />
      </div>
    </Modal>
  );
}

export default function Stake() {
  // const wallet = useWallet()
  // const isConnected = wallet.connected

  const [showDialog, setShowDialog] = React.useState(false);
  const [showProgressDialog, setShowProgressDialog] = React.useState(false);
  const [progress, setProgress] = React.useState(true);
  const [slotID, setSlotID] = React.useState("4");
  const [slots, setSlots] = React.useState(4);
  const [refreshIndex, setRefreshIndex] = React.useState(0);
  const [tokenList, setTokenList] = React.useState<TokenAPISimple[]>([]);
  const [stakeTokenList, setStakeTokenList] = React.useState<string[]>([]);

  // React.useEffect(() => {
  //   if (!ready) {
  //     return;
  //   }
  //   if (userNFTS.length > 4) {
  //     setSlotID("custom");
  //     setSlots(userNFTS.length + 2);
  //   }
  //   const nfts = [...userNFTS];
  //   for (const k of stake?.tokens ?? []) {
  //     nfts.push(k.mint.toBase58());
  //   }
  //   // if (nfts.length > 0) {
  //   //   setProgress(true);
  //   //   getTokenList(wallet?.publicKey?.toBase58(), nfts)
  //   //     .then((res) => {
  //   //       setTokenList(
  //   //         res.tokens?.filter((t) => t.collectionId === "j6894aRvRMJlE") ?? []
  //   //       );
  //   //       setProgress(false);
  //   //     })
  //   //     .catch((err) => {
  //   //       addNotification(
  //   //         "Unable to fetch token list",
  //   //         `${err.message}`,
  //   //         "error"
  //   //       );
  //   //       console.error(err);
  //   //       setProgress(false);
  //   //     });
  //   // } else {
  //   //   setProgress(false);
  //   //   setTokenList([]);
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ready, userNFTS, stake]);

  const startStaking = () => {
    // setShowProgressDialog(true);
    // stakePiggies(
    //   // stakeTokenList.map((t) => new PublicKey(t)),
    //   wallet,
    //   slots
    // )
    //   .then((res) => {
    //     setRefreshIndex(refreshIndex + 1);
    //     setShowProgressDialog(false);
    //     setStakeTokenList([]);
    //   })
    //   .catch((res) => {
    //     setRefreshIndex(refreshIndex + 1);
    //     setShowProgressDialog(false);
    //   });
  };

  const startUnstake = (mint: string) => {
    // setShowProgressDialog(true);
    // unstakePiggy(new PublicKey(mint), wallet)
    //   .then((res) => {
    //     setRefreshIndex(refreshIndex + 1);
    //     setShowProgressDialog(false);
    //   })
    //   .catch((res) => {
    //     setRefreshIndex(refreshIndex + 1);
    //     setShowProgressDialog(false);
    //   });
  };

  // const unstaked = tokenList
  //   .filter(
  //     (t) =>
  //       (stake?.tokens.filter((n) => n.mint.toBase58() === t.mintId).length ??
  //         0) === 0
  //   )
  //   .filter((t) => !stakeTokenList.includes(t.mintId!));

  // const willStake = tokenList.filter((t) => stakeTokenList.includes(t.mintId!));
  // const alreadyStaked = tokenList.filter(
  //   (t) =>
  //     (stake?.tokens.filter((n) => n.mint.toBase58() === t.mintId).length ??
  //       0) === 1
  // );

  const now = Date.now() / 1000;
  const unlocked = now - 604800;

  const {
    headerWalletMenuShow,
    setHeaderWalletMenuShow,
    headerMobileMenuShow,
    setHeaderBackDropShow,
    headerBackDropShow,
    setHeaderMobileMenuShow
  } = useStore()

  return (
    <Layout>
      <div className="flex flex-col overflow-x-hidden h-screen w-full bg-white text-black">
        <Helmet>
          <title>Alpha.art | Stake Piggies</title>
        </Helmet>
        <StakeProgress isOpen={showProgressDialog} />
        <div className="relative">
          <div className="relative pt-6 pb-8 sm:pb-12">
            <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Stake your</span>
                  <span className="block text-indigo-600">
                    Piggy Sol Gang NFT
                  </span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Earn Solana on alpha.art by owning and staking Piggy Sol Gang
                  NFTs. Payments will be distributed equally among staked Pigs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 sm:mt-1">
          {/* {ready && progress && (
            <div className="w-full flex items-center justify-center">
              <div className="max-w-3xl">
                <FakeSimpleTokenList count={16} />
              </div>
            </div>
          )} */}
          {/* {ready && stake && (
            <div className="flex flex-col sm:items-center sm:border-t sm:border-gray-200 sm:pt-5 mb-4">
              <p className="text-base text-center text-gray-800">
                You currently have {stake.tokens.length}{" "}
                {stake.tokens.length > 1 ? "Piggies" : "Piggy"} staked.
                <br /> Your current AlphaArt service fee is{" "}
              <b>{2 - 0.5 * Math.min(4, stake.tokens.length)}%</b>
              </p>
            </div>
          )} */}

          {/* {ready && !progress && unstaked.length > 0 && (
            <div className="flex flex-col sm:items-center sm:border-t sm:border-gray-200 sm:pt-5 mb-4">
              <h3 className="text-xl text-left mb-2">
                Unstaked Piggies ({unstaked.length})
              </h3>
              <p className="max-w-md mx-auto text-sm text-gray-400 md:max-w-3xl mb-2">
                You can stake at most 6 piggies at a time
              </p>
              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {unstaked.map((product) => (
                  <div>
                    <SimpleToken
                      key={product.mintId}
                      {...product}
                      aProps={{ target: "_blank" }}
                    />
                    <Button
                      title="Stake"
                      size="small"
                      disabled={stakeTokenList.length >= 6}
                      className="mt-1"
                      onClick={() => {
                        if (stakeTokenList.length < 6) {
                          setStakeTokenList([...stakeTokenList, product.mintId!]);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )} */}
          {/* {ready && !progress && alreadyStaked.length > 0 && (
            <div className="flex flex-col sm:items-center sm:border-t sm:border-gray-200 sm:pt-5 mt-4 mb-4">
              <h3 className="text-xl text-left mb-2">
                Staked Piggies ({alreadyStaked.length})
              </h3>
              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {alreadyStaked.map((product) => (
                  <div>
                    <SimpleToken
                      key={product.mintId}
                      {...product}
                      aProps={{ target: "_blank" }}
                    />
                    <Button
                      title="Unstake"
                      size="small"
                      disabled={
                        (stake?.tokens.find(
                          (m) => m.mint.toBase58() === product.mintId
                        )?.stakedAt ?? 0) > unlocked
                      }
                      className="py-1 px-1 mt-1"
                      onClick={() => {
                        startUnstake(product.mintId!);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )} */}
          <div className="flex flex-col sm:items-center sm:border-t sm:border-gray-200 sm:pt-5">
            {/* {!wallet && !isConnected && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setHeaderMobileMenuShow(true)
                  setHeaderBackDropShow(true)
                }}
                className={classNames(
                  "mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ",
                  "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                )}
              >
                Connect Wallet
              </button>
            )} */}
            {/* {ready && !stake && (
              <div>
                <StakeSlotSize
                  selected={slotID}
                  startValue={userNFTS.length + 2}
                  onSelected={(id, num) => {
                    setSlotID(id);
                    setSlots(num);
                  }}
                />
                <p className="mt-3 max-w-md mx-auto text-sm text-gray-500 md:max-w-3xl">
                  This value can't be changed later.
                </p>
              </div>
            )} */}
            {stakeTokenList.length > 0 && (
              <div className="flex flex-col sm:items-center sm:pt-5">
                <h3 className="text-xl text-left mb-2">
                  Piggies that will be staked
                </h3>
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 md:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {/* {willStake.map((product) => (
                    <div>
                      <SimpleToken
                        key={product.mintId}
                        aProps={{ target: "_blank" }}
                        {...product}
                      />
                      <Button
                        title="Undo"
                        size="small"
                        className="py-1 px-1 mt-1"
                        onClick={() => {
                          setStakeTokenList(
                            stakeTokenList.filter((st) => st !== product.mintId!)
                          );
                        }}
                      />
                    </div>
                  ))} */}
                </div>
              </div>
            )}
            {/* {wallet && isConnected && ready && !progress && (
              <>
                <button
                  onClick={startStaking}
                  disabled={willStake.length === 0}
                  className={classNames(
                    "mt-4 mb-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ",
                    willStake.length > 0
                      ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                      : "bg-gray-600 hover:bg-gray-600 "
                  )}
                >
                  Start Staking
                </button>
                {willStake.length > 0 && (
                  <p className="mt-1 max-w-md mx-auto text-sm text-gray-500 md:max-w-3xl">
                    Staked NFTs will be locked for 7 days.
                  </p>
                )}
              </>
            )} */}
          </div>
        </div>
        <footer aria-labelledby="footer-heading" className="bg-white">
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:flex md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-500">&copy; 2021 alpha.art</p>
              </div>

              <div className="mt-4 flex items-center justify-center md:mt-0">
                <div className="flex space-x-8">
                  {footerNavigation.bottomLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-sm text-gray-500 hover:text-gray-600"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}