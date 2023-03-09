import { PublicKey } from "@solana/web3.js";

type NetworkType = "mainner" | "testnet" | "localhost";
const NETWORK: NetworkType = "localhost";

const meta = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const metaLocal = new PublicKey("Be6ak57YfM2SVqa6Ra6f928RQp8ZzaCqcMB32kjxRZyk");

export const PROGRAM_ID = new PublicKey(
  "HZaWndaNWHFDd9Dhk5pqUUtsmoBCqzb1MLu3NAh1VX6B"
);
export const STAKE_PROGRAM_ID = new PublicKey(
  "PigQb15gjToiDCr9HeEhTTXSc5yY22pJ9TF4nUrRw2z"
);
export const STAKE_NFT_HOLDER = new PublicKey(
  "2GBc4Qko5iCMoDUnS2Fquh9AmxtjDEewrrXzmWBUA8M9"
);
export const MARKET_FEE_COLLECTOR = new PublicKey(
  "4Ueko5sCk5WhPmY9VGeKJSYwdKW7nru3zWcbmoMxtbV2"
);

function localOr<T>(local: T, network: T): T {
  if (NETWORK === "localhost") {
    return local;
  }
  return network;
}

// Configure the local cluster.
export const METADATA_PROGRAM_ID = meta; // new PublicKey(localOr(metaLocal, meta));

export function networkUri() {
  return process.env.REACT_APP_SOLANA_HTTP_NODE
  //return "https://alpha-art.genesysgo.net";
  // const env = process.env.REACT_APP_SOLANA_NETWORK as Cluster;
  // if (env) {
  //   const clusters: Cluster[] = ["devnet", "mainnet-beta", "testnet"];
  //   if (clusters.indexOf(env) > -1) {
  //     return clusterApiUrl(env);
  //   }
  //   return env;
  // }
  // return clusterApiUrl("mainnet-beta");
}

export const API_ADDRESS =
  process.env.REACT_APP_API_URL ?? "https://apis.alpha.art";

export const TRADING_TYPES_TO_ID = {
  'TRANSFER'        : 0,
  'SALE'            : 1,
  'LISTING'         : 2,
  'OFFER'           : 3,
  'UNLIST'          : 4,
  'MINT'            : 5,
  'NFT_OFFER_ACCEPT': 6,
}