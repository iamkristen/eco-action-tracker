
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import DashboardPreview from "@/components/DashboardPreview";
import ActionLogging from "@/components/ActionLogging";
import ProfileSection from "@/components/ProfileSection";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
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
