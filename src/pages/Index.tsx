import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"; // Import the useToast hook
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import DashboardPreview from "@/components/DashboardPreview";
import ActionLogging from "@/components/ActionLogging";
import ProfileSection from "@/components/ProfileSection";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { usePolkadot } from "@/contexts/polkadot/PolkadotContext"; // Import PolkadotContext

const Index = () => {
  const { connectionStatus } = usePolkadot();
  const { toast } = useToast();
  useEffect(() => {
    if (connectionStatus) {
      toast({
        title: "Connection Status",
        description: connectionStatus,
        variant: "default", 
      });
    }
  }, [connectionStatus, toast]); // The useEffect will run when the connectionStatus changes

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturesSection />
        <DashboardPreview />
        <ActionLogging />
        <ProfileSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
