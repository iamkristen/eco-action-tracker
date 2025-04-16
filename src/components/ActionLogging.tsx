
import { useState } from 'react';
import { Check, Leaf, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const actionTypes = [
  { id: 'recycle', name: 'Recycling', icon: RotateCcw, co2Value: 0.5, color: 'bg-blue-100 text-blue-600' },
  { id: 'upcycle', name: 'Upcycling', icon: Leaf, co2Value: 1.2, color: 'bg-green-100 text-eco-dark' },
  { id: 'energy', name: 'Energy Saving', icon: ShieldCheck, co2Value: 0.8, color: 'bg-amber-100 text-amber-600' },
];

const ActionLogging = () => {
  const [selectedAction, setSelectedAction] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isLogged, setIsLogged] = useState(false);
  const [impact, setImpact] = useState({ co2: 0, tokens: 0 });

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const action = actionTypes.find(a => a.id === selectedAction);
    if (!action) return;
    
    // Calculate impact
    const co2Saved = action.co2Value * quantity;
    const tokensEarned = Math.round(co2Saved * 10); // Simple calculation
    
    setImpact({ co2: co2Saved, tokens: tokensEarned });
    setIsLogged(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setIsLogged(false);
      setSelectedAction('');
      setQuantity(1);
    }, 5000);
  };

  return (
    <section className="py-16 bg-eco-light/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3 text-eco-dark">Log Your Eco Actions</h2>
            <p className="text-gray-700">
              Record your sustainable actions and see the immediate positive impact you're making on our planet.
            </p>
          </div>
          
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-eco-gradient p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">New Eco Action</h3>
                <p className="text-white/80 text-sm">Fill out the form below to log your eco-friendly activity</p>
              </div>
              
              <div className="p-6">
                {isLogged ? (
                  <div className="text-center py-8">
                    <div className="rounded-full bg-eco-light w-16 h-16 mx-auto flex items-center justify-center mb-4">
                      <Check className="h-8 w-8 text-eco-dark" />
                    </div>
                    <h3 className="text-2xl font-bold text-eco-dark mb-2">Action Logged!</h3>
                    <p className="text-gray-600 mb-4">
                      Thank you for your contribution to the planet
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-blue-600">CO₂ Saved</p>
                        <p className="text-2xl font-bold text-blue-700">{impact.co2} kg</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-sm text-amber-600">Tokens Earned</p>
                        <p className="text-2xl font-bold text-amber-700">{impact.tokens}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleActionSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Action Type</label>
                        <Select
                          value={selectedAction}
                          onValueChange={setSelectedAction}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an eco action" />
                          </SelectTrigger>
                          <SelectContent>
                            {actionTypes.map((action) => (
                              <SelectItem key={action.id} value={action.id}>
                                <div className="flex items-center">
                                  <div className={cn("rounded-full p-1 mr-2", action.color)}>
                                    <action.icon className="h-4 w-4" />
                                  </div>
                                  {action.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <Input 
                          type="number" 
                          min="1" 
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Input 
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                        <Input 
                          placeholder="Add any additional details about your action"
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        type="submit" 
                        className="w-full bg-eco-gradient"
                        disabled={!selectedAction}
                      >
                        Log Eco Action
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ActionLogging;
