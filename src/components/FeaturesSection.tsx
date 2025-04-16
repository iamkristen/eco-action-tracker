
import { Recycle, TrendingUp, Leaf, Users } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Track All Eco Activities',
      description: 'Log and monitor all your eco-friendly actions including recycling, composting, upcycling, and energy conservation.',
      icon: Recycle,
      iconBg: 'bg-green-100',
      iconColor: 'text-eco-dark'
    },
    {
      title: 'Measure Your Impact',
      description: 'See real-time metrics on CO2 reduction, plastic saved, and other environmental impact metrics from your actions.',
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Earn Eco-Tokens',
      description: 'Get rewarded with eco-tokens for every sustainable action you take, redeemable for eco-friendly products.',
      icon: Leaf,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    {
      title: 'Join the Community',
      description: 'Connect with like-minded individuals making a positive impact on our planet through sustainable practices.',
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <section className="py-16 bg-eco-light/50">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-eco-dark">How EcoTracker Works</h2>
          <p className="text-gray-700">
            Our platform makes it easy to track your sustainable actions and see the real impact you're making on our planet.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className={`${feature.iconBg} rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
