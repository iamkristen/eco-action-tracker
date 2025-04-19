import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import DashboardPreview from "@/components/DashboardPreview";
import ActionLogging from "@/components/ActionLogging";
import ProfileSection from "@/components/ProfileSection";
import Footer from "@/components/Footer";
import { useContract } from "@/contexts/ethereum/ContractContext"; 

const Index = () => {
  const { connectionStatus } = useContract(); // useContract instead of useEthereum
  const { toast } = useToast();

  useEffect(() => {
    if (connectionStatus) {
      toast({
        title: "Connection Status",
        description: connectionStatus,
        variant: "default",
      });
    }
  }, [connectionStatus, toast]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <DashboardPreview />
        <ActionLogging />
        <ProfileSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
