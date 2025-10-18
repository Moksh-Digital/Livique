import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Users, ShoppingBag, BarChart3, Plus, Edit, Trash2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProducts } from "@/contexts/ProductsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", price: 0, originalPrice: 0, category: "", image: "🎁", description: "", delivery: "Today"
  });

  if (user?.role !== 'admin') {
    navigate("/");
    return null;
  }

  const handleDelete = (id: number) => {
    deleteProduct(id);
    toast({ title: "Product deleted successfully" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = `${Math.round((1 - formData.price / formData.originalPrice) * 100)}% OFF`;
    
    if (editingProduct) {
      updateProduct(editingProduct.id, { ...formData, discount, rating: 4.8, reviews: 100 });
      toast({ title: "Product updated successfully" });
    } else {
      addProduct({ ...formData, discount, rating: 4.8, reviews: 100 });
      toast({ title: "Product added successfully" });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({ name: "", price: 0, originalPrice: 0, category: "", image: "🎁", description: "", delivery: "Today" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b bg-card">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-accent">
              <Gift className="h-6 w-6" />
              <span>fnp Admin</span>
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
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Products</p>
                <p className="text-3xl font-bold">660</p>
              </Card>

              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingBag className="h-8 w-8 text-secondary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl font-bold">1,247</p>
              </Card>

              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <p className="text-3xl font-bold">3,456</p>
              </Card>

              <Card className="p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-8 w-8 text-success" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                <p className="text-3xl font-bold">₹2.4L</p>
              </Card>
            </div>

            <Card className="p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div key={order} className="flex items-center justify-between p-4 border rounded-xl">
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

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={() => { setEditingProduct(null); setFormData({ name: "", price: 0, originalPrice: 0, category: "", image: "🎁", description: "", delivery: "Today" }); }}>
                    <Plus className="h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div><Label>Name</Label><Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required /></div>
                    <div><Label>Price</Label><Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required /></div>
                    <div><Label>Original Price</Label><Input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: Number(e.target.value)})} required /></div>
                    <div><Label>Category</Label><Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required /></div>
                    <div><Label>Description</Label><Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required /></div>
                    <Button type="submit" className="w-full">Save</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="p-6 rounded-2xl">
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border rounded-xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl">{product.image}</span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">Category: {product.category}</p>
                      <p className="text-sm font-semibold mt-1">₹ {product.price}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => { setEditingProduct(product); setFormData({ name: product.name, price: product.price, originalPrice: product.originalPrice, category: product.category, image: product.image, description: product.description, delivery: product.delivery }); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="text-2xl font-bold mb-6">Orders Management</h2>

            <Card className="p-6 rounded-2xl">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div key={order} className="p-4 border rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold">Order #{1000 + order}</p>
                        <p className="text-sm text-muted-foreground">12 Oct 2025, 10:30 AM</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹ 1,449</p>
                        <span className="inline-block px-3 py-1 bg-success/10 text-success text-xs font-semibold rounded-full">
                          Delivered
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p><strong>Customer:</strong> John Doe</p>
                      <p><strong>Address:</strong> 140507, Mohali, Punjab</p>
                      <p><strong>Items:</strong> Festive Diwali Cushion N Ganesh Combo</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <h2 className="text-2xl font-bold mb-6">Users Management</h2>

            <Card className="p-6 rounded-2xl">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((user) => (
                  <div key={user} className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Customer {user}</p>
                        <p className="text-sm text-muted-foreground">customer{user}@email.com</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Orders: {Math.floor(Math.random() * 10) + 1}</p>
                      <p className="text-sm font-semibold">Total: ₹ {(Math.random() * 50000 + 5000).toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
