import React from "react";
import { classNames } from "../..//utils/clsx";
import { useSelector } from "../../api/store";
import { Spinner } from "../../components/spiners";
import Modal from "../../components/dialog";
import { TokenInfo } from "../..//data/custom";
import { addNotification } from "../../utils/alert";
import { unlistNFT } from "../../api/actions";

export function CancelDialog(props: {
  nft: TokenInfo;
  escrowAccount?: "PublicKey";
  isOpen?: boolean;
  onClose?: () => void;
  refetch?: () => void;
}) {
  const { nft } = props;
  const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  // const wallet = useWallet()
  const onClose = () => {
    if (!isInProgress) {
      props.onClose?.();
    }
  };

  // const sendCancel = () => {
  //   if (wallet?.publicKey && props.escrowAccount) {
  //     const mintPubkey = new PublicKey(nft.token?.mintPubkey!);
  //     setIsInProgress(true);
  //     unlistNFT(mintPubkey, props.escrowAccount, wallet)
  //       .then((res) => {
  //         setIsInProgress(false);
  //         addNotification("NFT successfully unlisted");
  //         props.refetch?.();
  //         props.onClose?.();
  //       })
  //       .catch((err: Error) => {
  //         addNotification("Failed to unlist NFT", `${err.message}`, "error");
  //         setIsInProgress(false);
  //       });
  //   }
  // };

  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <div className="space-y-6 nightwind-prevent-block">
        <div>
          <h2 className="mb-8">This will remove listing from marketplace</h2>
          {!isInProgress && (
            <button
              // onClick={sendCancel}
              className={classNames(
                "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white dark:text-gray-300 dark:hover:text-white",
                "bg-gray-600  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              )}
            >
              Unlist Now
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
