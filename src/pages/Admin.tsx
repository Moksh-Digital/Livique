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
  LogIn,
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
import { CATEGORIES } from "@/data/categories";

// Build category / subcategory options dynamically from CATEGORIES
const CATEGORY_OPTIONS = CATEGORIES.map(cat => ({
  label: cat.name,
  slug: cat.slug,
  subcategories: (cat.subcategories || []).map(sub => ({ label: sub.name, slug: sub.slug }))
}));
// i have added this
const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user, signOut, loading, signIn } = useAuth(); // ✅ Added signIn function and loading state

  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    originalPrice: 0,
    category: "",
    subcategory: "",
    image: "🎁",
    mainImage: "",
    images: [] as string[],
    description: "",
    delivery: "Today",
    deliveryCharge: 0, 
  });

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (res.ok) {
        // Assuming addProduct pushes into context/state
        // You might want to create a setProducts() in context instead
        data.forEach((p: any) => addProduct({ ...p, id: p._id }));
      } else {
        console.error("Failed to fetch products:", data.message);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  fetchProducts();
}, []);

  
  // State for the INLINE LOGIN FORM
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  // No longer needed if we rely purely on the user/role check below
  // useEffect(() => {
  //   if (!user) return;
  //   if (user.role !== "admin") navigate("/");
  // }, [user, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        // 🚨 IMPORTANT: Replace this with your actual signIn function logic.
        // This is a placeholder that assumes your signIn function takes email/password.
        await signIn(loginEmail, loginPassword); 
        
        // Assuming signIn is successful and sets the user object in context.
        // The component will automatically re-render and show the dashboard.
        toast({ title: "Welcome back!", description: "You are logged in as admin." });

    } catch (error) {
        // Display an error message if login fails (e.g., wrong credentials)
        toast({ 
            title: "Login Failed", 
            description: "Invalid email or password. Only admins can access this panel.", 
            variant: "destructive" 
        });
    }
  };

  const handleDelete = (id: string) => {
    deleteProduct(id.toString());
    toast({ title: "Product deleted successfully" });
  };

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });

// Admin.tsx (inside the Admin component)
// ... (keep all your existing imports, states, and functions)

// ...
// IMPORTANT: Update your handleSubmit function
const handleSubmit = async (e: React.FormEvent) => { // Made it async
    e.preventDefault();
    
    // --- Data Preparation (Same as your original logic) ---
    const discount = `${Math.round(
        (1 - formData.price / formData.originalPrice) * 100
    )}% OFF`;

    const selectedCategory = CATEGORY_OPTIONS.find(c => c.slug === formData.category);
    const categoryName = selectedCategory ? selectedCategory.label : formData.category;
    const selectedSub = selectedCategory?.subcategories.find(s => s.slug === formData.subcategory);
    const subcategoryName = selectedSub ? selectedSub.label : formData.subcategory;
    
    // The payload for the API call
    const payload = {
        name: formData.name,
        price: formData.price,
        originalPrice: formData.originalPrice,
        category: categoryName, // Send the full category name
        categorySlug: formData.category, // Send the slug
        subcategory: subcategoryName, // Send the full subcategory name
        subcategorySlug: formData.subcategory, // Send the slug
        // Ensure mainImage is the first element of images for consistency, then flatten
        mainImage: formData.mainImage || formData.image,
        images: [
            formData.mainImage || formData.image,
            ...((formData.images || []) as string[]).filter(Boolean).filter(img => img !== (formData.mainImage || formData.image))
        ],
        description: formData.description,
        delivery: formData.delivery,
        // 🚀 NEW: Add deliveryCharge to payload
        deliveryCharge: formData.deliveryCharge, 
        discount, // Include calculated discount
        rating: 4.8,
        reviews: 100,
    };
    
    // --- API Call Logic (The new part) ---
    if (editingProduct?.id != null) {
        // If editing an existing product
        // 🚨 TODO: Implement PUT/PATCH API call for product update later
        updateProduct(editingProduct.id, payload);
        toast({ title: "Product updated successfully (Local only)" });
    } else {
        // 🚀 New Product Creation API Call
        try {
const res = await fetch('http://localhost:5000/api/products', {                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 🚨 TODO: Add Authorization header here once your authMiddleware is set up
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            
            if (!res.ok) {
                // Handle API errors (e.g., validation failed)
                throw new Error(data.message || 'Failed to add product.');
            }

            // Success: Add the newly created product (with MongoDB _id) to your context/state
            // Assuming your backend returns the created product with a MongoDB '_id'
            addProduct({
                ...data, // This 'data' object should contain the new product from MongoDB
                id: data._id, // Use the MongoDB _id as the local id
            });
            
            toast({ title: "Product added successfully!" });
            
        } catch (error: any) {
            console.error("Product upload failed:", error);
            toast({ 
                title: "Upload Failed", 
                description: error.message || "Could not connect to the backend.", 
                variant: "destructive" 
            });
            return; // Stop execution on failure
        }
    }


    

    // --- Cleanup Form (After successful submission) ---
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
        name: "",
        price: 0,
        originalPrice: 0,
        category: "",
        subcategory: "",
        image: "🎁",
        mainImage: "",
        images: [],
        description: "",
        delivery: "Today",
        deliveryCharge: 0,
    });
};

// ... (rest of the Admin component)

  // 1. Loading State Check
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl">Loading authentication data...</p>
        </div>
    );
  }

  // 2. Authorization Check: If not logged in OR logged in but not an admin, show the login form
  if (!user || user.role !== "admin") {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Card className="w-full max-w-md p-8 shadow-2xl rounded-xl">
                <div className="text-center mb-6">
                    <Gift className="h-10 w-10 text-accent mx-auto mb-2" />
                    <h1 className="text-3xl font-bold">Admin Login</h1>
                    <p className="text-muted-foreground">Enter credentials to access the Livique dashboard.</p>
                </div>
                
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full gap-2">
                        <LogIn className="h-5 w-5" /> Access Dashboard
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm text-accent hover:underline">
                        Go back to store
                    </Link>
                </div>
            </Card>
        </div>
    );
  }


  // 3. Render the full Admin Dashboard (only runs if user is authenticated and is admin)
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
                        subcategory: "",
                        image: "🎁",
                        mainImage: "",    // added
                        images: [],       // added
                        description: "",
                        delivery: "Today",
                        deliveryCharge: 0,
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

                    

                    {/* other inputs */}
                    {[
                      ["Name", "name"],
                      ["Price", "price"],
                      ["Original Price", "originalPrice"],
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
                    {/* Category select */}
                    <div>
                      <Label>Category</Label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                            // reset subcategory when category changes
                            subcategory: "",
                          })
                        }
                        required
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="">Select category</option>
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.slug} value={opt.slug}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
      <Label>Delivery Charge (₹)</Label>
      <Input
        type="number"
        value={formData.deliveryCharge}
        onChange={(e) =>
          setFormData({
            ...formData,
            deliveryCharge: Number(e.target.value), // Convert to number
          })
        }
        placeholder="0"
        min="0"
      />
    </div>

                    {/* Subcategory select (shown only if selected category has subcategories) */}
                    {(() => {
                      const selCat = CATEGORY_OPTIONS.find(c => c.slug === formData.category);
                      if (!selCat || selCat.subcategories.length === 0) return null;
                      return (
                        <div>
                          <Label>Subcategory</Label>
                          <select
                            value={formData.subcategory}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subcategory: e.target.value,
                              })
                            }
                            required
                            className="w-full px-3 py-2 border rounded"
                          >
                            <option value="">Select subcategory</option>
                            {selCat.subcategories.map((sub) => (
                              <option key={sub.slug} value={sub.slug}>
                                {sub.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })()}
                    {/* Main Image (file or url) */}
                    <div>
                      <Label>Main Image (file or URL)</Label>
                      <input
                        type="file"
                        accept="image/*"
                        className="block mb-2"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const dataUrl = await readFileAsDataUrl(file);
                          setFormData({ ...formData, mainImage: dataUrl });
                        }}
                      />
                      <Input
                        placeholder="Or paste image URL"
                        value={(formData as any).mainImage}
                        onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                      />
                      {/* preview */}
                      <div className="mt-2">
                        {(formData as any).mainImage ? (
                          (((formData as any).mainImage as string).startsWith("data:") ||
                          ((formData as any).mainImage as string).startsWith("http")) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={(formData as any).mainImage}
                              alt="main-preview"
                              className="w-24 h-24 object-cover rounded-md border"
                            />
                          ) : (
                            <div className="w-24 h-24 flex items-center justify-center text-4xl bg-muted rounded-md border">
                              {(formData as any).mainImage}
                            </div>
                          )
                        ) : null}
                      </div>
                    </div>

                    {/* Gallery images (multiple) */}
                    <div>
                      <Label>Gallery Images (files or URLs)</Label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="block mb-2"
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length === 0) return;
                          const dataUrls = await Promise.all(files.map(f => readFileAsDataUrl(f)));
                          setFormData({ ...formData, images: [...(formData.images || []), ...dataUrls] });
                        }}
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Paste image URL and press Add"
                          id="gallery-url-input"
                          // local uncontrolled input not required, simple inline handler below
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById("gallery-url-input") as HTMLInputElement | null;
                            const url = el?.value?.trim();
                            if (!url) return;
                            setFormData({ ...formData, images: [...(formData.images || []), url] });
                            if (el) el.value = "";
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      {/* show preview / remove */}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {(formData.images || []).map((src: string, idx: number) => (
                          <div key={idx} className="relative">
                            <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                              {src.startsWith('data:') || src.startsWith('http') ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={src} alt={`img-${idx}`} className="object-cover w-full h-full" />
                              ) : (
                                <span className="text-3xl">{src}</span>
                              )}
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute -top-2 -right-2"
                              onClick={() => setFormData({ ...formData, images: (formData.images || []).filter((_, i) => i !== idx) })}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
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
                    <div className="w-20 h-20 bg-muted rounded-xl flex items-center justify-center overflow-hidden">
                      {(((product as any).mainImage || (product as any).images?.[0] || product.image) as string).startsWith("data:") ||
                      (((product as any).mainImage || (product as any).images?.[0] || product.image) as string).startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={(product as any).mainImage || (product as any).images?.[0] || product.image}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-3xl">
                          {(product as any).mainImage || (product as any).images?.[0] || product.image}
                        </span>
                      )}
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
                            originalPrice: product.originalPrice ?? 0,
                            // use slug fields for form selects (fall back to existing label)
                            category: (product as any).categorySlug ?? product.category ?? "",
                            subcategory: (product as any).subcategorySlug ?? product.subcategory ?? "",
                            image: product.image,
                            mainImage: (product as any).mainImage ?? product.image,
                            images: (product as any).images ?? [(product as any).mainImage ?? product.image],
                            description: product.description,
                            delivery: product.delivery,
                            deliveryCharge: (product as any).deliveryCharge ?? 0,
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