import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PolkadotProvider } from "./contexts/polkadot/PolkadotContext"; // Import PolkadotProvider
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import Rewards from "./pages/Rewards";
import NotFound from "./pages/NotFound";
import { ProductProvider } from "./contexts/ProductContext";
import { Toaster } from "@/components/ui/toaster";
import { Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Contract } from "@polkadot/api-contract/base";
import { ContractProvider } from "./contexts/polkadot/ContractContext";


const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const initPolkadot = async () => {
    };
    initPolkadot();
  }, []); 

  return (
    
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProductProvider>
          <PolkadotProvider config={{ appName: "EcoTracker", rpcLink: "wss://westend-rpc.polkadot.io" }}>
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
          </PolkadotProvider>
        </ProductProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
  
  
};

export default App;
