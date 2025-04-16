import { useState } from "react";
import { Gift, CreditCard, ArrowRight, Award, Coins, ShoppingBag, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Sample rewards data
const rewardsData = {
  totalPoints: 1250,
  history: [
    { id: 1, type: "Purchase", description: "Eco-friendly Water Bottle", points: 50, date: "2025-04-10" },
    { id: 2, type: "Purchase", description: "Bamboo Toothbrush Set", points: 35, date: "2025-04-05" },
    { id: 3, type: "Referral", description: "Friend Signup Bonus", points: 100, date: "2025-03-28" },
    { id: 4, type: "Purchase", description: "Solar Powered Charger", points: 75, date: "2025-03-15" },
  ],
};

// Gift card options
const giftCardOptions = [
  { id: 1, name: "Amazon Gift Card", pointsRequired: 500, image: "https://placehold.co/400x240/eee/31343C?text=Amazon+Gift+Card", discount: "5% off" },
  { id: 2, name: "Eco Store Gift Card", pointsRequired: 400, image: "https://placehold.co/400x240/eee/31343C?text=Eco+Store+Card", discount: "10% off" },
  { id: 3, name: "Coffee Shop Card", pointsRequired: 300, image: "https://placehold.co/400x240/eee/31343C?text=Coffee+Shop+Card", discount: "Free drink" },
];

// Other reward options
const otherRewardOptions = [
  { id: 1, name: "Tree Planting Donation", pointsRequired: 200, image: "https://placehold.co/400x240/eee/31343C?text=Tree+Planting", impact: "Plants 5 trees" },
  { id: 2, name: "Carbon Offset Credit", pointsRequired: 350, image: "https://placehold.co/400x240/eee/31343C?text=Carbon+Offset", impact: "Offsets 1 ton CO2" },
  { id: 3, name: "Exclusive Eco Product", pointsRequired: 600, image: "https://placehold.co/400x240/eee/31343C?text=Eco+Product", impact: "Limited edition item" },
];

const Rewards = () => {
  const [activeTab, setActiveTab] = useState("gift-cards");
  const { toast } = useToast();

  const handleRedemption = (option: any) => {
    if (rewardsData.totalPoints >= option.pointsRequired) {
      toast({
        title: "Redemption Successful!",
        description: `You've redeemed ${option.pointsRequired} points for ${option.name}.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Not Enough Points",
        description: `You need ${option.pointsRequired - rewardsData.totalPoints} more points to redeem this reward.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-eco-medium to-eco-dark text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Eco Rewards</h1>
                <p className="text-lg max-w-2xl">
                  Earn points with every sustainable choice and redeem them for rewards that matter.
                </p>
              </div>
              <div className="mt-6 md:mt-0 bg-white/20 p-6 rounded-lg backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Coins className="h-8 w-8 text-yellow-300" />
                  <div>
                    <p className="text-sm font-medium">Available Points</p>
                    <p className="text-3xl font-bold">{rewardsData.totalPoints}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Navigation */}
        <div className="container mx-auto px-4 py-8">
          <NavigationMenu className="justify-center mb-8">
            <NavigationMenuList className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={activeTab === "gift-cards" ? "bg-eco-light text-eco-dark" : ""}
                  onClick={() => setActiveTab("gift-cards")}
                >
                  <Gift className="mr-2 h-4 w-4" />
                  Gift Cards
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={activeTab === "eco-rewards" ? "bg-eco-light text-eco-dark" : ""}
                  onClick={() => setActiveTab("eco-rewards")}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Eco Rewards
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={activeTab === "history" ? "bg-eco-light text-eco-dark" : ""}
                  onClick={() => setActiveTab("history")}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Points History
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Gift Cards Section */}
          {activeTab === "gift-cards" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Gift Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {giftCardOptions.map((card) => (
                  <Card key={card.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{card.name}</CardTitle>
                        <Badge variant="outline" className="bg-eco-light text-eco-dark">
                          {card.discount}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>Digital redemption code</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-bold">{card.pointsRequired} points</span>
                      </div>
                      <Button 
                        className={`bg-eco-gradient ${rewardsData.totalPoints < card.pointsRequired ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleRedemption(card)}
                      >
                        Redeem <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Eco Rewards Section */}
          {activeTab === "eco-rewards" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Environmental Impact Rewards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherRewardOptions.map((reward) => (
                  <Card key={reward.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                        <Badge variant="outline" className="bg-eco-light text-eco-dark">
                          Impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <BadgePercent className="h-4 w-4 mr-2" />
                        <span>{reward.impact}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="font-bold">{reward.pointsRequired} points</span>
                      </div>
                      <Button 
                        className={`bg-eco-gradient ${rewardsData.totalPoints < reward.pointsRequired ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleRedemption(reward)}
                      >
                        Redeem <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Points History Section */}
          {activeTab === "history" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Points History</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="grid grid-cols-12 bg-gray-50 py-3 px-4 border-b">
                  <div className="col-span-5 font-medium">Activity</div>
                  <div className="col-span-3 font-medium">Type</div>
                  <div className="col-span-2 font-medium">Date</div>
                  <div className="col-span-2 font-medium text-right">Points</div>
                </div>
                {rewardsData.history.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 py-4 px-4 border-b last:border-0 hover:bg-gray-50">
                    <div className="col-span-5">{item.description}</div>
                    <div className="col-span-3">{item.type}</div>
                    <div className="col-span-2 text-muted-foreground">{item.date}</div>
                    <div className="col-span-2 text-right font-medium text-green-600">+{item.points}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Rewards;
