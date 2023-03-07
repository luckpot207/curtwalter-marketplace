// import {LAMPORTS_PER_SOL} from "@solana/web3.js";
const LAMPORTS_PER_SOL = 10;
// import {Token} from "@piggydao/marketplace-models";

export function shortPublicKey(publicKey: string) {
  return publicKey.substring(0, 6) + "..." + publicKey.substring(publicKey.length - 4)
}

export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export function lamportsToSOL(price: string | number | undefined) {
  if (typeof price === "undefined") {
    return 0;
  } else if (typeof price === "string") {
    price = parseInt(price, 10);
    const sol = price / LAMPORTS_PER_SOL;
    return Math.round(sol * 100) / 100;
  } else {
    if (isNaN(price)) {
      return 0;
    }
    return Math.round((price / LAMPORTS_PER_SOL) * 100) / 100;
  }
}

export function nFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });

  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : (num).toFixed(digits);
}

export function solanaHttpRpcUrl() {
  return process.env.REACT_APP_SOLANA_HTTP_NODE
}

export function marketplaceServerUrl() {
  return "https://apis.alpha.art/api/v3"
}

export function tokenImage(token?: any): string | undefined {
  return token?.optimized_image ? token?.optimized_image : token?.image
}

export function fetcher<Type>(url: string): Promise<Type> {
  return fetch(url).then((res) => res.json());
}