import { createContext, useContext, ReactNode, useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import { DEFAULT_CONTEXT_FUNCTION } from "./CommonContext";
import { BLOCKCHAIN } from "../utils/enums";

interface EthConnectionProps {
  provider: ethers.providers.Web3Provider | null
  signer: ethers.Signer | null
  signerAddr: string
  progress: boolean
  error: boolean
  connectWallet: () => void
  disconnectWallet: () => void
  isConnected: boolean
}

export const EthConnectionContext = createContext<EthConnectionProps>({
  provider: null,
  signer: null,
  signerAddr: "",
  progress: false,
  error: false,
  connectWallet: DEFAULT_CONTEXT_FUNCTION,
  disconnectWallet: DEFAULT_CONTEXT_FUNCTION,
  isConnected: false
});

export const EthConnectionProvider = ({ defaultNetwork, children }: { defaultNetwork: BLOCKCHAIN, children: ReactNode }) => {
  // TOASTS
  const toast = useToast();

  // WEB3
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [signerAddr, setSignerAddr] = useState<string>("");
  const [network, setNetwork] = useState<BLOCKCHAIN>(defaultNetwork);
  const [progress, setProgress] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [web3Modal] = useState<Web3Modal>(
    () =>
      new Web3Modal({
        network,
        cacheProvider: true, // very important
        providerOptions: {}
      })
  );

  // Function to start setup
  const setup = useCallback(async (typeOfSetup: "connect" | "disconnect" | "change") => {
    if (typeOfSetup === "connect" || typeOfSetup === "change") { // Handle connecting wallet and contracts
      if (!("ethereum" in window && !!window.ethereum.request)) {
        toast({
          title: "METAMASK NOT FOUND",
          description: "Please install the Metamask extension to continue.",
          status: "error"
        });
      } else {
        try {
          setProgress(true);
          setError(false);

          const [newSignerAddr] = await window.ethereum.request({ method: "eth_requestAccounts" }) as Array<string>;
          setSignerAddr(newSignerAddr);

          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(newProvider);

          const newSigner = newProvider.getSigner();
          setSigner(newSigner);

          toast({
            title: typeOfSetup === "change" ? "ACCOUNT CHANGED" : "WALLET CONNECTED",
            description: typeOfSetup === "change" ? "Switched to another account!" : "Your wallet is connected.",
            status: typeOfSetup === "change" ? "info" : "success"
          });
          console.log(typeOfSetup === "change" ? "ACCOUNT CHANGED!" : "WALLET CONNECTED");

        } catch (e) {
          setError(true);
          console.error("ERROR WHILE SETTING UP WALLET", e);
          toast({
            title: "CONNECTION ERROR",
            description: "Your wallet could not be connected! Try again.",
            status: "error"
          });
        } finally {
          setProgress(false);
        }
      }
    } else {
      setProvider(null);
      setSigner(null);
      setSignerAddr("");
      toast({
        title: "WALLET DISCONNECTED",
        description: "Your wallet is now disconnected!",
        status: "warning"
      });
      console.log("WALLET DISCONNECTED");
    }

  }, [toast])

  // Function that the Connect button will invoke
  const connectWallet = useCallback(async () => {
    try {
      setProgress(true);
      const provider = await web3Modal.connect();
      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const userAddress = await ethersProvider.getSigner().getAddress();
      setSignerAddr(userAddress);
      // await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (e: any) {
      if (e.message === "User rejected the request.") {
        toast({
          title: "REQUEST REJECTED",
          description: "You must accept the connection request!",
          status: "error"
        });
      }
    } finally {
      setProgress(false);
    }
  }, [])

  const disconnectWallet = useCallback(async () => {
    try {
      setProgress(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (e: any) {
      if (e.message === "User rejected the request.") {
        toast({
          title: "REQUEST REJECTED",
          description: "You must accept the connection request!",
          status: "error"
        });
      }
    } finally {
      setProgress(false);
    }
  }, [])

  // Setup provider and signer update listener
  useEffect(() => {
    const handleAccountChange = async () => {
      const [newSignerAddr] = await window.ethereum?.request({ method: "eth_accounts" }) as Array<string>;

      if (newSignerAddr !== signerAddr) {
        if (!!newSignerAddr && newSignerAddr !== "") { // New account was selected
          await setup(signerAddr !== "" ? "change" : "connect");

        } else if (!newSignerAddr || newSignerAddr === "") { // All accounts disconnected
          await setup("disconnect");
        }
      }
    }
    window.ethereum?.on("accountsChanged", handleAccountChange);
    return () => { window.ethereum?.removeListener("accountsChanged", handleAccountChange) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signerAddr])

  // Handle wallet pre-connection on page load if wallet is already connected
  useEffect(() => {
    (async () => {
      if ("ethereum" in window) {
        const [newSignerAddr] = await window.ethereum?.request({ method: "eth_accounts" }) as Array<string>;
        if (!!newSignerAddr && newSignerAddr !== "") { // If wallet is pre-connected
          await setup("connect");
        }
      }
    })()
  }, [])

  return (
    <EthConnectionContext.Provider
      value={{
        provider,
        signer,
        signerAddr,
        progress,
        error,
        connectWallet,
        disconnectWallet,
        isConnected: signerAddr !== ""
      }}>
      {children}
    </EthConnectionContext.Provider>
  )
}

export const useEthConnection = () => useContext(EthConnectionContext);