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
import { Marketplace, NFT, MarketplaceV2 } from "../typechain-types/contracts";
import {
  NftContractCreatedEvent,
  AuctionContractCreatedEvent,
} from "../typechain-types/contracts/Marketplace";
import { SaleCreatedEvent } from "../typechain-types/contracts/MarketplaceV2";
import { NftCollection as INftCollection } from "../types/nft";
import {
  MARKETPLACE_ABI,
  NFTIMPLEMENT_ABI,
  AUCTIONIMPLEMENT_ABI,
  MarketplaceABIV2,
} from "../utils/abi";
import { dev } from "../utils/log";
import {
  MarketplaceAddressV2,
  MARKETPLACE_ADDR,
  NFTIMPLEMENT_ADDR,
} from "../utils/config";
import { toast } from "react-hot-toast";
import { decodeMetadataUri } from "../utils/nft";

interface MarketplaceContextProps {
  marketplaceContract: Marketplace | null;
  marketplaceContractV2: MarketplaceV2 | null;
  nftImplementContract: NFT | null;
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
  createSale: (
    contract: string,
    tokenId: string,
    price: string
  ) => Promise<NFT | null | undefined>;
  progressCreateNftCollection: boolean;
  progressCreateAuction: boolean;
  progressCreateSale: boolean;
  getCollection: (address: string) => Promise<INftCollection | null>;
}

export const MarketplaceContext = createContext<MarketplaceContextProps>({
  marketplaceContract: null,
  marketplaceContractV2: null,
  nftImplementContract: null,
  marketplaceContractConn: null,
  allNftCollections: [],
  allNftCollectionsWhereSignerOwnsTokens: [],
  allNftCollectionsAuthored: [],
  allNftCollectionsWhereTokenOnSale: [],
  refreshLoadedData: async () => {},
  createNewNftCollection: async () => null,
  createNewAuction: async () => null,
  createSale: async () => null,
  progressCreateNftCollection: false,
  progressCreateAuction: false,
  progressCreateSale: false,
  getCollection: async () => null,
});

export const MarketplaceProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [marketplaceContract, setMarketplaceContract] =
    useState<Marketplace | null>(null);
  const [marketplaceContractV2, setMarketplaceContractV2] =
    useState<MarketplaceV2 | null>(null);
  const [marketplaceContractConnV2, setMarketplaceContractConnV2] =
    useState<MarketplaceV2 | null>(null);
  const [nftImplementContract, setNftImplementContract] =
    useState<NFT | null>(null);
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
  const [progressCreateSale, setProgressCreateSale] = useState<boolean>(false);

  // Keep contracts updated
  useEffect(() => {
    if (!!provider) {
      const newMarketplaceContract: Marketplace = new Contract(
        MARKETPLACE_ADDR,
        MARKETPLACE_ABI,
        provider
      ) as Marketplace;

      setMarketplaceContract(newMarketplaceContract);

      const newMarketplaceContractV2: MarketplaceV2 = new Contract(
        MarketplaceAddressV2,
        MarketplaceABIV2,
        provider
      ) as MarketplaceV2;

      setMarketplaceContractV2(newMarketplaceContractV2);

      const newNftImplementContract: NFT = new Contract(
        NFTIMPLEMENT_ADDR,
        NFTIMPLEMENT_ABI,
        provider
      ) as NFT;

      setNftImplementContract(newNftImplementContract);
    }
    if (!!signer) {
      const newMarketplaceContractConn: Marketplace = new Contract(
        MARKETPLACE_ADDR,
        MARKETPLACE_ABI,
        signer
      ) as Marketplace;
      setMarketplaceContractConn(newMarketplaceContractConn);
      const newMarketplaceContractConnV2: MarketplaceV2 = new Contract(
        MarketplaceAddressV2,
        MarketplaceABIV2,
        signer
      ) as MarketplaceV2;
      setMarketplaceContractConnV2(newMarketplaceContractConnV2);
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
          toast.success("NFT COLLECTION CREATED!");
          return nftContractClone;
        } catch (e) {
          dev.error(e);
          toast.error("ERROR!");
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

  const getCollection = useCallback(
    async (contractAddress: string) => {
      if (!!provider) {
        console.log("here >>>>>>", contractAddress);
        const nftContractAddr: string = contractAddress;
        const nftContract: NFT = new Contract(
          nftContractAddr,
          NFTIMPLEMENT_ABI,
          provider
        ) as NFT;
        const nftsUnstruct = await nftContract.getAllNfts();

        const [name, symbol, description, author] = await Promise.all([
          nftContract.name(),
          nftContract.symbol(),
          nftContract.description(),
          nftContract.authorAddr(),
        ]);

        const nftCollection: INftCollection = {
          name,
          symbol,
          description,
          author,
          nftContractAddr,
          nftsInCollection: nftsUnstruct[0].map((tokenId, index) => ({
            tokenId: tokenId.toString(),
            tokenUri: decodeMetadataUri(nftsUnstruct[1][index]),
            tokenOwner: nftsUnstruct[2][index],
            tokenPrice: nftsUnstruct[3][index].toString(),
          })),
        };
        return nftCollection;
      } else {
        return null;
      }
    },
    [nftImplementContract, signer]
  );

  const createSale = useCallback(
    async (contractAddress: string, tokenId: string, price: string) => {
      if (!!marketplaceContractConnV2 && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConnV2.createSale(
            contractAddress,
            tokenId,
            price
          );
          const rcpt = await txn.wait();
          const event: SaleCreatedEvent = rcpt.events?.find(
            (event) => event.event === "SaleCreated"
          ) as SaleCreatedEvent;
          const auctionContractCloneAddr = event.args.author;
          const auctionContractClone = new Contract(
            auctionContractCloneAddr,
            AUCTIONIMPLEMENT_ABI,
            signer
          ) as NFT;
          await refreshLoadedData();
          setProgressCreateSale(false);
          toast.success("Sale Created");
          return auctionContractClone;
        } catch (e) {
          dev.error(e);
          toast.error("Sale: Your sale creation is broken.");
          setProgressCreateSale(false);
        }
      } else {
        return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [marketplaceContractConnV2, signer]
  );

  return (
    <MarketplaceContext.Provider
      value={{
        marketplaceContract,
        marketplaceContractV2,
        nftImplementContract,
        marketplaceContractConn,
        allNftCollections,
        allNftCollectionsWhereSignerOwnsTokens,
        allNftCollectionsAuthored,
        allNftCollectionsWhereTokenOnSale,
        refreshLoadedData,
        createNewNftCollection,
        createNewAuction,
        createSale,
        progressCreateNftCollection,
        progressCreateAuction,
        progressCreateSale,
        getCollection,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
