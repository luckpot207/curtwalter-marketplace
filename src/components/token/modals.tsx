import React, { useEffect } from "react";
import { store } from "../../api/store";
import { TokenInfo } from "../..//data/custom";
import { getMetadata } from "../../api/app/client";
import { addNotification } from "../../utils/alert";

export function useRoyaltyCalculation(nft: TokenInfo) {
  let fee = nft.token?.metadata?.seller_fee_basis_points;
  fee = typeof fee === "string" ? Number(fee) : fee;
  const [royalty, setRoyalty] = React.useState((fee ?? 0) / 10000);

  React.useEffect(() => {
    getMetadata(
      store.getState().connection,
      // new PublicKey(nft.token!.mintPubkey!)
      ""
    )
      .then((res) => {
        setRoyalty(res.data.sellerFeeBasisPoints / 10_000);
      })
      .catch((err) => {
        addNotification("Token metadata fetch failed", `${err}`, "error");
      });
  }, []);
  return royalty;
}

export function ConnectWalletDialog({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  // const wallet = useWalletModal();
  // useEffect(() => {
  //   wallet.setVisible(!!isOpen);
  // }, [isOpen]);

  // useEffect(() => {
  //   if (!wallet.visible) {
  //     onClose?.();
  //   }
  // }, [wallet.visible]);
  return null;
}
