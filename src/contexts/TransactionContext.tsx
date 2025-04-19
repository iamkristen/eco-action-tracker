import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase";

export type Transaction = {
  id: string;
  userId: string;
  type: "buy" | "sell";
  points: number;
  carbonSaved: number;
  metadata?: string;
  createdAt: Timestamp;
};

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "id" | "createdAt">) => Promise<void>;
  loading: boolean;
};

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = () => {
    const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Transaction[] = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          userId: d.userId,
          type: d.type,
          points: d.points,
          carbonSaved: d.carbonSaved,
          metadata: d.metadata || "",
          createdAt: d.createdAt || d.timestamp || Timestamp.now(), // fallback
        };
      });
      setTransactions(data);
      setLoading(false);
    });
    return unsubscribe;
  };

  const addTransaction = async (tx: Omit<Transaction, "id" | "createdAt">) => {
    await addDoc(collection(db, "transactions"), {
      ...tx,
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now(),
    });
  };

  useEffect(() => {
    const unsubscribe = fetchTransactions();
    return () => unsubscribe();
  }, []);

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, loading }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};
