import React from "react";
import { classNames } from "../../utils/clsx";
import { store, useSelector } from "../../api/store";
import { getTokenAndEscrow } from "../../api/api";
import { Spinner } from "../spiners";
import Modal from "../dialog";
import { TokenInfo } from "../../data/custom";
import { addNotification } from "../../utils/alert";
import { fetchOffers, sendOffer } from "../../api/actions";
import { useRoyaltyCalculation } from "./modals";
import { OfferNFT } from "./OfferNFT";
import OfferExpireDatePicker from "./OfferExpireDatePicker";
import { AmountSplit } from "./amountSplit";
import { Tab } from "@headlessui/react";
import { fetchSolWalletBalance } from "../../services/wallets";
import { useStore } from "../../lib/store";

function OfferSOL(props: {
  nft: TokenInfo;
  isInProgress: boolean;
  setIsInProgress: (value: boolean) => void;
  onClose: () => void;
}) {
  const { nft } = props;
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const [price, setPrice] = React.useState<number>(0.0);
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const royalty = useRoyaltyCalculation(nft);
  const [endDate, setEndDate] = React.useState(new Date());
  // const wallet = useWallet()
  const connection = useSelector((data) => data.connection);
  const {
    setWalletBalance
  } = useStore()

  // const onSendOffer = () => {
  //   if (wallet?.publicKey && isValid) {
  //     const mintPubkey = new PublicKey(nft.token?.mintPubkey!);
  //     props.setIsInProgress(true);
  //     sendOffer(mintPubkey, endDate, price, wallet)
  //       .then((res) => {
  //         props.setIsInProgress(false);
  //         addNotification("Offer transaction succesfully completed");
  //         getTokenAndEscrow(mintPubkey.toBase58())
  //           .then((res) => {
  //             props.onClose();
  //           })
  //           .catch((err) => {
  //             console.error(err);
  //             props.onClose();
  //           });
  //         fetchOffers(mintPubkey.toString());
  //         if (wallet.publicKey) {
  //           fetchSolWalletBalance(wallet?.publicKey.toBase58())
  //             .then((data) => {
  //               setWalletBalance(data)
  //               store.dispatch?.({ type: "SetBalance", balance: parseInt(data.balance) });
  //             })
  //         }
  //       })
  //       .catch((err: Error) => {
  //         addNotification("Failed to create offer", `${err.message}`, "error");
  //         props.setIsInProgress(false);
  //       });
  //   }
  // };

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium"
        >
          Offer Price
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
            <span className="sm:text-base">
              ◎
            </span>
          </div>
          <input
            type="number"
            name="price"
            id="price"
            className="form-input dark:bg-zinc-700 h-12 block w-full pl-9 pr-12 sm:text-2xl rounded-md"
            placeholder="0.00"
            autoComplete="off"
            aria-describedby="price-currency"
            value={value}
            onChange={(e) => {
              setValue(e.currentTarget.value);
              const v = parseFloat(e.currentTarget.value);
              const valid = !isNaN(v) && isFinite(v);
              setIsValid(valid);
              if (valid) {
                setPrice(v);
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              SOL
            </span>
          </div>
        </div>
      </div>

      <div className="mt-0">
        <label className="block text-sm font-medium mb-1">
          Offer Expiration
        </label>
        <OfferExpireDatePicker
          endDate={endDate}
          onChange={(date: Date) => setEndDate(date)}
        />
      </div>

      <AmountSplit
        price={isValid ? price : 0}
        royalty={royalty}
        symbol={nft.token?.metadata?.symbol}
        authority={nft.collection?.authorityPubkey}
        tokenPublicKey={nft.token?.mintPubkey!}
        offer
      />
      <div>
        {!props.isInProgress && (
          <button
            disabled={!isValid}
            // onClick={onSendOffer}
            className={classNames(
              "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white nightwind-prevent",
              isValid
                ? "bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                : "bg-gray-300 dark:text-gray-700"
            )}
          >
            Send Offer
          </button>
        )}
        <div className="flex items-center justify-center">
          {props.isInProgress && <Spinner size={64} />}
        </div>
      </div>
    </div>
  );
}

export function OfferDialog(props: {
  defaultPage: "sol" | "nft";
  nft: TokenInfo;
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  const [tabIndex, setTabIndex] = React.useState(
    props.defaultPage === "nft" ? 1 : 0
  );
  const onClose = () => {
    if (!isInProgress) {
      props.onClose?.();
    }
  };

  return (
    <Modal
      visible={props.isOpen}
      onClose={onClose}
      size={tabIndex === 1 ? "large" : "normal"}
    >
      <div className="w-full mb-8">
        <Tab.Group
          as="div"
          defaultIndex={tabIndex}
          onChange={(e: any) => {
            setTabIndex(e);
          }}
        >
          <div className="border-b border-gray-200 mb-3">
            <Tab.List className="-mb-px flex space-x-8">
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-gray-600"
                      : "border-transparent hover:border-gray-300",
                    "whitespace-nowrap py-2 border-b-2 font-medium text-sm"
                  )
                }
              >
                Offer SOL
              </Tab>
              {/*
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                    "whitespace-nowrap py-2 border-b-2 font-medium text-sm"
                  )
                }
              >
                Offer NFT (Escrow)
              </Tab>
              */}
            </Tab.List>
          </div>
          <Tab.Panels as={React.Fragment}>
            <Tab.Panel>
              <OfferSOL
                nft={props.nft}
                isInProgress={isInProgress}
                setIsInProgress={setIsInProgress}
                onClose={onClose}
              />
            </Tab.Panel>

            {/*
            <Tab.Panel>
              <OfferNFT
                nft={props.nft}
                isInProgress={isInProgress}
                setIsInProgress={setIsInProgress}
                onClose={onClose}
              />
            </Tab.Panel>
            */}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Modal>
  );
}
