import React from "react";
import { classNames } from "../..//utils/clsx";
import { useSelector } from "../../api/store";
import { Spinner } from "../../components/spiners";
import Modal from "../../components/dialog";
import { addNotification } from "../../utils/alert";
import { cancelOffer, closeOffer, fetchOffers } from "../../api/actions";
import { Dialog } from "@headlessui/react";
import { lamportsToSOL } from "../../utils/sol";
import { OfferData } from "../../api/app/instructions";

export function CancelOfferDialog(props: {
  offer: OfferData;
  nftPubKey: string;
  offerAccount?: "PublicKey";
  isOpen?: boolean;
  lamports: number;
  onClose?: () => void;
}) {
  const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  // const wallet = useWallet()
  const onClose = () => {
    if (!isInProgress) {
      props.onClose?.();
    }
  };

  // const sendCancel = () => {
  //   if (wallet?.publicKey && props.offerAccount) {
  //     setIsInProgress(true);
  //     cancelOffer(props.offerAccount, wallet)
  //       .then((res) => {
  //         setIsInProgress(false);
  //         addNotification("Offer Successfully Cancelled");
  //         fetchOffers(props.nftPubKey);
  //         props.onClose?.();
  //       })
  //       .catch((err: Error) => {
  //         addNotification("Failed to cancel offer", `${err.message}`, "error");
  //         setIsInProgress(false);
  //       });
  //   }
  // };

  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <Dialog.Title
        as="h2"
        className="text-lg leading-6 font-medium text-gray-900 mb-4"
      >
        Cancel Offer
      </Dialog.Title>
      <div className="space-y-6">
        <div>
          <h3 className="mb-8">
            This will cancel the offer and return the{" "}
            {lamportsToSOL(props.lamports)} SOL to your account
          </h3>
          {!isInProgress && (
            <button
              // onClick={sendCancel}
              className={classNames(
                "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ",
                "bg-indigo-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              )}
            >
              Cancel Offer
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
