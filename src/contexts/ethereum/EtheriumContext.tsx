import React, { createContext, useContext, useEffect, useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface EthereumContextType {
  connectionStatus: string;
}

interface EthereumProviderProps {
  children: React.ReactNode;
  config: {
    appName: string;
    rpcLink: string;
  };
}

export const EthereumContext = createContext<EthereumContextType | null>(null);

export const EthereumProvider = ({ children, config }: EthereumProviderProps) => {
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          setConnectionStatus(`Connected to Ethereum via MetaMask - ${config.appName}`);
        } catch (error) {
          setConnectionStatus("❌ Failed to connect to MetaMask");
        }
      } else {
        setConnectionStatus("❌ MetaMask not detected");
      }
    };

    connectWallet();
  }, [config]);

  return (
    <EthereumContext.Provider value={{ connectionStatus }}>
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (!context) {
    throw new Error("useEthereum must be used within an EthereumProvider");
  }
  return context;
};
