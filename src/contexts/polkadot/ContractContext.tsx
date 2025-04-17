import React, { createContext, useState, useEffect, useContext } from "react";
import { ApiPromise } from "@polkadot/api";
import { ContractPromise, Abi } from "@polkadot/api-contract"; // Ensure you're importing the correct types
import { usePolkadot } from "./PolkadotContext"; // Use PolkadotContext to get the API

// Define the ContractContextType interface
export interface ContractContextType {
  contract: ContractPromise | null;
  connectContract: () => void;
  saveTransaction: (userId: string, points: number, carbonSaved: number) => void;
  getUserData: (userId: string) => Promise<UserData | null>; // Return UserData type
}

// Define UserData type
export interface UserData {
  totalPoints: number;
  carbonSaved: number;
}

// Create the context
export const ContractContext = createContext<ContractContextType | null>(null);

export const ContractProvider = ({ children }: { children: React.ReactNode }) => {
  const [contract, setContract] = useState<ContractPromise | null>(null);
  const { api, address } = usePolkadot(); 

  useEffect(() => {
    if (api && address) {
      connectContract();
    }
  }, [api, address]);

  const contractAddress = "0x6e495aEAAF4FACF25bcdEbcdf4C72e99e70cd74d"; // Contract address
  const contractAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalPoints",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "carbonSaved",
				"type": "uint256"
			}
		],
		"name": "UserDataUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAllUsers",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "userId",
				"type": "string"
			}
		],
		"name": "getDataByUserID",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "carbonSaved",
				"type": "uint256"
			}
		],
		"name": "saveUserData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

  // Connect to the contract using Polkadot API
  const connectContract = async () => {
    try {
        const chainProperties = await api.rpc.system.properties();
      const abi = new Abi(contractAbi as unknown as Record<string,unknown>, chainProperties);
      const contract = new ContractPromise(api, abi, contractAddress);
      setContract(contract);
      console.log("Contract connected successfully!");
    } catch (error) {
      console.error("Error connecting to contract:", error);
    }
  };

  // Function to save transaction on the contract
  const saveTransaction = async (userId: string, points: number, carbonSaved: number) => {
    if (contract) {
      try {
        const result = await contract.query.saveUserData(address, { value: 0, gasLimit: -1 }, userId, points, carbonSaved);
        console.log("Transaction successful:", result);
      } catch (error) {
        console.error("Error saving transaction:", error);
      }
    }
  };

  // Function to get user data from the contract
  const getUserData = async (userId: string): Promise<UserData | null> => {
    if (contract) {
      try {
        const result = await contract.query.getDataByUserID(address, { value: 0, gasLimit: -1 }, userId);
        const userData = result.output.toHuman();
        
        // Cast the result to UserData type
        const formattedUserData: UserData = {
          totalPoints: userData[0] as number,  // Extract values from the output
          carbonSaved: userData[1] as number, // Extract values from the output
        };
        
        return formattedUserData;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    }
    return null;
  };

  return (
    <ContractContext.Provider value={{ contract, connectContract, saveTransaction, getUserData }}>
      {children}
    </ContractContext.Provider>
  );
};

// Custom hook to access ContractContext
export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
