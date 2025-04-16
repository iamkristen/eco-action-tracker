
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart2, TrendingUp, Award, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const data = [
  { month: 'Jan', recycled: 20, upcycled: 5, emissions: 10 },
  { month: 'Feb', recycled: 25, upcycled: 8, emissions: 15 },
  { month: 'Mar', recycled: 30, upcycled: 10, emissions: 20 },
  { month: 'Apr', recycled: 35, upcycled: 12, emissions: 25 },
  { month: 'May', recycled: 40, upcycled: 15, emissions: 30 },
  { month: 'Jun', recycled: 45, upcycled: 20, emissions: 35 },
];

const impactStats = [
  { title: 'Total Actions', value: '243', icon: Leaf, color: 'text-eco-dark', bgColor: 'bg-eco-light' },
  { title: 'CO₂ Saved', value: '128kg', icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Eco Tokens', value: '1,540', icon: Award, color: 'text-amber-600', bgColor: 'bg-amber-100' },
];

const DashboardPreview = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-eco-dark">Track Your Environmental Impact</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Our intuitive dashboard helps you visualize your contribution to the planet through detailed metrics and progress tracking.
          </p>
        </div>
        
        <div className="bg-eco-neutral rounded-2xl p-6 md:p-8 shadow-lg mb-8">
          <div className="flex items-center mb-6">
            <BarChart2 className="h-6 w-6 text-eco-dark mr-3" />
            <h3 className="text-xl font-semibold text-eco-dark">Your Eco Dashboard</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {impactStats.map((stat, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-4 flex items-center">
                  <div className={`${stat.bgColor} rounded-full p-3 mr-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
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
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="recycled" fill="#4CAF50" name="Items Recycled" />
                  <Bar dataKey="upcycled" fill="#8BC34A" name="Items Upcycled" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h4 className="text-lg font-medium mb-4">CO₂ Emissions Reduced</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="emissions" stroke="#4CAF50" activeDot={{ r: 8 }} />
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
