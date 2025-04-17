import React, { createContext, useState, useEffect, useContext, JSX } from "react";
import { ApiPromise } from "@polkadot/api";
import { web3Accounts, web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { InjectedAccountWithMeta, InjectedExtension } from "@polkadot/extension-inject/types";

// Define types
export interface PolkadotContextType {
  address: string | undefined;
  addresses: InjectedAccountWithMeta[];
  injector: InjectedExtension | undefined;
  connect: (metaName?: string) => Promise<InjectedAccountWithMeta[]>;
  disconnect: () => void;
  selectAddress: (address: string) => void;
  api: ApiPromise | undefined;
  connectionStatus: string;
}

export interface ConfigType {
  rpcLink: string;
  appName: string;
}

// Create context
export const PolkadotContext = createContext<PolkadotContextType | null>(null);

export const PolkadotProvider = ({ children, config }: { children: JSX.Element; config: ConfigType }) => {
  const [address, setAddress] = useState<string | undefined>();
  const [addresses, setAddresses] = useState<InjectedAccountWithMeta[]>([]);
  const [injector, setInjector] = useState<InjectedExtension | undefined>();
  const [metaName, setMetaName] = useState<string | undefined>();
  const [api, setApi] = useState<ApiPromise>();
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");

  const LOCAL_STORAGE_NAME = `${config.appName}_polkadot`;

  // Handle disconnect
  const disconnect = () => {
    localStorage.removeItem(LOCAL_STORAGE_NAME);
    setAddress(undefined);
    setMetaName(undefined);
    setInjector(undefined);
    setAddresses([]);
  };

  // Handle connection
  const connect = async (metaName: string = "polkadot-js"): Promise<InjectedAccountWithMeta[]> => {
    try {
      const extensions = await web3Enable("EcoTracker");

      if (extensions.length) {
        const allAccounts = await web3Accounts();
        const walletAccounts = allAccounts.filter((item) => item.meta.source === metaName);
        setMetaName(walletAccounts.length ? metaName : undefined);
        setAddresses(walletAccounts);
        return walletAccounts;
      }

      setMetaName(undefined);
      setAddresses([]);
      return [];
    } catch (e) {
      setMetaName(undefined);
      setAddresses([]);
      return [];
    }
  };

  const selectAddress = async (address: string) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify({ metaName, address }));
      setAddress(address);
    } catch (e) {
      disconnect();
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { ApiPromise, WsProvider } = await import("@polkadot/api");
        const provider = new WsProvider(config.rpcLink);
        const apiInstance = await ApiPromise.create({ provider });

        setApi(apiInstance);
        const chain = await apiInstance.rpc.system.chain();
        setConnectionStatus(`Connected to ${chain}`);

        console.log(`Connected to the Polkadot network: ${chain}`);
      } catch (e) {
        setConnectionStatus("Failed to connect to Polkadot testnet");
        console.log("Error:", e);
      }
    })();
  }, []);

  // Update injector when address changes
  useEffect(() => {
    if (address) {
      web3FromAddress(address).then((res) => {
        setInjector(res);
      });
    } else {
      setInjector(undefined);
    }
  }, [address]);

  return (
    <PolkadotContext.Provider
      value={{
        address,
        addresses,
        selectAddress,
        connect,
        disconnect,
        injector,
        api,
        connectionStatus,
      }}
    >
      {children}
    </PolkadotContext.Provider>
  );
};

// Custom hook to access Polkadot context
export const usePolkadot = () => {
  const context = useContext(PolkadotContext);
  if (!context) {
    throw new Error("usePolkadot must be used within a PolkadotProvider");
  }
  return context;
};
