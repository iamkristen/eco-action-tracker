import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductFormData = {
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
  ecoPoints: number;
  carbonReduction: string;
  seller: string;
  createdBy: string;
};

type AddProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProductFormData) => void;
  initialData?: Omit<ProductFormData, "ecoPoints" | "carbonReduction">;
};

const AddProductModal = ({
  open,
  onOpenChange,
  onSave,
  initialData,
}: AddProductModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const getEcoMeta = (category: string) => {
    switch (category.toLowerCase()) {
      case "personal care":
        return { ecoPoints: 25, carbonReduction: "0.7 kg CO₂" };
      case "kitchen":
        return { ecoPoints: 30, carbonReduction: "1.0 kg CO₂" };
      case "bags":
        return { ecoPoints: 35, carbonReduction: "1.5 kg CO₂" };
      case "electronics":
        return { ecoPoints: 50, carbonReduction: "3.0 kg CO₂" };
      case "stationery":
        return { ecoPoints: 20, carbonReduction: "0.4 kg CO₂" };
      case "home":
        return { ecoPoints: 40, carbonReduction: "2.0 kg CO₂" };
      default:
        return { ecoPoints: 10, carbonReduction: "0.2 kg CO₂" };
    }
  };

  const handleSubmit = async () => {
    if (!name || !description || !image || !category || !price) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    const { ecoPoints, carbonReduction } = getEcoMeta(category);

    setLoading(true);
    try {
      await onSave({
        name,
        description,
        image,
        category,
        price: parseFloat(price),
        ecoPoints,
        carbonReduction,
        seller: user?.name || "Anonymous",
        createdBy: user?.id || "anonymous",
      });

      toast({
        title: initialData ? "Product updated!" : "Product added!",
        description: `Your product has been successfully ${
          initialData ? "updated" : "added"
        }.`,
      });

      onOpenChange(false);

      if (!initialData) {
        setName("");
        setDescription("");
        setImage("");
        setCategory("");
        setPrice("");
      }
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setImage(initialData.image);
      setCategory(initialData.category);
      setPrice(initialData.price.toString());
    }
  }, [initialData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Textarea
            placeholder="Product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {["Personal Care", "Kitchen", "Bags", "Electronics", "Stationery", "Home"].map(
                (cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Price (e.g., 9.99)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Product" : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
