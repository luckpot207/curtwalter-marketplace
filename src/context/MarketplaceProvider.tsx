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
import { Marketplace, NFT } from "../typechain-types/contracts";
import {
  CollectionCreatedEvent,
  SaleCreatedEvent,
  AuctionCreatedEvent,
  SaleCanceledEvent,
  AuctionNewBidEvent,
  AuctionResolvedEvent,
  SaleSuccessedEvent,
} from "../typechain-types/contracts/Marketplace";

import { CollectionV2, NftCollection as INftCollection } from "../types/nft";
import { MarketplaceABI, NftImplementABI } from "../utils/abi";
import { dev } from "../utils/log";
import { MarketplaceAddress, NftImplementAddress } from "../utils/config";
import { toast } from "react-hot-toast";
import { decodeMetadataUri } from "../utils/nft";

interface MarketplaceContextProps {
  marketplaceContract: Marketplace | null;
  marketplaceContractConn: Marketplace | null;
  nftImplementContract: NFT | null;
  allCollections: Marketplace.CollectionStructOutput[];
  allSales: Marketplace.SaleOutputStructOutput[];
  allAuctions: Marketplace.AuctionOutputStructOutput[];
  allCollectionsForSale: CollectionV2[];
  refreshLoadedData: () => Promise<void>;
  createCollection: (
    name: string,
    symbol: string,
    description: string,
    uri: string,
    price: BigNumber,
    supply: BigNumber
  ) => Promise<NFT | null | undefined>;
  createSale: (
    contract: string,
    tokenId: string,
    price: BigNumber
  ) => Promise<string | null | undefined>;
  cancelSale: (saleId: string) => Promise<string | null | undefined>;
  buySale: (
    saleId: string,
    price: string
  ) => Promise<string | null | undefined>;
  createAuction: (
    contract: string,
    tokenId: string,
    price: BigNumber,
    endTime: number
  ) => Promise<string | null | undefined>;
  auctionBid: (
    auctionId: string,
    price: string
  ) => Promise<string | null | undefined>;
  auctionResolve: (auctionId: string) => Promise<string | null | undefined>;
  progressCreateNftCollection: boolean;
  progressCreateAuction: boolean;
  progressCreateSale: boolean;
  getCollectionForLaunchpad: (
    address: string
  ) => Promise<INftCollection | null>;
}

export const MarketplaceContext = createContext<MarketplaceContextProps>({
  marketplaceContract: null,
  marketplaceContractConn: null,
  nftImplementContract: null,
  allCollections: [],
  allSales: [],
  allAuctions: [],
  allCollectionsForSale: [],
  refreshLoadedData: async () => {},
  createCollection: async () => null,
  createSale: async () => null,
  cancelSale: async () => null,
  buySale: async () => null,
  auctionBid: async () => null,
  auctionResolve: async () => null,
  createAuction: async () => null,
  progressCreateNftCollection: false,
  progressCreateAuction: false,
  progressCreateSale: false,
  getCollectionForLaunchpad: async () => null,
});

export const MarketplaceProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [marketplaceContract, setMarketplaceContract] =
    useState<Marketplace | null>(null);
  const [marketplaceContractConn, setMarketplaceContractConn] =
    useState<Marketplace | null>(null);
  const [nftImplementContract, setNftImplementContract] =
    useState<NFT | null>(null);
  const [allCollections, setAllCollections] = useState<
    Marketplace.CollectionStructOutput[]
  >([]);
  const [allSales, setAllSales] = useState<
    Marketplace.SaleOutputStructOutput[]
  >([]);
  const [allAuctions, setAllAuctions] = useState<
    Marketplace.AuctionOutputStructOutput[]
  >([]);
  const [allCollectionsForSale, setAllCollectionsForSale] = useState<
    CollectionV2[]
  >([]);
  const [progressCreateNftCollection, setProgressCreateNftCollection] =
    useState<boolean>(false);
  const [progressCreateAuction, setProgressCreateAuction] =
    useState<boolean>(false);
  const [progressCreateSale, setProgressCreateSale] = useState<boolean>(false);

  // Keep contracts updated
  useEffect(() => {
    if (!!provider) {
      const newMarketplaceContract: Marketplace = new Contract(
        MarketplaceAddress,
        MarketplaceABI,
        provider
      ) as Marketplace;

      setMarketplaceContract(newMarketplaceContract);

      const newNftImplementContract: NFT = new Contract(
        NftImplementAddress,
        NftImplementABI,
        provider
      ) as NFT;

      setNftImplementContract(newNftImplementContract);
    }
    if (!!signer) {
      const newMarketplaceContractConn: Marketplace = new Contract(
        MarketplaceAddress,
        MarketplaceABI,
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
      const newAllCollections = await marketplaceContract.getCollections();
      setAllCollections(newAllCollections);
      const newAllSales = await marketplaceContract.getSales();
      setAllSales(newAllSales);
      const newAllAuctions = await marketplaceContract.getAuctions();
      setAllAuctions(newAllAuctions);

      if (newAllSales.length > 0) {
        const countsByNftContractAddr = allSales.reduce<Record<string, number>>(
          (acc, sale) => {
            if (sale.contractAddress in acc) {
              acc[sale.contractAddress]++;
            } else {
              acc[sale.contractAddress] = 1;
            }
            return acc;
          },
          {}
        );
        // create collection array from the countsByNftContractAddr object
        const collections: CollectionV2[] = await Promise.all(
          Object.entries(countsByNftContractAddr).map(async ([key, value]) => {
            const sale = allSales.filter((sale) => sale.contractAddress == key);
            const obj: CollectionV2 = {
              id: key,
              slug: key,
              title: "",
              thumbnail: "",
              totalItems: 5000,
              listedCount: value,
              floorPrice: ethers.utils.formatEther(sale[0].price),
            } as CollectionV2;
            return obj;
            // console.log("collections", obj);
          })
        );
        setAllCollectionsForSale(collections);
      }
    }
  }, [marketplaceContract, isConnected]);

  // Function to create new NFT collection
  const createCollection = useCallback(
    async (
      name: string,
      symbol: string,
      description: string,
      uri: string,
      price: BigNumber,
      supply: BigNumber
    ) => {
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateNftCollection(true);
          const txn = await marketplaceContractConn.createCollection(
            name,
            symbol,
            description,
            uri,
            price,
            supply
          );
          const rcpt = await txn.wait();
          const event: CollectionCreatedEvent = rcpt.events?.find(
            (event) => event.event === "CollectionCreated"
          ) as CollectionCreatedEvent;
          const author = event.args.author;
          const nftContractCloneAddr = event.args.contractAddress;
          const nftContractClone = new Contract(
            nftContractCloneAddr,
            NftImplementABI,
            signer
          ) as NFT;
          await refreshLoadedData();
          setProgressCreateNftCollection(false);
          toast.success(
            `NFT collection(${nftContractCloneAddr}) created by ${author}!`
          );
          return nftContractClone;
        } catch (e) {
          dev.error(e);
          toast.error("NFT collection creation error!");
          setProgressCreateNftCollection(false);
        }
      } else {
        return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [marketplaceContractConn, signer]
  );

  const getCollectionForLaunchpad = useCallback(
    async (contractAddress: string) => {
      if (!!provider) {
        const nftContract: NFT = new Contract(
          contractAddress,
          NftImplementABI,
          provider
        ) as NFT;
        const nftsUnstruct = await nftContract.getAllNfts();

        const [name, symbol, description, uri, price, supply, author] =
          await Promise.all([
            nftContract.name(),
            nftContract.symbol(),
            nftContract.description(),
            nftContract.uri(),
            nftContract.price(),
            nftContract.supply(),
            nftContract.authorAddr(),
          ]);

        const nftCollection: INftCollection = {
          name,
          symbol,
          description,
          uri,
          price: ethers.utils.formatEther(price),
          supply: ethers.utils.formatEther(supply),
          author,
          contractAddress,
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
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConn.createSale(
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
    [marketplaceContractConn, signer]
  );

  const cancelSale = useCallback(
    async (saleId: string) => {
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConn.cancelSale(saleId, {
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
    [marketplaceContractConn, signer]
  );

  const buySale = useCallback(
    async (saleId: string, price: string) => {
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConn.buySale(saleId, {
            gasLimit: 1000000,
            value: ethers.utils.parseEther(price),
          });
          const rcpt = await txn.wait();
          const event: SaleSuccessedEvent = rcpt.events?.find(
            (event) => event.event === "SaleSuccessed"
          ) as SaleSuccessedEvent;
          const newOwner = event.args.newOwner;
          const contractAddress = event.args.contractAddress;
          const tokenId = event.args.tokenId;
          setProgressCreateSale(false);
          toast.success(
            `Bought the NFT by ${newOwner}: ${tokenId} in ${contractAddress}`
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
    [marketplaceContractConn, signer]
  );

  const createAuction = useCallback(
    async (
      contractAddress: string,
      tokenId: string,
      startingBid: BigNumber,
      endTime: number
    ) => {
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConn.createAuction(
            contractAddress,
            tokenId,
            startingBid,
            endTime
            // { gasLimit: 1000000 }
          );
          const rcpt = await txn.wait();
          const event: AuctionCreatedEvent = rcpt.events?.find(
            (event) => event.event === "AuctionCreated"
          ) as AuctionCreatedEvent;
          const { author, auctionId } = event.args;
          setProgressCreateSale(false);
          toast.success(`Auction ${auctionId} Created by ${author}`);
          return author;
        } catch (e) {
          dev.error(e);
          toast.error("Auction: Your Auction creation is broken.");
          setProgressCreateSale(false);
        }
      } else {
        return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [marketplaceContractConn, signer]
  );

  const auctionBid = useCallback(
    async (auctionId: string, price: string) => {
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConn.auctionBid(auctionId, {
            gasLimit: 1000000,
            value: ethers.utils.parseEther(price),
          });
          const rcpt = await txn.wait();
          const event: AuctionNewBidEvent = rcpt.events?.find(
            (event) => event.event === "AuctionCreated"
          ) as AuctionNewBidEvent;
          const { bidder, amount } = event.args;
          setProgressCreateSale(false);
          toast.success(`New Bid(${amount}) by ${bidder}`);
          return bidder;
        } catch (e) {
          dev.error(e);
          toast.error("Auction: Your bid is fallen.");
          setProgressCreateSale(false);
        }
      } else {
        return null;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [marketplaceContractConn, signer]
  );

  const auctionResolve = useCallback(
    async (auctionId: string) => {
      if (!!marketplaceContractConn && signer) {
        try {
          setProgressCreateSale(true);
          const txn = await marketplaceContractConn.auctionResolve(
            auctionId
            // { gasLimit: 1000000 }
          );
          const rcpt = await txn.wait();
          const event: AuctionResolvedEvent = rcpt.events?.find(
            (event) => event.event === "AuctionCreated"
          ) as AuctionResolvedEvent;
          const { winner } = event.args;
          setProgressCreateSale(false);
          toast.success(`Auction resolved, Winner is ${winner}`);
          return winner;
        } catch (e) {
          dev.error(e);
          toast.error("Auction: Auction resovle is broken.");
          setProgressCreateSale(false);
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
        nftImplementContract,
        allCollections,
        allSales,
        allAuctions,
        allCollectionsForSale,
        refreshLoadedData,
        createCollection,
        createSale,
        cancelSale,
        buySale,
        createAuction,
        auctionBid,
        auctionResolve,
        progressCreateNftCollection,
        progressCreateAuction,
        progressCreateSale,
        getCollectionForLaunchpad,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};
