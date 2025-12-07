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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProducts } from "@/contexts/ProductsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/data/categories";
// import { useOrders } from "@/contexts/OrdersContext";
import { Order, useOrders } from "../contexts/OrdersContext";
import axios from "axios";


async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // Replace this with your actual login logic
  // Example: checking hardcoded admin credentials
  if (email === "admin@example.com" && password === "admin123") {
    return { success: true, user: { email } };
  } else {
    throw new Error("Invalid credentials");
  }
}


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
  const { user, signOut, loading, signIn , isAdmin} = useAuth(); // ✅ Added signIn function and loading state
  const { setProducts } = useProducts(); // ✅ get the new setter
  // const { orders, setOrders } = useOrders();
  const [orders, setOrders] = useState<Order[]>([]); // never undefined
  const [users, setUsers] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const { signInAdmin } = useAuth();





  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStock, setIsTogglingStock] = useState<string | null>(null);
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
    inStock: true,
  });

  

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/products");
  //       const data = await res.json();
  //       if (res.ok) {
  //         // Assuming addProduct pushes into context/state
  //         // You might want to create a setProducts() in context instead
  //         data.forEach((p: any) => addProduct({ ...p, id: p._id }));
  //       } else {
  //         console.error("Failed to fetch products:", data.message);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching products:", err);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

 
 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setProducts(data.map(p => ({ ...p, id: p._id })));
      }
    } catch (err) {
      console.error(err);
    }
  };
  fetchProducts();
}, [setProducts]);


 
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users");
      setUsers(data); // data should be array of user objects
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };
  fetchUsers();
}, []);



  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await fetch("http://localhost:5000/api/products");
  //       const data = await res.json();

  //       if (res.ok && Array.isArray(data)) {
  //         // ✅ map MongoDB _id to frontend id once
  //         const mappedProducts = data.map((p: any) => ({
  //           ...p,
  //           id: p._id,
  //         }));

  //         // ✅ overwrite all products — no duplicates ever
  //         setProducts(mappedProducts);
  //       } else {
  //         console.error("Failed to fetch products:", data?.message || data);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching products:", err);
  //     }
  //   };

  //   fetchProducts();
  // }, [setProducts]);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders");
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          // ✅ map MongoDB _id if needed
          const formattedOrders = data.map((order: any) => ({
            ...order,
            _id: order._id,
          }));

          setOrders(formattedOrders);
        } else {
          console.error("Failed to fetch orders:", data.message || data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [setOrders]);

  // Migrate existing products to add inStock field if missing
  useEffect(() => {
    const migrateProducts = async () => {
      try {
        await axios.post('http://localhost:5000/api/products/migrate/add-stock-field');
        console.log("Product migration completed");
      } catch (error) {
        console.error("Migration error (non-critical):", error);
      }
    };
    
    migrateProducts();
  }, []);

  // State for the INLINE LOGIN FORM
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);


  const formattedRevenue = totalRevenue.toLocaleString("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});



  // No longer needed if we rely purely on the user/role check below
  // useEffect(() => {
  //   if (!user) return;
  //   if (user.role !== "admin") navigate("/");
  // }, [user, navigate]);

  

const handleLoginSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (loginEmail === "admin@shop.com" && loginPassword === "admin123") {
      signInAdmin(); // ✅ handles state + localStorage
      toast({
        title: "Welcome back!",
        description: "You are logged in as admin.",
      });

      // Navigate to admin dashboard
      navigate("/"); // <-- put your admin route here
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error: any) {
    toast({
      title: "Login Failed",
      description: error.message || "Invalid email or password.",
      variant: "destructive",
    });
  }
};


  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${productToDelete}`);
      if (response.status === 200) {
        deleteProduct(productToDelete);
        toast({ title: "Product deleted successfully" });
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({ 
        title: "Error deleting product", 
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleQuickToggleStock = async (product: any) => {
    setIsTogglingStock(product.id);
    try {
      const newStockStatus = !(product.inStock ?? true);
      const response = await axios.put(`http://localhost:5000/api/products/${product.id}`, {
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        category: product.category,
        categorySlug: (product as any).categorySlug || product.category,
        subcategory: product.subcategory,
        subcategorySlug: (product as any).subcategorySlug || product.subcategory,
        mainImage: (product as any).mainImage || product.image,
        images: (product as any).images || [product.image],
        description: product.description,
        delivery: product.delivery,
        deliveryCharge: (product as any).deliveryCharge || 0,
        discount: product.discount,
        rating: product.rating,
        reviews: product.reviews,
        inStock: newStockStatus,
      });

      if (response.status === 200) {
        updateProduct(product.id, { ...product, inStock: newStockStatus });
        toast({ 
          title: newStockStatus ? "Product In Stock" : "Product Out of Stock",
          description: newStockStatus ? "Product is now available" : "Product is now unavailable"
        });
      }
    } catch (error) {
      console.error("Error updating stock status:", error);
      toast({ 
        title: "Error updating stock status", 
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsTogglingStock(null);
    }
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
      inStock: formData.inStock,
    };

    // --- API Call Logic (The new part) ---
    if (editingProduct?.id != null) {
      // If editing an existing product
      try {
        const res = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to update product.');
        }

        // Update the product in context
        updateProduct(editingProduct.id, payload);
        toast({ title: "Product updated successfully!" });
      } catch (error: any) {
        console.error("Product update failed:", error);
        toast({
          title: "Update Failed",
          description: error.message || "Could not connect to the backend.",
          variant: "destructive"
        });
        return; // Stop execution on failure
      }
    } else {
      // 🚀 New Product Creation API Call
      try {
        const res = await fetch('http://localhost:5000/api/products', {
          method: 'POST',
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
      inStock: true,
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
  if (!isAdmin) {
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
                { icon: <ShoppingBag />, label: "Total Orders", value: orders.length },
                { icon: <Users />, label: "Total Users", value: users.length },
{ icon: <BarChart3 />, label: "Revenue", value: formattedRevenue },
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
                {orders.length === 0 ? (
                  <p className="text-muted-foreground">No recent orders available.</p>
                ) : (
                  orders
                    .slice(0, 5) // Show only last 5 orders
                    .map((order) => (
                      <div
                        key={order._id}
                        className="p-4 border rounded-xl flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition-shadow"
                      >
                        {/* Left: Order & Customer Info */}
                        <div>
                          <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.user?.name || "Customer"} ({order.user?.email || "No Email"})
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {order.address.fullName}, {order.address.street}, {order.address.city}
                          </p>
                        </div>

                        {/* Middle: Items */}
                        <div className="text-sm text-gray-700">
                          {order.items.map((item) => (
                            <p key={item.id}>
                              {item.name} × {item.quantity} = ₹{item.price * item.quantity}
                            </p>
                          ))}
                        </div>

                        {/* Right: Total & Status */}
                        <div className="text-right">
                          <p className="font-semibold text-lg">₹{order.total.toLocaleString()}</p>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${order.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                )}
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
                        inStock: true,
                      });
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Product
                  </Button>
                </DialogTrigger>

<DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
  <DialogHeader className="p-6 pb-0">
    <DialogTitle className="text-2xl font-extrabold text-accent flex items-center gap-2">
      {editingProduct ? <Edit className="h-6 w-6" /> : <Plus className="h-6 w-6" />} 
      {editingProduct ? "Edit Product Listing" : "Create New Product"}
    </DialogTitle>
    <p className="text-sm text-muted-foreground">Fill out the details below to add or update a product in your store catalog.</p>
  </DialogHeader>

  <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-8">

    {/* --- 1. General Info & Categorization --- */}
    <Card className="p-6 border-l-4 border-primary/70 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">General Information</h3>
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Product Name */}
        <div>
          <Label htmlFor="product-name" className="text-sm font-semibold text-gray-600">Product Name *</Label>
          <Input
            id="product-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., Ultra-Soft Memory Foam Pillow"
            className="mt-1"
          />
        </div>

        {/* Category Select */}
        <div>
          <Label htmlFor="category-select" className="text-sm font-semibold text-gray-600">Category *</Label>
          <select
            id="category-select"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
                subcategory: "", // reset subcategory
              })
            }
            required
            className="w-full px-3 py-2 border rounded-lg h-10 bg-background mt-1 focus:ring-2 focus:ring-accent"
          >
            <option value="" disabled>--- Select Primary Category ---</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.slug} value={opt.slug}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory select (conditional) */}
        {(() => {
          const selCat = CATEGORY_OPTIONS.find(c => c.slug === formData.category);
          if (!selCat || selCat.subcategories.length === 0) return null;
          return (
            <div className="md:col-span-2">
              <Label htmlFor="subcategory-select" className="text-sm font-semibold text-gray-600">Subcategory</Label>
              <select
                id="subcategory-select"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg h-10 bg-background mt-1 focus:ring-2 focus:ring-accent"
              >
                <option value="" disabled>--- Select Secondary Category ---</option>
                {selCat.subcategories.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })()}

        {/* Product Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description-input" className="text-sm font-semibold text-gray-600">Product Description *</Label>
          <textarea
            id="description-input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded-lg bg-background resize-none mt-1 focus:ring-2 focus:ring-accent"
            placeholder="A detailed description of the product features, materials, and benefits. Minimum 50 characters."
          />
        </div>
      </div>
    </Card>

    {/* --- 2. Pricing & Logistics --- */}
    <Card className="p-6 border-l-4 border-accent/70 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">Pricing & Logistics</h3>
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Price */}
        <div>
          <Label htmlFor="price-input" className="text-sm font-semibold text-gray-600">Selling Price (₹) *</Label>
          <Input
            id="price-input"
            type="number"
            min="1"
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
            placeholder="599"
            className="mt-1"
          />
        </div>
        
        {/* Original Price */}
        <div>
          <Label htmlFor="original-price-input" className="text-sm font-semibold text-gray-600">Original Price (₹)</Label>
          <Input
            id="original-price-input"
            type="number"
            min="1"
            value={formData.originalPrice || ""}
            onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
            placeholder="999 (for discount calculation)"
            className="mt-1"
            required
          />
        </div>
        
        {/* Delivery Charge */}
        <div>
          <Label htmlFor="delivery-charge-input" className="text-sm font-semibold text-gray-600">Delivery Charge (₹)</Label>
          <Input
            id="delivery-charge-input"
            type="number"
            value={formData.deliveryCharge || ""}
            onChange={(e) => setFormData({ ...formData, deliveryCharge: Number(e.target.value) })}
            placeholder="0 for free delivery"
            min="0"
            className="mt-1"
          />
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <Label htmlFor="in-stock" className="text-sm font-semibold text-gray-600 cursor-pointer">
            In Stock
          </Label>
          <Switch
            id="in-stock"
            checked={formData.inStock}
            onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
          />
        </div>
      </div>
    </Card>

    {/* --- 3. Media Upload --- */}
    <Card className="p-6 border-l-4 border-blue-500/70 shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-700">Product Media</h3>

      {/* Main Image */}
      <div className="mb-8 p-4 border rounded-xl bg-blue-50/50">
        <Label className="block mb-3 font-bold text-blue-700 flex items-center gap-1">
            Main Image (Required) 🖼️
        </Label>
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          
          <div className="w-full sm:flex-1 space-y-3">
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const dataUrl = await readFileAsDataUrl(file);
                setFormData({ ...formData, mainImage: dataUrl });
              }}
            />
            <Input
              placeholder="Or paste image URL"
              value={formData.mainImage}
              onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
            />
          </div>
          
          {/* Main Image Preview - Large and Rounded */}
          <div className="shrink-0">
            {formData.mainImage ? (
              (((formData.mainImage as string).startsWith("data:") ||
                (formData.mainImage as string).startsWith("http")) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.mainImage}
                  alt="main-preview"
                  className="w-32 h-32 object-cover rounded-2xl border-4 border-blue-300 shadow-xl transition-transform hover:scale-[1.02]"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center text-5xl bg-blue-100 rounded-2xl border-4 border-blue-300">
                  {formData.mainImage}
                </div>
              ))
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-400 border-4 border-dashed border-gray-300">
                <Package className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Images (Multiple) */}
      <div>
        <Label className="block mb-3 font-bold text-gray-700">Gallery Images (Optional)</Label>
        <div className="space-y-3">
          
          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            multiple
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;
              const dataUrls = await Promise.all(files.map(f => readFileAsDataUrl(f)));
              setFormData({ ...formData, images: [...(formData.images || []), ...dataUrls] });
            }}
          />

          {/* URL Input with Add Button */}
          <div className="flex gap-2">
            <Input
              placeholder="Paste image URL and click 'Add to Gallery'"
              id="gallery-url-input"
            />
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={() => {
                const el = document.getElementById("gallery-url-input") as HTMLInputElement | null;
                const url = el?.value?.trim();
                if (!url) return;
                setFormData({ ...formData, images: [...(formData.images || []), url] });
                if (el) el.value = "";
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add to Gallery
            </Button>
          </div>
          
          {/* Gallery Image Previews - Interactive */}
          <div className="flex gap-4 mt-4 flex-wrap p-2 rounded-lg border border-dashed border-gray-200 min-h-[50px]">
            {(formData.images || []).filter(src => src !== formData.mainImage).map((src: string, idx: number) => (
              <div key={idx} className="relative group">
                <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex items-center justify-center border-2 border-gray-300 hover:border-red-500 transition-all">
                  {src.startsWith('data:') || src.startsWith('http') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt={`gallery-img-${idx}`} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-xl">{src}</span>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => setFormData({ ...formData, images: (formData.images || []).filter((_, i) => i !== idx) })}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {/* Placeholder for empty gallery */}
            {(formData.images || []).filter(src => src !== formData.mainImage).length === 0 && (
                <p className="text-sm text-gray-400 p-4">Add 1-4 more images for the product gallery.</p>
            )}
          </div>
        </div>
      </div>
    </Card>

    {/* --- Submit Button (Stays prominent) --- */}
    <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all">
      {editingProduct ? "💾 Update Product Listing" : "🚀 Publish New Product"}
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
                      <div className="mt-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${(product as any).inStock ?? true ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {(product as any).inStock ?? true ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>
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
                            inStock: (product as any).inStock ?? true,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={isTogglingStock === product.id ? "opacity-50" : (product as any).inStock ?? true ? "text-green-600 border-green-600 hover:bg-green-50" : "text-orange-600 border-orange-600 hover:bg-orange-50"}
                        onClick={() => handleQuickToggleStock(product)}
                        disabled={isTogglingStock === product.id}
                        title={(product as any).inStock ?? true ? "In Stock - Click to mark Out of Stock" : "Out of Stock - Click to mark In Stock"}
                      >
                        {(product as any).inStock ?? true ? "✓" : "✕"}
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
              {orders.length === 0 ? (
                <p className="text-muted-foreground">No orders found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h2 className="text-lg font-semibold">{order.user?.name || 'Unknown User'}</h2>
                          <p className="text-sm text-gray-500">{order.user?.email || 'No Email'}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="mb-4">
                        <h3 className="font-semibold mb-2">Items:</h3>
                        <ul className="text-sm text-gray-700">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between mb-1">
                              <span>{item.name} × {item.quantity}</span>
                              <span>₹{item.price * item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Address */}
                      <div className="mb-4 text-sm text-gray-700">
                        <p className="font-semibold mb-1">Shipping Address:</p>
                        <p>
                          {order.address.fullName}, {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipCode}
                        </p>
                        <p>Mobile: {order.address.mobile}</p>
                      </div>

                      {/* Payment */}
                      <div className="text-sm text-gray-700 border-t pt-2 flex justify-between">
                        <p>Payment: {order.paymentMethod}</p>
                        <p className="font-semibold">Total: ₹{order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>

              )}
            </Card>
          </TabsContent>



          {/* Users */}
<TabsContent value="users">
  <h2 className="text-2xl font-bold mb-6">Users Management</h2>
  <Card className="p-6 rounded-2xl">
    {users.length === 0 ? (
      <p className="text-muted-foreground">No users found.</p>
    ) : (
      users.map((user: any) => {
        // Count how many orders this user has
        const userOrderCount = orders.filter(
          (o) => o.user && o.user._id.toString() === user._id.toString()
        ).length;

        return (
          <div
            key={user._id}
            className="flex items-center justify-between p-4 border rounded-xl mb-3"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{user.name || "Customer"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <p className="text-sm font-semibold">
              Orders: {userOrderCount}
            </p>
          </div>
        );
      })
    )}
  </Card>
</TabsContent>


        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone and the product will be permanently removed from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;