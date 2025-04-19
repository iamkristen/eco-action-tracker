import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/contexts/TransactionContext";
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";
import { Clock, Leaf, ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ActionLogging = () => {
  const { transactions } = useTransactions();
  const { user } = useAuth();

  const userTransactions = transactions
    .filter((tx) => tx.userId === user?.id)
    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  return (
    <section className="py-16 bg-eco-light/30">
      <div className="container px-4 mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3 text-eco-dark">Your Eco Action History</h2>
          <p className="text-gray-700">
            View all your past buy and sell activities and see the impact you're making.
          </p>
        </div>

        <div className="space-y-4">
          {userTransactions.length === 0 ? (
            <p className="text-center text-gray-600">No eco actions logged yet.</p>
          ) : (
            userTransactions.map((tx) => {
              const date = (tx.createdAt as Timestamp).toDate();
              return (
                <Card key={tx.id} className="shadow-sm">
                  <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-eco-light text-eco-dark">
                        {tx.type === "buy" ? <ShoppingBag className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-lg font-semibold capitalize">{tx.type} action</p>
                        {tx.metadata && <p className="text-sm text-gray-500">Product: {tx.metadata}</p>}
                        <div className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(date, "dd MMM yyyy, HH:mm")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <p className="text-sm">
                        <span className="font-semibold text-green-600">+{tx.points}</span> Eco Points
                      </p>
                      <p className="text-sm text-blue-500">
                        {tx.carbonSaved / 100} kg CO₂ Saved
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default ActionLogging;
