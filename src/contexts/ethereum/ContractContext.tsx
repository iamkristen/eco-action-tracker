import React, { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface ContractContextType {
  contract: ethers.Contract | null;
  connectContract: () => Promise<void>;
  saveTransaction: (userId: string, points: number, carbonSaved: number) => Promise<void>;
  deductUserPoints: (userId: string, points: number) => Promise<void>;
  getUserData: (userId: string) => Promise<UserData | null>;
  walletAddress: string | null;
  connectionStatus: string;
}

export interface UserData {
  totalPoints: number;
  carbonSaved: number;
}

const contractAbi = [
  {
    inputs: [
      { internalType: "string", name: "userId", type: "string" },
      { internalType: "uint256", name: "pointsToDeduct", type: "uint256" }
    ],
    name: "deductPoints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "string", name: "userId", type: "string" },
      { internalType: "uint256", name: "points", type: "uint256" },
      { internalType: "uint256", name: "carbonSaved", type: "uint256" }
    ],
    name: "saveUserData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "userId", type: "string" },
      { indexed: false, internalType: "uint256", name: "totalPoints", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "carbonSaved", type: "uint256" }
    ],
    name: "UserDataUpdated",
    type: "event"
  },
  {
    inputs: [],
    name: "getAllUsers",
    outputs: [{ internalType: "string[]", name: "", type: "string[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "string", name: "userId", type: "string" }],
    name: "getDataByUserID",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  }
];

export const ContractContext = createContext<ContractContextType | null>(null);

const contractAddress = "0xA2B8AC440ba192AaC875F9A128e9cf4EA6C4C60B";

export const ContractProvider = ({ children }: { children: React.ReactNode }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");

  const connectContract = async () => {
    try {
      if (!window.ethereum) {
        setConnectionStatus("MetaMask not installed");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setConnectionStatus("Connected to Ethereum");
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
      setContract(contractInstance);
    } catch (error) {
      setConnectionStatus("Connection failed");
    }
  };

  const saveTransaction = async (userId: string, points: number, carbonSaved: number) => {
    if (!contract) return;
    try {
      const tx = await contract.saveUserData(userId, points, carbonSaved);
      await tx.wait();
    } catch (error) {
      console.error("Error saving transaction:", error);
      setConnectionStatus("Transaction failed");
    }
  };

  const deductUserPoints = async (userId: string, points: number) => {
    if (!contract) return;
    try {
      const tx = await contract.deductPoints(userId, points);
      await tx.wait();
    } catch (error) {
      console.error("Error deducting points:", error);
    }
  };

  const getUserData = async (userId: string): Promise<UserData | null> => {
    if (!contract) return null;
    try {
      const [pointsBN, carbonBN]: [ethers.BigNumberish, ethers.BigNumberish] = await contract.getDataByUserID(userId);
      return {
        totalPoints: Number(pointsBN.toString()),
        carbonSaved: Number(carbonBN.toString())
      };
    } catch (error: any) {
      if (error?.reason === "User does not exist.") return null;
      return null;
    }
  };

  useEffect(() => {
    connectContract();
  }, []);

  return (
    <ContractContext.Provider
      value={{
        contract,
        connectContract,
        saveTransaction,
        deductUserPoints,
        getUserData,
        walletAddress,
        connectionStatus
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) throw new Error("useContract must be used within a ContractProvider");
  return context;
};