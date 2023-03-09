import { useContext } from "react";
import { MarketplaceContext } from "../context/MarketplaceProvider";

const useMarketplaceContract = () => {
  return useContext(MarketplaceContext);
}

export default useMarketplaceContract;