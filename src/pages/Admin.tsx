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

// category / subcategory data (slugs precomputed)
const CATEGORY_OPTIONS = [
  { label: "Diwali Gifts", slug: "diwali-gifts", subcategories: [] },
  { label: "Birthday Gifts", slug: "birthday-gifts", subcategories: [] },
  { label: "Bhai Dooj", slug: "bhai-dooj", subcategories: [] },
  { label: "Flowers", slug: "flowers", subcategories: [] },
  { label: "Same Day", slug: "same-day", subcategories: [] },
  { label: "Hatke Gifts", slug: "hatke-gifts", subcategories: [] },
  { label: "Home Decor", slug: "home-decor", subcategories: [] },
  { label: "Anniversary", slug: "anniversary", subcategories: [] },
  { label: "Gift Hampers", slug: "gift-hampers", subcategories: [] },
  { label: "Sweets", slug: "sweets", subcategories: [] },
  { label: "Dry Fruits", slug: "dry-fruits", subcategories: [] },
  { label: "Chocolates", slug: "chocolates", subcategories: [] },
  { label: "Diyas", slug: "diyas", subcategories: [] },
  { label: "Cakes", slug: "cakes", subcategories: [] },
  { label: "Personalized", slug: "personalized", subcategories: [] },
  { label: "Experiences", slug: "experiences", subcategories: [] },

  // Electronics with subcategories
  {
    label: "Electronics",
    slug: "electronics",
    subcategories: [
      { label: "Mobile Phones", slug: "mobile-phones" },
      { label: "Laptops", slug: "laptops" },
      { label: "Tablets", slug: "tablets" },
      { label: "Televisions", slug: "televisions" },
      { label: "Cameras", slug: "cameras" },
      { label: "Headphones", slug: "headphones" },
      { label: "Speakers", slug: "speakers" },
      { label: "Smart Watches", slug: "smart-watches" },
      { label: "Power Banks", slug: "power-banks" },
      { label: "Gaming Consoles", slug: "gaming-consoles" },
    ],
  },

  // Fashion
  {
    label: "Fashion",
    slug: "fashion",
    subcategories: [
      { label: "Men Clothing", slug: "men-clothing" },
      { label: "Women Clothing", slug: "women-clothing" },
      { label: "Kids Clothing", slug: "kids-clothing" },
      { label: "Men Footwear", slug: "men-footwear" },
      { label: "Women Footwear", slug: "women-footwear" },
      { label: "Watches", slug: "watches" },
      { label: "Sunglasses", slug: "sunglasses" },
      { label: "Bags & Luggage", slug: "bags-luggage" },
      { label: "Jewellery", slug: "jewellery" },
      { label: "Accessories", slug: "accessories" },
    ],
  },

  // Home and furniture
  {
    label: "Home and furniture",
    slug: "home-furniture",
    subcategories: [
      { label: "Furniture", slug: "furniture" },
      { label: "Home Decor", slug: "home-decor-f" },
      { label: "Kitchen & Dining", slug: "kitchen-dining" },
      { label: "Bed & Bath", slug: "bed-bath" },
      { label: "Garden & Outdoor", slug: "garden-outdoor" },
      { label: "Home Improvement", slug: "home-improvement" },
      { label: "Lighting", slug: "lighting" },
      { label: "Storage", slug: "storage" },
    ],
  },

  // Beauty and personal care
  {
    label: "Beauty and personal care",
    slug: "beauty-personal-care",
    subcategories: [
      { label: "Makeup", slug: "makeup" },
      { label: "Skin Care", slug: "skin-care" },
      { label: "Hair Care", slug: "hair-care" },
      { label: "Fragrances", slug: "fragrances" },
      { label: "Bath & Body", slug: "bath-body" },
      { label: "Men Grooming", slug: "men-grooming" },
      { label: "Beauty Tools", slug: "beauty-tools" },
    ],
  },

  // Books and stationary
  {
    label: "Books and stationary",
    slug: "books-stationery",
    subcategories: [
      { label: "Books", slug: "books" },
      { label: "Pens", slug: "pens" },
      { label: "Pencils", slug: "pencils" },
      { label: "Notebooks", slug: "notebooks" },
      { label: "Sketch Books", slug: "sketch-books" },
      { label: "Erasers", slug: "erasers" },
      { label: "School Supplies", slug: "school-supplies" },
      { label: "Art Supplies", slug: "art-supplies" },
      { label: "Office Supplies", slug: "office-supplies" },
    ],
  },

  // Sports and fitness
  {
    label: "Sports and fitness",
    slug: "sports-fitness",
    subcategories: [
      { label: "Exercise Equipment", slug: "exercise-equipment" },
      { label: "Yoga", slug: "yoga" },
      { label: "Sports Shoes", slug: "sports-shoes" },
      { label: "Cricket", slug: "cricket" },
      { label: "Football", slug: "football" },
      { label: "Badminton", slug: "badminton" },
      { label: "Swimming", slug: "swimming" },
      { label: "Cycling", slug: "cycling" },
    ],
  },

  // Toys & baby products
  {
    label: "Toys & baby products",
    slug: "toys-baby-products",
    subcategories: [
      { label: "Toys", slug: "toys" },
      { label: "Baby Care", slug: "baby-care" },
      { label: "Baby Fashion", slug: "baby-fashion" },
      { label: "Diapers", slug: "diapers" },
      { label: "Baby Feeding", slug: "baby-feeding" },
      { label: "Baby Gear", slug: "baby-gear" },
    ],
  },

  // Grocery and food
  {
    label: "Grocery and food",
    slug: "grocery-food",
    subcategories: [
      { label: "Fruits & Vegetables", slug: "fruits-vegetables" },
      { label: "Dairy Products", slug: "dairy-products" },
      { label: "Beverages", slug: "beverages" },
      { label: "Snacks", slug: "snacks" },
      { label: "Cooking Essentials", slug: "cooking-essentials" },
      { label: "Organic", slug: "organic" },
    ],
  },

  // Appliances
  {
    label: "Appliances",
    slug: "appliances",
    subcategories: [
      { label: "Air Conditioners", slug: "air-conditioners" },
      { label: "Refrigerators", slug: "refrigerators" },
      { label: "Washing Machines", slug: "washing-machines" },
      { label: "Microwave Ovens", slug: "microwave-ovens" },
      { label: "Vacuum Cleaners", slug: "vacuum-cleaners" },
      { label: "Kitchen Appliances", slug: "kitchen-appliances" },
    ],
  },
];

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
    // store slugs for routing; readable names will be resolved on submit
    category: "",
    subcategory: "",
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

    // resolve readable names from slugs (fallback to raw slug)
    const selectedCategory = CATEGORY_OPTIONS.find(c => c.slug === formData.category);
    const categoryName = selectedCategory ? selectedCategory.label : formData.category;
    const selectedSub = selectedCategory?.subcategories.find(s => s.slug === formData.subcategory);
    const subcategoryName = selectedSub ? selectedSub.label : formData.subcategory;

    const payload = {
      ...formData,
      category: categoryName,
      subcategory: subcategoryName,
      categorySlug: formData.category || undefined,
      subcategorySlug: formData.subcategory || undefined,
      discount,
      rating: 4.8,
      reviews: 100,
    };

    if (editingProduct?.id != null) {
      updateProduct(editingProduct.id, payload);
      toast({ title: "Product updated successfully" });
    } else {
      addProduct({
        ...payload,
        id: Date.now().toString(),
        inStock: true,
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
      subcategory: "",
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
                        subcategory: "",
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
                            originalPrice: product.originalPrice ?? 0,
                            // use slug fields for form selects (fall back to existing label)
                            category: (product as any).categorySlug ?? product.category ?? "",
                            subcategory: (product as any).subcategorySlug ?? product.subcategory ?? "",
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
