import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase";

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  createdBy: string;
  createdAt: Timestamp;
  price: number;
  ecoPoints: number;
  carbonReduction: string;
  seller: string;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  updateProduct: (id: string, updatedData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loading: boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch and listen to products in real-time
  const fetchProducts = () => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Product[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Product, "id">),
      }));
      setProducts(data);
      setLoading(false);
    });

    return unsubscribe;
  };

  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct = {
      ...product,
      createdAt: Timestamp.now(),
    };
    await addDoc(collection(db, "products"), newProduct);
  };

  const updateProduct = async (id: string, updatedData: Partial<Product>) => {
    const productRef = doc(db, "products", id);
    await updateDoc(productRef, updatedData);
  };

  const deleteProduct = async (id: string) => {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);
  };

  useEffect(() => {
    const unsubscribe = fetchProducts();
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, loading }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
