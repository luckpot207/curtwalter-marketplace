import React from "react";
import { classNames } from "../..//utils/clsx";
import { useSelector } from "../../api/store";
import { Spinner } from "../../components/spiners";
import Modal from "../../components/dialog";
import { TokenInfo } from "../..//data/custom";
import { addNotification } from "../../utils/alert";
import { listNFT } from "../../api/actions";
import { AmountSplit } from "./amountSplit";
import { useRoyaltyCalculation } from "./modals";

export function SellDialog(props: {
  nft: TokenInfo;
  isOwner: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  refetch?: () => void;
}) {
  const { nft } = props;
  const [value, setValue] = React.useState<string | undefined>(undefined);
  const [price, setPrice] = React.useState<number>(0.0);
  const [isValid, setIsValid] = React.useState<boolean>(false);
  const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  const royalty = useRoyaltyCalculation(nft);
  // const wallet = useWallet();
  const onClose = () => {
    if (!isInProgress) {
      props.onClose?.();
    }
  };

  // const sendListing = () => {
  //   if (wallet?.publicKey && isValid) {
  //     const mintPubkey = new PublicKey(nft.token?.mintPubkey!);
  //     setIsInProgress(true);
  //     listNFT(mintPubkey, price, wallet)
  //       .then((res) => {
  //         setIsInProgress(false);
  //         addNotification("NFT successfully listed");
  //         props.refetch?.();
  //         props.onClose?.();
  //       })
  //       .catch((err) => {
  //         addNotification("Failed to list NFT", `${err}`, "error");
  //         setIsInProgress(false);
  //       });
  //   }
  // };

  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <div className="space-y-6 h-72">
        <div>
          <label
            htmlFor="price"
            className="block text-xl font-medium"
          >
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="sm:text-base">◎</span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              className="form-input h-12 dark:bg-zinc-800 focus:ring-gray-500 focus:border-gray-500 block w-full pl-7 pr-12 sm:text-xl border-gray-300 rounded-md"
              placeholder="0.00"
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
              <span className="sm:text-sm" id="price-currency">
                SOL
              </span>
            </div>
          </div>
        </div>
        <AmountSplit
          price={isValid ? price : 0}
          royalty={royalty}
          symbol={nft.token?.metadata?.symbol}
          authority={nft.collection?.authorityPubkey}
          tokenPublicKey={nft.token?.mintPubkey!}
          showDiscountNotice
        />
        <div>
          {!isInProgress && (
            <button
              disabled={!isValid}
              // onClick={sendListing}
              className={classNames(
                "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white",
                isValid
                  ? "bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  : "bg-gray-300 dark:text-gray-700"
              )}
            >
              Send Listing
            </button>
          )}
          <div className="flex items-center justify-center">
            {isInProgress && <Spinner size={64} />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
