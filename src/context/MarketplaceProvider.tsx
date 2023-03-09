import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { BigNumber, Contract, ethers } from "ethers";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSigner,
  useProvider,
  useContract,
} from "wagmi";
import { Marketplace, NFT } from "../typechain-types";
import {
  NftContractCreatedEvent,
  AuctionContractCreatedEvent,
} from "../typechain-types/contracts/Marketplace";
import {
  MARKETPLACE_ABI,
  NFTIMPLEMENT_ABI,
  AUCTIONIMPLEMENT_ABI,
} from "../utils/abi";
import { dev } from "../utils/log";
import { MARKETPLACE_ADDR } from "../utils/config";

interface MarketplaceContextProps {
  marketplaceContract: Marketplace | null;
  marketplaceContractConn: Marketplace | null;
  allNftCollections: Marketplace.NftCollectionStructOutput[];
  allNftCollectionsWhereSignerOwnsTokens: Marketplace.NftCollectionStructOutput[];
  allNftCollectionsAuthored: Marketplace.NftCollectionStructOutput[];
  allNftCollectionsWhereTokenOnSale: Marketplace.NftCollectionStructOutput[];
  refreshLoadedData: () => Promise<void>;
  createNewNftCollection: (
    name: string,
    symbol: string,
    description: string
  ) => Promise<NFT | null | undefined>;
  createNewAuction: (
    contract: string,
    tokenId: string,
    startingBid: string
  ) => Promise<NFT | null | undefined>;
  progressCreateNftCollection: boolean;
  progressCreateAuction: boolean;
}

export const MarketplaceContext = createContext<MarketplaceContextProps>({
  marketplaceContract: null,
  marketplaceContractConn: null,
  allNftCollections: [],
  allNftCollectionsWhereSignerOwnsTokens: [],
  allNftCollectionsAuthored: [],
  allNftCollectionsWhereTokenOnSale: [],
  refreshLoadedData: async () => {},
  createNewNftCollection: async () => null,
  createNewAuction: async () => null,
  progressCreateNftCollection: false,
  progressCreateAuction: false,
});

export const MarketplaceProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [marketplaceContract, setMarketplaceContract] =
    useState<Marketplace | null>(null);
  const [marketplaceContractConn, setMarketplaceContractConn] =
    useState<Marketplace | null>(null);
  const [allNftCollections, setAllNftCollections] = useState<
    Marketplace.NftCollectionStructOutput[]
  >([]);
  const [
    allNftCollectionsWhereSignerOwnsTokens,
    setAllNftCollectionsWhereSignerOwnsTokens,
  ] = useState<Marketplace.NftCollectionStructOutput[]>([]);
  const [allNftCollectionsAuthored, setAllNftCollectionsAuthored] = useState<
    Marketplace.NftCollectionStructOutput[]
  >([]);
  const [
    allNftCollectionsWhereTokenOnSale,
    setAllNftCollectionsWhereTokenOnSale,
  ] = useState<Marketplace.NftCollectionStructOutput[]>([]);
  const [progressCreateNftCollection, setProgressCreateNftCollection] =
    useState<boolean>(false);
  const [progressCreateAuction, setProgressCreateAuction] =
    useState<boolean>(false);
  // const toast = {useToast()};

  // Keep contracts updated
  useEffect(() => {
    if (!!provider) {
      const newMarketplaceContract: Marketplace = new Contract(
        MARKETPLACE_ADDR,
        MARKETPLACE_ABI,
        provider
      ) as Marketplace;
      setMarketplaceContract(newMarketplaceContract);
    }
    if (!!signer) {
      const newMarketplaceContractConn: Marketplace = new Contract(
        MARKETPLACE_ADDR,
        MARKETPLACE_ABI,
        signer
      ) as Marketplace;
      setMarketplaceContractConn(newMarketplaceContractConn);
    } else {
      setMarketplaceContractConn(null);
    }
  }, [signer, provider]);

  // Keep lists of NFT collections updated
  useEffect(() => {
    refreshLoadedData();
  }, [marketplaceContract, marketplaceContractConn, isConnected]);

  // Function to refresh loaded data
  const refreshLoadedData = useCallback(async () => {
    if (!!marketplaceContract) {
      const newAllNftCollections =
        await marketplaceContract.getAllNftCollections();
      setAllNftCollections(newAllNftCollections);
    }

    if (!!marketplaceContractConn) {
      const newAllNftCollectionsWhereSignerOwnsTokens =
        await marketplaceContractConn.getNftsCollectionsWhereOwnerOwnsTokens();
      setAllNftCollectionsWhereSignerOwnsTokens(
        newAllNftCollectionsWhereSignerOwnsTokens
      );

      const newAllNftCollectionsAuthored =
        await marketplaceContractConn.getNftsCollectionsAuthored();
      setAllNftCollectionsAuthored(newAllNftCollectionsAuthored);

      const newAllNftCollectionsWhereTokenOnSale =
        await marketplaceContractConn.getNftCollectionsWhereTokensOnSale();
      setAllNftCollectionsWhereTokenOnSale(
        newAllNftCollectionsWhereTokenOnSale
      );
    }
  }, [marketplaceContract, marketplaceContractConn, isConnected]);

  // Function to create new NFT collection
  const createNewNftCollection = useCallback(
    async (name: string, symbol: string, description: string) => {
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateNftCollection(true);
          const txn = await marketplaceContractConn.createNftContract(
            name,
            symbol,
            description
          );
          const rcpt = await txn.wait();
          const event: NftContractCreatedEvent = rcpt.events?.find(
            (event) => event.event === "NftContractCreated"
          ) as NftContractCreatedEvent;
          const nftContractCloneAddr = event.args.contractAddr;
          const nftContractClone = new Contract(
            nftContractCloneAddr,
            NFTIMPLEMENT_ABI,
            signer
          ) as NFT;
          await refreshLoadedData();
          setProgressCreateNftCollection(false);
          // toast({
          //   title: "NFT COLLECTION CREATED!",
          //   status: "success",
          //   description: "Your new NFT collection has been created. Redirecting you now..."
          // });
          return nftContractClone;
        } catch (e) {
          dev.error(e);
          // toast({
          //   title: "ERROR!",
          //   status: "error",
          //   description: "Your new NFT collection could not be created. Please try again"
          // });
          setProgressCreateNftCollection(false);
        }
      } else {
        return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [marketplaceContractConn, signer]
  );

  // Function to create new NFT collection
  const createNewAuction = useCallback(
    async (contractAddress: string, tokenId: string, startingBid: string) => {
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateAuction(true);
          const txn = await marketplaceContractConn.createAuctionContract(
            contractAddress,
            tokenId,
            startingBid
          );
          const rcpt = await txn.wait();
          const event: AuctionContractCreatedEvent = rcpt.events?.find(
            (event) => event.event === "AuctionContractCreated"
          ) as AuctionContractCreatedEvent;
          const auctionContractCloneAddr = event.args.contractAddr;
          const auctionContractClone = new Contract(
            auctionContractCloneAddr,
            AUCTIONIMPLEMENT_ABI,
            signer
          ) as NFT;
          await refreshLoadedData();
          setProgressCreateAuction(false);
          // toast({
          //   title: "AUCTION CREATED!",
          //   status: "success",
          //   description: "Your new NFT auction has been created. Redirecting you now..."
          // });
          return auctionContractClone;
        } catch (e) {
          dev.error(e);
          // toast({
          //   title: "ERROR!",
          //   status: "error",
          //   description: "Your new NFT auction could not be created. Please try again"
          // });
          setProgressCreateNftCollection(false);
        }
      } else {
        return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [marketplaceContractConn, signer]
  );

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceContract,
        marketplaceContractConn,
        allNftCollections,
        allNftCollectionsWhereSignerOwnsTokens,
        allNftCollectionsAuthored,
        allNftCollectionsWhereTokenOnSale,
        refreshLoadedData,
        createNewNftCollection,
        createNewAuction,
        progressCreateNftCollection,
        progressCreateAuction,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
