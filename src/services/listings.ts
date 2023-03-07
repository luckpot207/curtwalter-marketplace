// import {Listing} from "@piggydao/marketplace-models";

export async function fetchLastAddedListing(): Promise<any> {
  return (await fetch(`/api/listings/last`)).json();
}