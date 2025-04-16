
import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  ecoPoints: number;
  carbonReduction: string;
  image: string;
  seller: string;
  rating: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
          <Badge variant="outline" className="bg-eco-light text-eco-dark">
            {product.category}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-lg">${product.price}</span>
          <div className="flex items-center">
            <span className="text-eco-dark font-medium">+{product.ecoPoints}</span>
            <Badge variant="secondary" className="ml-1 bg-eco-light text-xs">
              points
            </Badge>
          </div>
        </div>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <span>Carbon saved: {product.carbonReduction}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button className="w-full bg-eco-gradient">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
