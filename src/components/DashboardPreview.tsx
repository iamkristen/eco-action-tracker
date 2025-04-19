import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart2, TrendingUp, Award, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/contexts/TransactionContext";
import { useAuth } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

type MonthlyStats = {
  month: string;
  buys: number;
  sells: number;
  emissions: number;
};

const DashboardPreview = () => {
  const { transactions } = useTransactions();
  const { user } = useAuth();
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [totalActions, setTotalActions] = useState(0);
  const [totalCarbonSaved, setTotalCarbonSaved] = useState(0);
  const [totalEcoPoints, setTotalEcoPoints] = useState(0);

  const filtered = useMemo(() => {
    return transactions.filter((t) => t.userId == user?.id);
    
  }, [transactions, user?.id]);

  useEffect(() => {
    const monthlyMap: { [key: string]: MonthlyStats } = {};
    let carbon = 0;
    let points = 0;

    filtered.forEach((tx) => {
      const date = (tx.createdAt as Timestamp).toDate();
      const month = dayjs(date).format("MMM");

      if (!monthlyMap[month]) {
        monthlyMap[month] = {
          month,
          buys: 0,
          sells: 0,
          emissions: 0,
        };
      }

      if (tx.type === "buy") monthlyMap[month].buys += 1;
      if (tx.type === "sell") monthlyMap[month].sells += 1;

      monthlyMap[month].emissions += tx.carbonSaved / 100;

      carbon += tx.carbonSaved / 100;
      points += tx.points;
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sortedMonths = Object.values(monthlyMap).sort((a, b) =>
      monthNames.indexOf(a.month) - monthNames.indexOf(b.month)
    );

    setMonthlyData(sortedMonths);
    setTotalActions(filtered.length);
    setTotalCarbonSaved(carbon);
    setTotalEcoPoints(points);
  }, [filtered]);

  const impactStats = [
    {
      title: "Total Actions",
      value: totalActions.toString(),
      icon: Leaf,
      color: "text-eco-dark",
      bgColor: "bg-eco-light",
    },
    {
      title: "CO₂ Saved",
      value: `${totalCarbonSaved.toFixed(1)} kg`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Eco Tokens",
      value: `${totalEcoPoints}`,
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-eco-dark">
            Track Your Environmental Impact
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our intuitive dashboard helps you visualize your contribution to the
            planet through detailed metrics and progress tracking.
          </p>
        </div>

        <div className="bg-eco-neutral rounded-2xl p-6 md:p-8 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <BarChart2 className="h-6 w-6 text-eco-dark mr-3" />
            <h3 className="text-xl font-semibold text-eco-dark">
              Your Eco Dashboard
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {impactStats.map((stat, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center">
                  <div className={`${stat.bgColor} rounded-full p-3 mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <h4 className="text-lg font-medium mb-4">Monthly Activity</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="buys" fill="#4CAF50" name="Buy Actions" />
                  <Bar dataKey="sells" fill="#8BC34A" name="Sell Actions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="text-lg font-medium mb-4">
              CO₂ Emissions Reduced
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="emissions"
                    stroke="#4CAF50"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
