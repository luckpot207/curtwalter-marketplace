import React from "react";
// import { EscrowAndPubKey, OfferAndPubKey } from "../api/app/instructions";
// import { getUserProgramAccounts } from "../api/app/utils";
// import { useSelector } from "../api/store";

export function useAccounts(pubkey?: string): {
  ready: boolean;
  userNFTS: string[];
  escrowAccounts: any[];
  offerAccounts: any[];
} {
  // const connection = useSelector((data: { connection: any; }) => data.connection);
  const [escrowAccounts, setEscrowAccounts] = React.useState<any[]>();
  const [offerAccounts, setOfferAccounts] = React.useState<any[]>();
  const [userNFTS, setUserNFTS] = React.useState<string[]>();

  React.useEffect(() => {
    setEscrowAccounts(undefined);
    setOfferAccounts(undefined);
    setUserNFTS(undefined);

    if (!pubkey) {
      return
    }

    // getUserProgramAccounts(connection, pk).then((res) => {
    //   setEscrowAccounts(res.escrows);
    //   setOfferAccounts(res.offers);
    // });

    //   connection
    //     .getParsedTokenAccountsByOwner(
    //       pk,
    //       { programId: TOKEN_PROGRAM_ID },
    //       "singleGossip"
    //     )
    //     .then((res: { value: any[]; }) => {
    //       const tokens = res.value.filter((tx: { account: { data: { program: string; parsed: any; }; }; }) => {
    //         if (tx.account.data.program !== "spl-token") {
    //           return false;
    //         }
    //         const parsed = tx.account.data.parsed;
    //         if (parsed.type !== "account") {
    //           return false;
    //         }
    //         return (
    //           parsed.info.tokenAmount.decimals === 0 &&
    //           parsed.info.tokenAmount.uiAmount === 1
    //         );
    //       });
    //       const mints: string[] = tokens.map(
    //         (t: { account: { data: { parsed: { info: { mint: any; }; }; }; }; }) => t.account.data.parsed.info.mint
    //       );
    //       setUserNFTS(mints);
    //     })
    //     .catch((err: any) => {
    //       console.error(err);
    //     });
  }, [pubkey]);

  return {
    ready: !!userNFTS && !!escrowAccounts && !!offerAccounts,
    userNFTS: userNFTS || [],
    escrowAccounts: escrowAccounts || [],
    offerAccounts: offerAccounts || [],
  };
}
