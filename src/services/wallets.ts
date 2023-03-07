// import {WalletBalance} from "@piggydao/marketplace-models";
import { marketplaceServerUrl } from "../lib/utils";

export async function fetchSolWalletBalance(pubkey: string): Promise<number> {
  return (await fetch(`${marketplaceServerUrl()}/sol/wallets/${pubkey}/balance?commitment=confirmed`)).json();
}