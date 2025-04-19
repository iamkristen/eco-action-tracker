import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, getDocs, onSnapshot, doc, getDoc } from "firebase/firestore";
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
    <section className="mt-12">
      <div className="flex items-center mb-4">
        <Sparkles className="text-eco-dark mr-2" />
        <h3 className="text-xl font-semibold text-eco-dark">
          Heroes Saving the Planet
        </h3>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-4">
          {heroes.map((hero) => (
            <Card key={hero.userId} className="w-64 border-none shadow-sm shrink-0">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarImage src={hero.photoURL} alt={hero.name} />
                  <AvatarFallback>
                    {hero.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <p className="font-semibold text-eco-dark">{hero.name}</p>
                <p className="text-xs text-gray-500 mb-2">{hero.userId === user?.id ? "(You)" : ""}</p>
                <div className="text-sm">
                  <p className="text-blue-600">CO₂ Saved: {hero.carbonSaved.toFixed(1)} kg</p>
                  <p className="text-amber-600">Eco Tokens: {hero.ecoPoints}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};

export default EcoHeroesCarousel;
