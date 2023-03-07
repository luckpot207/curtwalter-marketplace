import React from "react";
import { classNames } from "../../utils/clsx";
import { lamportsToSOL } from "../../utils/sol";
import { store, useSelector } from "../../api/store";
import { Spinner } from "../spiners";
import Modal from "../../components/dialog";
import { TokenInfo } from "../../data/custom";
import { addNotification } from "../../utils/alert";
import { purchaseNFT } from "../../api/actions";
import { EscrowData } from "../../api/app/instructions";
import { getMintEscrowAccount } from "../../api/app/utils";
import { fetchSolWalletBalance } from "../../services/wallets";
import { useStore } from "../../lib/store";

export function BuyDialog(props: {
  nft: TokenInfo;
  escrow: EscrowData;
  escrowAccount: "PublicKey";
  priceDate?: Date;
  isOpen?: boolean;
  onClose?: () => void;
  refetch?: () => void;
}) {
  const { nft, escrowAccount } = props;
  const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  const [pricingProgress, setPricingProgress] = React.useState<boolean>(false);

  // const wallet = useWallet()

  const { connection } = useSelector((data) => ({
    connection: data.connection
  }));

  const [escrowStart] = React.useState(props.escrow);
  const [escrowRecent, setEscrowRecent] = React.useState(props.escrow);
  const onClose = () => {
    if (!isInProgress) {
      props.onClose?.();
    }
  };

  const {
    setWalletBalance
  } = useStore()

  // const buyNow = () => {
  //   if (isInProgress) {
  //     return;
  //   }
  //   if (wallet?.publicKey) {
  //     const mintPubkey = new PublicKey(nft.token?.mintPubkey!);
  //     setIsInProgress(true);

  //     purchaseNFT(mintPubkey, escrowStart, escrowAccount, wallet)
  //       .then((res) => {
  //         if (wallet.publicKey) {
  //           fetchSolWalletBalance(wallet?.publicKey.toBase58())
  //             .then((data) => {
  //               setWalletBalance(data)
  //               store.dispatch?.({ type: "SetBalance", balance: parseInt(data.balance) });
  //             })
  //         }
  //         addNotification("NFT successfully purchased");
  //         props.refetch?.();
  //         props.onClose?.();
  //       })
  //       .catch((err: Error) => {
  //         addNotification("Failed to buy NFT", `${err.message}`, "error");
  //         props.onClose?.();
  //       });
  //   }
  // };

  React.useEffect(() => {
    if (props.priceDate) {
      const now = new Date();
      const tt = now.getTime();
      const expAt = props.priceDate.getTime() + 60000;
      if (expAt < tt) {
        setPricingProgress(true);
        getMintEscrowAccount(
          connection,
          // new PublicKey(nft.token?.mintPubkey!),
          "",
          "singleGossip"
        ).then((res) => {
          setEscrowRecent(res.escrow);
          setPricingProgress(false);
        });
      }
    }
  }, []);

  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <div className="space-y-6">
        <div>
          {isInProgress ? (
            <h2 className="mb-8">Allow transaction in your wallet</h2>
          ) : (
            <>
              <h2 className="mb-4">
                You are going to purchase{" "}
                <strong>{props.nft.token?.metadata?.name}</strong>
              </h2>
              <p className="text-base">Current price:</p>
              <h3 className="mt-2 mb-8 text-2xl">
                <strong>
                  ◎{lamportsToSOL(Number(escrowRecent.price))} SOL{" "}
                  {pricingProgress && <Spinner />}
                </strong>
              </h3>
            </>
          )}
          {!isInProgress && (
            <button
              // onClick={buyNow}
              className={classNames(
                "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ",
                "bg-gray-600  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              )}
            >
              Buy Now
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
