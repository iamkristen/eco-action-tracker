import { useState } from "react";
import { ShoppingBag, Pencil, Trash, CreditCard } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter as DialogModalFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import { useContract } from "@/contexts/ethereum/ContractContext";
import { useTransactions } from "@/contexts/TransactionContext";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  ecoPoints: number;
  carbonReduction: string;
  image: string;
  seller: string;
  description: string;
  createdBy: string;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

const ProductCard = ({ product, onEdit }: ProductCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { deleteProduct } = useProducts();
  const { saveTransaction } = useContract();
  const { addTransaction } = useTransactions();
  const isOwner = user?.id === product.createdBy;

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id);
      toast({ title: "Product deleted", variant: "default" });
    } catch (error) {
      toast({
        title: "Failed to delete product",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const handlePayment = async () => {
    if (!cardNumber || !cvv || !expiry) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }

    toast({
      title: "Payment Successful",
      description: `You have purchased ${product.name} for $${product.price}`,
    });

    setShowPaymentDialog(false);
    setCardNumber("");
    setCvv("");
    setExpiry("");

    if (!user) return;

    try {
      const buyerPoints = product.ecoPoints;
      const carbon = parseFloat(product.carbonReduction) * 100;

      await saveTransaction(user.id, buyerPoints, carbon);
      await addTransaction({
        userId: user.id,
        type: "buy",
        points: buyerPoints,
        carbonSaved: carbon,
        metadata: product.name,
      });

      if (product.createdBy && product.createdBy !== user.id) {
        const sellerPoints = Math.floor(buyerPoints / 2);
        await saveTransaction(product.createdBy, sellerPoints, carbon);
        await addTransaction({
          userId: product.createdBy,
          type: "sell",
          points: sellerPoints,
          carbonSaved: carbon,
          metadata: product.name,
        });
      }

      toast({
        title: "Rewards Updated",
        description: "Eco points and carbon savings recorded for buyer and seller.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Transaction Error",
        description: "Transaction failed. Please try again."+error,
        variant: "destructive",
      });
      console.error("Save transaction failed:", error);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      setShowLoginDialog(true);
    } else {
      setShowPaymentDialog(true);
    }
  };

  return (
    <>
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

          <div className="flex items-center mt-2 text-sm text-muted-foreground mb-2">
            <span>Carbon saved: {product.carbonReduction}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto">
          {isOwner ? (
            <div className="flex justify-between w-full gap-2">
              <Button variant="outline" className="w-full" onClick={() => onEdit?.(product)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="destructive" className="w-full" onClick={() => setShowConfirmDialog(true)}>
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          ) : (
            <Button className="w-full bg-eco-gradient" onClick={handleBuyNow}>
              <CreditCard className="mr-2 h-4 w-4" />
              Buy Now
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <strong>{product.name}</strong>?
          </p>
          <DialogModalFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogModalFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment for {product.name}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 mt-4">
            <Input placeholder="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
            <div className="flex gap-4">
              <Input placeholder="Expiry (MM/YY)" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
              <Input placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} />
            </div>
          </div>

          <DialogModalFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-eco-gradient" onClick={handlePayment}>
              Pay ${product.price}
            </Button>
          </DialogModalFooter>
        </DialogContent>
      </Dialog>

      <LoginModal
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onShowSignup={() => {
          setShowLoginDialog(false);
          setShowSignupDialog(true);
        }}
      />

      <SignupModal
        open={showSignupDialog}
        onOpenChange={setShowSignupDialog}
        onShowLogin={() => {
          setShowSignupDialog(false);
          setShowLoginDialog(true);
        }}
      />
    </>
  );
};

export default ProductCard;
