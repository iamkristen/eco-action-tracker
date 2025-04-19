import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

type HeroStats = {
  userId: string;
  name: string;
  photoURL?: string;
  carbonSaved: number;
  ecoPoints: number;
};

const EcoHeroesCarousel = () => {
  const { user } = useAuth();
  const [heroes, setHeroes] = useState<HeroStats[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "transactions"), async (snapshot) => {
      const aggregated: { [userId: string]: { carbonSaved: number; ecoPoints: number } } = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const id = data.userId;

        if (!aggregated[id]) {
          aggregated[id] = { carbonSaved: 0, ecoPoints: 0 };
        }

        aggregated[id].carbonSaved += data.carbonSaved / 100;
        aggregated[id].ecoPoints += data.points;
      });

      const userIds = Object.keys(aggregated);

      const heroData: HeroStats[] = await Promise.all(
        userIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, "users", userId));
          const userData = userDoc.exists() ? userDoc.data() : null;

          return {
            userId,
            name: userData?.name || "Anonymous",
            photoURL: userData?.photoURL || undefined,
            carbonSaved: aggregated[userId].carbonSaved,
            ecoPoints: aggregated[userId].ecoPoints,
          };
        })
      );

      const topHeroes = heroData
        .sort((a, b) => b.carbonSaved - a.carbonSaved)
        .slice(0, 10);

      setHeroes(topHeroes);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-12 px-4 md:px-12 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="text-eco-dark mr-2" />
          <h3 className="text-xl font-semibold text-eco-dark">Heroes Saving the Planet</h3>
        </div>

        <ScrollArea className="pb-4 overflow-visible">
          <div className="flex justify-center gap-6 px-2 pb-8">
            {heroes.map((hero) => (
              <Card
                key={hero.userId}
                className="w-64 shrink-0 border-none shadow-md rounded-2xl bg-eco-light/50 hover:scale-[1.02] transition-transform"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 mb-3 ring-4 ring-white shadow-md">
                    <AvatarImage src={hero.photoURL} alt={hero.name} />
                    <AvatarFallback className="bg-eco-dark text-white font-semibold">
                      {hero.name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-semibold text-eco-dark">{hero.name}</p>
                  {hero.userId === user?.id && (
                    <p className="text-xs text-eco-medium mb-1">(You)</p>
                  )}
                  <div className="text-sm space-y-1 mt-2">
                    <p className="text-blue-600 font-medium">
                      CO₂ Saved: <span className="font-bold">{hero.carbonSaved.toFixed(1)} kg</span>
                    </p>
                    <p className="text-amber-600 font-medium">
                      Eco Tokens: <span className="font-bold">{hero.ecoPoints}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
};

export default EcoHeroesCarousel;
