import { useState } from "react";
import { ArrowRight, Leaf, BarChart2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal"; 
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 leaf-pattern overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-full md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-eco-dark mb-6">
                Track Your Eco Impact,
                <span className="text-eco-accent block mt-2">Earn Rewards</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                Join our circular economy community to log eco-friendly actions,
                earn eco-tokens, and make a measurable difference for our planet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="eco-button-primary" size="lg">
                  <Link to="/marketplace">
                    Start Logging Actions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-eco-medium hover:bg-eco-light"
                >
                  <Link to="/rewards">
                    Show My Rewards
                    <BarChart2 className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="bg-eco-light rounded-2xl p-6 md:p-10 shadow-xl relative z-10">
              <div className="absolute -top-3 -right-3 bg-eco-medium text-white rounded-full p-3">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-eco-dark">
                Start Your Eco Journey Today
              </h3>

              <div className="space-y-4 mb-6">
                <div className="bg-white rounded-lg p-4 flex items-start">
                  <div className="rounded-full bg-eco-medium/20 p-2 mr-4">
                    <Leaf className="h-5 w-5 text-eco-dark" />
                  </div>
                  <div>
                    <h4 className="font-medium">Log Eco Actions</h4>
                    <p className="text-sm text-gray-600">
                      Record your recycling, upcycling, and sustainable choices
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 flex items-start">
                  <div className="rounded-full bg-eco-medium/20 p-2 mr-4">
                    <BarChart2 className="h-5 w-5 text-eco-dark" />
                  </div>
                  <div>
                    <h4 className="font-medium">Measure Your Impact</h4>
                    <p className="text-sm text-gray-600">
                      See the environmental difference your actions make
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 flex items-start">
                  <div className="rounded-full bg-eco-medium/20 p-2 mr-4">
                    <Gift className="h-5 w-5 text-eco-dark" />
                  </div>
                  <div>
                    <h4 className="font-medium">Earn Eco-Rewards</h4>
                    <p className="text-sm text-gray-600">
                      Get eco-tokens for sustainable actions and redeem rewards
                    </p>
                  </div>
                </div>
              </div>

              {!isAuthenticated && (
                <Button
                  className="w-full bg-eco-gradient"
                  onClick={() => setShowLogin(true)}
                >
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>

            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-eco-medium/20 -z-10"></div>
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-eco-medium/10 -z-10"></div>
          </div>
        </div>
      </div>

      {/* 🔐 Login Modal */}
      <LoginModal
        open={showLogin}
        onOpenChange={(val) => setShowLogin(val)}
        onShowSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

     
      <SignupModal
        open={showSignup}
        onOpenChange={(val) => setShowSignup(val)}
        onShowLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </section>
  );
};

export default Hero;
