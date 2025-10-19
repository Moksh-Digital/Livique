import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useProducts } from "@/contexts/ProductsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    originalPrice: 0,
    category: "",
    image: "🎁",
    description: "",
    delivery: "Today",
  });

  // ✅ Prevents infinite redirects and handles role check safely
  useEffect(() => {
    if (!user) return;
    if (user.role !== "admin") navigate("/");
  }, [user, navigate]);

  const handleDelete = (id: string) => {
    deleteProduct(id.toString());
    toast({ title: "Product deleted successfully" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = `${Math.round(
      (1 - formData.price / formData.originalPrice) * 100
    )}% OFF`;

if (editingProduct?.id != null) {
  // safely check if editingProduct exists and has id
  updateProduct(editingProduct.id, {
    ...formData,
    discount,
    rating: 4.8,
    reviews: 100,
  });
  toast({ title: "Product updated successfully" });
} else {
  addProduct({
    ...formData,
    id: Date.now().toString(), // ✅ convert number to string
    discount,
    rating: 4.8,
    reviews: 100,
    subcategory: "", // set default or from formData if you have it
    inStock: true ,
  });
  toast({ title: "Product added successfully" });
}


    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      price: 0,
      originalPrice: 0,
      category: "",
      image: "🎁",
      description: "",
      delivery: "Today",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-accent"
          >
            <Gift className="h-6 w-6" />
            <span>Livique Admin</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                View Store
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Tab List */}
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: <Package />, label: "Total Products", value: products.length },
                { icon: <ShoppingBag />, label: "Total Orders", value: 1247 },
                { icon: <Users />, label: "Total Users", value: 3456 },
                { icon: <BarChart3 />, label: "Revenue", value: "₹2.4L" },
              ].map((item, i) => (
                <Card key={i} className="p-6 rounded-2xl">
                  <div className="flex items-center justify-between mb-4 text-primary text-xl">
                    {item.icon}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-3xl font-bold">{item.value}</p>
                </Card>
              ))}
            </div>

            <Card className="p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div
                    key={order}
                    className="flex items-center justify-between p-4 border rounded-xl"
                  >
                    <div>
                      <p className="font-semibold">Order #{1000 + order}</p>
                      <p className="text-sm text-muted-foreground">Customer Name</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹ 1,449</p>
                      <p className="text-sm text-success">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Products</h2>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-2 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setEditingProduct(null);
                      setFormData({
                        name: "",
                        price: 0,
                        originalPrice: 0,
                        category: "",
                        image: "🎁",
                        description: "",
                        delivery: "Today",
                      });
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? "Edit Product" : "Add Product"}
                    </DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      ["Name", "name"],
                      ["Price", "price"],
                      ["Original Price", "originalPrice"],
                      ["Category", "category"],
                      ["Description", "description"],
                    ].map(([label, key]) => (
                      <div key={key}>
                        <Label>{label}</Label>
                        <Input
                          type={
                            key === "price" || key === "originalPrice"
                              ? "number"
                              : "text"
                          }
                          value={(formData as any)[key]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [key]:
                                key === "price" || key === "originalPrice"
                                  ? Number(e.target.value)
                                  : e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    ))}
                    <Button type="submit" className="w-full">
                      Save
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="p-6 rounded-2xl">
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 border rounded-xl"
                  >
                    <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center">
                      <span className="text-3xl">{product.image}</span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.category}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        ₹ {product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingProduct(product);
                          setFormData({
                            name: product.name,
                            price: product.price,
                            originalPrice: product.originalPrice,
                            category: product.category,
                            image: product.image,
                            description: product.description,
                            delivery: product.delivery,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
<Button
  variant="outline"
  size="icon"
  className="text-destructive"
  onClick={() => handleDelete(product.id.toString())} // ✅ convert to string
>
  <Trash2 className="h-4 w-4" />
</Button>

                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
            <Card className="p-6 rounded-2xl">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div
                    key={order}
                    className="p-4 border rounded-xl flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Order #{1000 + order}</p>
                      <p className="text-success text-sm">Delivered</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      John Doe — ₹1,449 — 12 Oct 2025
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <h2 className="text-2xl font-bold mb-6">Users Management</h2>
            <Card className="p-6 rounded-2xl">
              {[1, 2, 3].map((user) => (
                <div
                  key={user}
                  className="flex items-center justify-between p-4 border rounded-xl mb-3"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Customer {user}</p>
                      <p className="text-sm text-muted-foreground">
                        customer{user}@email.com
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    Orders: {Math.floor(Math.random() * 10) + 1}
                  </p>
                </div>
              ))}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
