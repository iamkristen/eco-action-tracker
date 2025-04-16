
import { User, Calendar, Leaf, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

const recentActions = [
  { id: 1, type: 'Recycling', date: '2025-04-12', items: 5, impact: '2.5kg CO₂ saved' },
  { id: 2, type: 'Upcycling', date: '2025-04-10', items: 1, impact: '1.2kg CO₂ saved' },
  { id: 3, type: 'Energy Saving', date: '2025-04-08', items: 1, impact: '0.8kg CO₂ saved' },
];

const badges = [
  { name: 'Recycling Novice', progress: 80, total: 50 },
  { name: 'Energy Saver', progress: 60, total: 30 },
  { name: 'Eco Warrior', progress: 35, total: 100 },
];

const ProfileSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 text-eco-dark">Your Eco Profile</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Track your progress, view your eco-actions history, and earn badges for your environmental contributions.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-eco-neutral rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              <div className="rounded-full bg-eco-light p-1 border-4 border-eco-medium">
                <div className="bg-eco-medium rounded-full p-4 text-white">
                  <User className="h-12 w-12" />
                </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h3 className="text-2xl font-bold mb-2">Eco Enthusiast</h3>
                <p className="text-gray-600 mb-3">Member since April 2025</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="eco-badge-green">Recycling Pro</span>
                  <span className="eco-badge-earth">Energy Saver</span>
                  <span className="eco-badge-green">Eco Helper</span>
                </div>
              </div>
              
              <div className="text-center bg-white rounded-lg py-3 px-5 shadow-sm">
                <p className="text-sm text-gray-600">Eco Balance</p>
                <p className="text-2xl font-bold text-eco-dark">1,540</p>
                <p className="text-xs text-eco-dark">Eco-Tokens</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Actions
                </h4>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {recentActions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="rounded-full bg-eco-light p-2 mr-3">
                              <Leaf className="h-4 w-4 text-eco-dark" />
                            </div>
                            <div>
                              <p className="font-medium">{action.type}</p>
                              <p className="text-sm text-gray-500">{action.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{action.items} {action.items > 1 ? 'items' : 'item'}</p>
                            <p className="text-xs text-eco-dark">{action.impact}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button asChild variant="ghost" className="w-full mt-4 text-eco-dark hover:text-eco-dark hover:bg-eco-light">
                      <Link to="/history">
                        View All History
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Badges Progress
                </h4>
                <Card className="bg-white border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="space-y-5">
                      {badges.map((badge, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{badge.name}</span>
                            <span className="text-sm text-gray-500">
                              {Math.round((badge.progress / badge.total) * 100)}% complete
                            </span>
                          </div>
                          <Progress value={(badge.progress / badge.total) * 100} className="h-2 bg-eco-light" />
                          <p className="text-xs text-gray-500 mt-1">
                            {badge.progress}/{badge.total} actions completed
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    <Button asChild variant="ghost" className="w-full mt-4 text-eco-dark hover:text-eco-dark hover:bg-eco-light">
                      <Link to="/badges">
                        View All Badges
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
