import React from "react";
import { useSelector } from "../../api/store";
import { Spinner } from "../../components/spiners";
import Modal from "../../components/dialog";
import { addNotification } from "../../utils/alert";
import { acceptOffer, fetchOffers, unlistNFT } from "../../api/actions";
import { classNames } from "../../utils/clsx";
import { AmountSplit } from "./amountSplit";
import { TokenInfo } from "../../data/custom";
import { OfferAndPubKey, OfferData } from "../../api/app/instructions";
import { useRoyaltyCalculation } from "./modals";
import { TokenOfferTable } from "./OfferNFT";
import { Collection, TokenAPISimple } from "../../data/marketplace.pb";

export function AcceptOfferDialog(props: {
  nftPubKey: string;
  nft?: TokenInfo;
  offer?: OfferAndPubKey;
  escrowAccount?: "PublicKey";
  isOpen?: boolean;
  onClose?: () => void;
  refetch?: () => void;
}) {
  const wallet = useSelector((data) => data.wallet);
  const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  const [unlistState, setUnlistState] = React.useState<boolean>(
    !!props.escrowAccount
  );
  const royalty = useRoyaltyCalculation(props.nft!);
  // const sendAccept = () => {
  //   if (wallet?.publicKey && props.offer) {
  //     acceptOffer(props.offer.pubkey, new PublicKey(props.nftPubKey), wallet)
  //       .then((res) => {
  //         addNotification("Offer Successfully Accepted");
  //         fetchOffers(props.nftPubKey);
  //         props.refetch?.();
  //         props.onClose?.();
  //       })
  //       .catch((err: Error) => {
  //         addNotification("Failed to accept offer", `${err.message}`, "error");
  //         props.onClose?.();
  //       });
  //   }
  // };
  const onClose = () => {
    if (!isInProgress) {
      props.onClose?.();
    }
  };

  React.useEffect(() => {
    if (!props.escrowAccount) {
      // sendAccept();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const sendCancel = () => {
  //   if (wallet?.publicKey && props.escrowAccount) {
  //     const mintPubkey = new PublicKey(props.nftPubKey);
  //     setIsInProgress(true);
  //     unlistNFT(mintPubkey, props.escrowAccount, wallet)
  //       .then((res) => {
  //         setIsInProgress(false);
  //         addNotification("NFT successfully unlisted");
  //         setUnlistState(false);
  //         setTimeout(() => {
  //           sendAccept();
  //         }, 1000);
  //       })
  //       .catch((err: Error) => {
  //         addNotification("Failed to unlist NFT", `${err.message}`, "error");
  //         setIsInProgress(false);
  //       });
  //   }
  // };
  const LAMPORTS_PER_SOL = 10;

  if (props.escrowAccount && unlistState) {
    return (
      <Modal visible={props.isOpen} onClose={onClose}>
        <div className="space-y-6">
          <div>
            <h2 className="mb-8 text-lg">
              In order to accept the offer, you need to unlist this NFT from
              marketplace first.
            </h2>
            <AmountSplit
              price={Number(props.offer?.offer.price) / LAMPORTS_PER_SOL}
              royalty={royalty}
              symbol={props.nft?.token?.metadata?.symbol}
              authority={props.nft?.collection?.authorityPubkey}
              tokenPublicKey={props.nft?.token?.mintPubkey!}
            />
            {!isInProgress && (
              <button
                // onClick={sendCancel}
                className={classNames(
                  "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mb-4",
                  "bg-indigo-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
  return (
    <Modal visible={props.isOpen}>
      <div className="space-y-6">
        <div>
          <h2 className="mb-8 text-center font-bold">
            Allow the transaction on your wallet.
          </h2>
          <AmountSplit
            price={Number(props.offer?.offer.price) / LAMPORTS_PER_SOL}
            royalty={royalty}
            symbol={props.nft?.token?.metadata?.symbol}
            authority={props.nft?.collection?.authorityPubkey}
            tokenPublicKey={props.nft?.token?.mintPubkey!}
          />
          <div className="flex items-center justify-center">
            <Spinner size={64} />
          </div>
          <p className="mt-8 text-sm text-center font-light">
            Check your wallet if it has enough sol for transaction fee.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export interface NFTOfferData {
  expiresAt(expiresAt: any, arg1: string): string;
  isExpired: any;
  offer: OfferData;
  pubkey: "PublicKey";
  tokens: TokenAPISimple[];
  collections: Collection[];
}
export function NFTOfferAcceptDialog(props: {
  nftPubKey: string;
  nft?: TokenInfo;
  data: NFTOfferData;
  escrowAccount?: "PublicKey";
  isOpen?: boolean;
  onClose?: () => void;
  refetch?: () => void;
}) {
  // const wallet = useWallet()
  const [isInProgress, setIsInProgress] = React.useState<boolean>(false);
  const [unlistState, setUnlistState] = React.useState<boolean>(
    !!props.escrowAccount
  );
  // const sendAccept = () => {
  //   if (wallet?.publicKey) {
  //     setIsInProgress(true);
  //     acceptOffer(props.data.pubkey, new PublicKey(props.nftPubKey), wallet)
  //       .then((res) => {
  //         addNotification("Offer Successfully Accepted");
  //         fetchOffers(props.nftPubKey);
  //         props.refetch?.();
  //         props.onClose?.();
  //       })
  //       .catch((err: Error) => {
  //         addNotification("Failed to accept offer", `${err.message}`, "error");
  //         setIsInProgress(false);
  //       });
  //   }
  // };
  const onClose = () => {
    if (!isInProgress) {
      props.onClose?.();
    }
  };

  // const sendCancel = () => {
  //   if (wallet?.publicKey && props.escrowAccount) {
  //     const mintPubkey = new PublicKey(props.nftPubKey);
  //     setIsInProgress(true);
  //     unlistNFT(mintPubkey, props.escrowAccount, wallet)
  //       .then((res) => {
  //         addNotification("NFT successfully unlisted");
  //         setUnlistState(false);
  //         setTimeout(() => {
  //           sendAccept();
  //         }, 1000);
  //       })
  //       .catch((err: Error) => {
  //         addNotification("Failed to unlist NFT", `${err.message}`, "error");
  //         setIsInProgress(false);
  //       });
  //   }
  // };

  // if (props.escrowAccount && unlistState) {
  //   return (
  //     <Modal visible={props.isOpen} onClose={onClose}>
  //       <div className="space-y-6">
  //         <div>
  //           <h2 className="mb-8 text-lg">
  //             In order to accept the offer, you need to unlist this NFT from
  //             marketplace first.
  //           </h2>
  //           {!isInProgress && (
  //             <button
  //               onClick={sendCancel}
  //               className={classNames(
  //                 "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mb-4",
  //                 "bg-indigo-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  //               )}
  //             >
  //               Unlist Now
  //             </button>
  //           )}
  //           <div className="flex items-center justify-center">
  //             {isInProgress && <Spinner size={64} />}
  //           </div>
  //         </div>
  //       </div>
  //     </Modal>
  //   );
  // }
  return (
    <Modal visible={props.isOpen} onClose={onClose}>
      <div className="space-y-6">
        <h2 className="text-lg">NFT Offer (Escrow) </h2>
        <TokenOfferTable
          collections={props.data.collections}
          tokenList={props.data.tokens}
          readonly
        />
        <div>
          {(!props.escrowAccount || !unlistState) && (
            <p className="mb-4 text-sm text-center font-light">
              NFT Escrow service has 0.1 SOL service fee.
            </p>
          )}
          {props.escrowAccount && unlistState && (
            <>
              <p className="mb-4 text-sm text-center font-light">
                In order to accept the offer, you need to unlist this NFT from
                marketplace first.
              </p>
              {!isInProgress && (
                <button
                  // onClick={sendCancel}
                  className={classNames(
                    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mb-4",
                    "bg-indigo-600  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  )}
                >
                  Unlist Now
                </button>
              )}
              <p className="mb-4 text-sm text-center font-light">
                NFT Escrow service has 0.1 SOL service fee.
              </p>
            </>
          )}
          {!isInProgress && !unlistState && (
            <button
              // onClick={sendAccept}
              className={classNames(
                "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white nightwind-prevent",
                "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              )}
            >
              Accept Offer
            </button>
          )}
          <div className="flex items-center justify-center">
            {isInProgress && <Spinner size={64} />}
          </div>
          <p className="mt-8 text-sm text-center font-light">
            Check your wallet if it has enough sol for transaction fee.
          </p>
        </div>
      </div>
    </Modal>
  );
}
