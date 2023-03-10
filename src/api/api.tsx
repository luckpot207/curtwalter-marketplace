import { PublicKey } from "@solana/web3.js";

export interface Entity {
    id: string;
    title: string;
    image: string;
  }

  export async function controlPrice(escrow: PublicKey) {
    // // const res = await fetch(`${API_ADDRESS}/api/v1/token/controlPrice`, {
    // //   method: "POST",
    // //   headers: {
    // //     "Content-Type": "application/json",
    // //   },
    // //   body: JSON.stringify({
    // //     pubkey: escrow.toBase58(),
    // //   }),
    // // });
    // const data: marketplacepb.Listing = await res.json();
    // return data;
    return;
  }