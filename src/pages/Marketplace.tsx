import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/marketplace/ProductCard";
import AddProductModal from "@/components/marketplace/AddProductModal";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/contexts/ProductContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { isAuthenticated, user } = useAuth();
  const { products, loading, addProduct, updateProduct } = useProducts();

  const categories = [
    "All",
    "Personal Care",
    "Kitchen",
    "Bags",
    "Electronics",
    "Stationery",
    "Home",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const isUserProduct = product.createdBy === user?.id;

    const includeProduct = showOnlyMine ? isUserProduct : !isUserProduct;

    return matchesSearch && matchesCategory && includeProduct;
  });

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="bg-gradient-to-r from-eco-medium to-eco-dark text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Eco Marketplace</h1>
            <p className="text-lg md:text-xl max-w-2xl">
              Discover sustainable products that help reduce your carbon footprint and
              earn eco points with every purchase.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isAuthenticated && (
              <>
                <Button
                  variant={showOnlyMine ? "default" : "outline"}
                  onClick={() => setShowOnlyMine(!showOnlyMine)}
                >
                  {showOnlyMine ? "Showing: My Products" : "Show My Products"}
                </Button>

                <Button onClick={() => setShowAddModal(true)}>+ Add Product</Button>
              </>
            )}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-10">
              Loading products...
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={(p) => {
                      setEditingProduct(p);
                      setShowAddModal(true);
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-lg text-muted-foreground">No products found.</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setShowOnlyMine(false);
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <AddProductModal
        open={showAddModal}
        onOpenChange={handleCloseModal}
        onSave={async (data) => {
          if (!user) return;
          if (editingProduct) {
            await updateProduct(editingProduct.id, { ...data });
          } else {
            await addProduct({
              ...data,
              createdBy: user.id,
              seller: user.name || "Anonymous",
            });
          }
          handleCloseModal();
        }}
        initialData={editingProduct || undefined}
      />
    </div>
  );
};

export default Marketplace;
