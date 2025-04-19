import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { EthereumProvider } from "./contexts/ethereum/EtheriumContext"; // Renamed from PolkadotProvider
import { ContractProvider } from "./contexts/ethereum/ContractContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";

import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransactionProvider } from "./contexts/TransactionContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductProvider>
          <TransactionProvider>
          <EthereumProvider config={{ appName: "EcoTracker", rpcLink: "https://rpc-url-not-used-anymore" }}>
            <ContractProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/rewards" element={<Rewards />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ContractProvider>
          </EthereumProvider>
          </TransactionProvider>
        </ProductProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
