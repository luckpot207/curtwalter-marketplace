// import {Collection, FetchResponse} from "@piggydao/marketplace-models";
import { marketplaceServerUrl } from "../lib/utils";

export async function search(search: string): Promise<any> {
    const sp = new URLSearchParams();
    sp.set('q', search)
    return (await fetch(`${marketplaceServerUrl()}/search?${sp.toString()}`)).json();
}