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
import {
  SaleCanceledEvent,
  SaleCreatedEvent,
  SaleSuccessedEvent,
} from "../typechain-types/contracts/MarketplaceV2";
import { CollectionV2, NftCollection as INftCollection } from "../types/nft";
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
  allCollections: CollectionV2[];
  allSales: MarketplaceV2.SaleStructOutput[];
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
    price: BigNumber
  ) => Promise<string | null | undefined>;
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
  allCollections: [],
  allSales: [],
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
  const [allCollections, setAllCollections] = useState<CollectionV2[]>([]);
  const [allSales, setAllSales] = useState<MarketplaceV2.SaleStructOutput[]>(
    []
  );
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
    refreshLoadedDataV2();
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

  const refreshLoadedDataV2 = useCallback(async () => {
    if (!!marketplaceContractV2) {
      const newAllSales = await marketplaceContractV2.getSales();
      setAllSales(newAllSales);
      if (newAllSales.length > 0) {
        const countsByNftContractAddr = allSales.reduce<Record<string, number>>(
          (acc, sale) => {
            if (sale.nftContractAddr in acc) {
              acc[sale.nftContractAddr]++;
            } else {
              acc[sale.nftContractAddr] = 1;
            }
            return acc;
          },
          {}
        );

        // create collection array from the countsByNftContractAddr object
        const collections: CollectionV2[] = await Promise.all(
          Object.entries(countsByNftContractAddr).map(async ([key, value]) => {
            // const collection = await getCollectionById(key);
            const collection = allSales.filter(
              (sale) => sale.nftContractAddr == key
            );
            const obj: CollectionV2 = {
              id: key,
              slug: key,
              title: "",
              thumbnail: "",
              totalItems: 5000,
              listedCount: value,
              floorPrice: ethers.utils.formatEther(collection[0].price),
            } as CollectionV2;
            return obj;
            // console.log("collections", obj);
          })
        );
        setAllCollections(collections);
      }
    }
  }, [marketplaceContractV2, marketplaceContractConnV2, isConnected]);

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
    async (contractAddress: string, tokenId: string, price: BigNumber) => {
      if (!!marketplaceContractConnV2 && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConnV2.createSale(
            contractAddress,
            tokenId,
            price,
            { gasLimit: 1000000 }
          );
          const rcpt = await txn.wait();
          const event: SaleCreatedEvent = rcpt.events?.find(
            (event) => event.event === "SaleCreated"
          ) as SaleCreatedEvent;
          const author = event.args.author;
          setProgressCreateSale(false);
          toast.success(`Sale Created by ${author}`);
          return author;
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

  const cancelSale = useCallback(
    async (saleId: string) => {
      if (!!marketplaceContractConnV2 && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConnV2.cancelSale(saleId, {
            gasLimit: 1000000,
          });
          const rcpt = await txn.wait();
          const event: SaleCanceledEvent = rcpt.events?.find(
            (event) => event.event === "SaleCanceled"
          ) as SaleCanceledEvent;
          const author = event.args.author;
          setProgressCreateSale(false);
          toast.success(`Sale Created by ${author}`);
          return author;
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

  const buySale = useCallback(
    async (saleId: string) => {
      if (!!marketplaceContractConnV2 && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConnV2.buySale(saleId, {
            gasLimit: 1000000,
          });
          const rcpt = await txn.wait();
          const event: SaleSuccessedEvent = rcpt.events?.find(
            (event) => event.event === "SaleSuccessed"
          ) as SaleSuccessedEvent;
          const newOwner = event.args.newOwner;
          const nftContractAddress = event.args.nftContractAddress;
          const tokenId = event.args.tokenId;
          setProgressCreateSale(false);
          toast.success(
            `${newOwner} bought the NFT : ${tokenId} in ${nftContractAddress}`
          );
          return newOwner;
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

  const getCollectionById = useCallback(
    async (nftContractAddr: string) => {
      if (allSales.length > 0) {
        const sales = allSales.filter(
          (sale) => sale.nftContractAddr == nftContractAddr
        );
        return sales;
      } else {
        return [];
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [allSales]
  );

  const getCollections = useCallback(async () => {
    if (allSales.length > 0) {
      const countsByNftContractAddr = allSales.reduce<Record<string, number>>(
        (acc, sale) => {
          if (sale.nftContractAddr in acc) {
            acc[sale.nftContractAddr]++;
          } else {
            acc[sale.nftContractAddr] = 1;
          }
          return acc;
        },
        {}
      );
      console.log(countsByNftContractAddr);
      for (const [key, value] of Object.entries(countsByNftContractAddr)) {
        console.log(`${key}: ${value}`);
      }

      // return sales;
    } else {
      return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSales]);

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
        allCollections,
        allSales,
        refreshLoadedData,
        createNewNftCollection,
        createNewAuction,
        createSale,
        // getCollectionById,
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
