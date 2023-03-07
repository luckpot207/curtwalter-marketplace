import React from "react";
import { classNames } from "../..//utils/clsx";
import { lamportsToSOL } from "../../utils/sol";
import { useSelector } from "../../api/store";
import { Spinner } from "../../components/spiners";
import Modal from "../../components/dialog";
import { TokenInfo } from "../..//data/custom";
import { addNotification } from "../../utils/alert";
import { updatePriceOfNFT } from "../../api/actions";
import { AmountSplit } from "./amountSplit";
import { useRoyaltyCalculation } from "./modals";
import { EscrowAndPubKey } from "../../api/app/instructions";

export function UpdateListingDialog(props: {
  nft: TokenInfo;
  escrow: EscrowAndPubKey;
  isOpen: boolean;
  onClose?: () => void;
  refetch?: () => void;
}) {
  const { nft, escrow } = props;
  const [value, setValue] = React.useState<string | undefined>(
    lamportsToSOL(nft.listing?.price).toString()
  );
  const [price, setPrice] = React.useState<number>(
    lamportsToSOL(nft.listing?.price)
  );
  const [isValid, setIsValid] = React.useState<boolean>(true);
  const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  const royalty = useRoyaltyCalculation(nft);
  const wallet = useSelector((data) => data.wallet);
  const onClose = () => {
    if (!isInProgress) {
      props.onClose?.();
    }
  };
  // const sendUpdateListing = () => {
  //   if (wallet?.publicKey && isValid) {
  //     const mintPubkey = new PublicKey(nft.token?.mintPubkey!);
  //     setIsInProgress(true);
  //     updatePriceOfNFT(mintPubkey, escrow.pubkey, price)
  //       .then((res) => {
  //         setIsInProgress(false);
  //         addNotification("NFT price successfully updated");
  //         props.refetch?.();
  //         props.onClose?.();
  //       })
  //       .catch((err) => {
  //         addNotification("Failed to update price", `${err}`, "error");
  //         setIsInProgress(false);
  //       });
  //   }
  // };

  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-base dark:text-white">
                ◎
              </span>
            </div>
            <input
              type="number"
              name="price"
              id="price"
              className="form-input focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-base border-gray-300 rounded-md dark:bg-black dark:text-white"
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
              <span className="text-gray-500 sm:text-sm" id="price-currency">
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
        />
        <div>
          {!isInProgress && (
            <>
              <button
                disabled={!isValid}
                // onClick={sendUpdateListing}
                className={classNames(
                  "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white nightwind-prevent",
                  isValid
                    ? "bg-indigo-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    : "bg-indigo-300 "
                )}
              >
                Update Price
              </button>
              <p className="mt-4 text-sm text-center font-light">
                You cannot update price in 5 minutes after listing.
              </p>
            </>
          )}
          <div className="flex items-center justify-center">
            {isInProgress && <Spinner size={64} />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
