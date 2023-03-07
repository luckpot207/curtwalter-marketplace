// import {UserPublic} from "@piggydao/marketplace-models";
import { marketplaceServerUrl } from "../lib/utils";

export async function fetchUserPublic(pubkey: string): Promise<any> {
  return (await fetch(`${marketplaceServerUrl()}/users/${pubkey}`)).json();
}