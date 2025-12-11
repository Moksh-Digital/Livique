// src/pages/Category.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Filter, ShoppingCart, Home, Search, User, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "@/components/Header";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getCategoryBySlug } from "@/data/categories";
import { useCart } from "@/contexts/CartContext";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  mainImage?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";
const API_BASE_URL = isLocalhost ? "http://localhost:5000/api" : "https://api.livique.co.in/api";

const Category = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // useCart context - destructured names you said you have
  // We will handle if any of these are undefined (defensive)
  const { cart, addToCart, removeFromCart, updateQuantity, getTotalItems } = useCart() as any || {};

  // ensure we have an array to work with
  const cartItems = Array.isArray(cart) ? cart : [];

  const currentCategory = getCategoryBySlug(category || "");
  let breadcrumb = "All Products";
  if (subcategory) {
    breadcrumb = subcategory
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  } else if (category) {
    breadcrumb = currentCategory?.name || category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = `${API_BASE_URL}/products`;
        if (subcategory) url += `?category=${category}&subcategory=${subcategory}`;
        else if (category) url += `?category=${category}`;

        const { data } = await axios.get(url);
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, subcategory]);

  // Filters applied on client
  const displayProducts = products.filter((product) => {
    const priceMatch = (product.price ?? 0) >= priceRange[0] && (product.price ?? 0) <= priceRange[1];
    const ratingMatch = selectedRatings.length === 0 || selectedRatings.some((r) => (product.rating ?? 0) >= r);
    return priceMatch && ratingMatch;
  });

  const FilterSidebar = () => (
    <div className="space-y-6">
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm">Subcategories</h3>
          <div className="space-y-2">
            {currentCategory.subcategories.map((sub: any) => (
              <Link
                key={sub.slug}
                to={`/category/${currentCategory.slug}/${sub.slug}`}
                className={`block text-sm py-1 hover:text-primary ${
                  subcategory === sub.slug ? "text-primary font-semibold" : ""
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
        <div className="px-2">
          <Slider
            min={0}
            max={300000}
            step={100}
            value={priceRange}
            onValueChange={(val: any) => setPriceRange(val)}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-sm">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={(checked) => {
                  if (checked) setSelectedRatings([...selectedRatings, rating]);
                  else setSelectedRatings(selectedRatings.filter((r) => r !== rating));
                }}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm flex items-center gap-1 cursor-pointer">
                <span>{rating}</span>
                <Star className="h-3 w-3 fill-green-600 text-green-600" />
                <span className="text-muted-foreground">& Up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-[#8B7355] font-medium">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 bg-[#FFF8F0]">
        {error}
      </div>
    );
  }

  // helper to get quantity in cart (robust to item.id or item._id)
  const getQuantity = (productId: string) => {
    const item = cartItems.find((i: any) => (i && (i.id === productId || i._id === productId)));
    return item ? (item.quantity ?? 0) : 0;
  };

  // Add to cart - defensive
  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    if (typeof addToCart === "function") {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage || product.images?.[0] || "/placeholder.svg",
        quantity: 1,
        delivery: "Standard",
      });
    } else {
      // fallback: if addToCart isn't available, try updateQuantity or push into cart array (best-effort)
      console.warn("addToCart not available in useCart context");
    }
  };

  // increment (defensive)
  const handleIncrement = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    const current = getQuantity(product._id);
    if (typeof updateQuantity === "function") {
      updateQuantity(product._id, current + 1);
    } else if (typeof addToCart === "function") {
      // fallback: call addToCart to add another
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage || product.images?.[0] || "/placeholder.svg",
        quantity: 1,
      });
    } else {
      console.warn("no updateQuantity or addToCart available");
    }
  };

  // decrement (defensive)
  const handleDecrement = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    e.preventDefault();
    const current = getQuantity(product._id);
    if (current <= 1) {
      if (typeof removeFromCart === "function") {
        // remove by id (support both id/_id)
        removeFromCart(product._id);
      } else if (typeof updateQuantity === "function") {
        updateQuantity(product._id, 0);
      } else {
        console.warn("no removeFromCart/updateQuantity available");
      }
    } else {
      if (typeof updateQuantity === "function") {
        updateQuantity(product._id, current - 1);
      } else {
        console.warn("updateQuantity not available to decrement");
      }
    }
  };

  // discount percent helper
  const discountPercent = (orig?: number, cur?: number) => {
    if (!orig || !cur || orig <= cur) return null;
    return Math.round(((orig - cur) / orig) * 100);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      {/* announcement is in Header - don't duplicate */}
      <Header />

      <main className="pb-28 max-w-[420px] mx-auto px-3">
        <div className="flex items-center justify-between mt-4 mb-2">
          <div>
            <h1 className="text-lg font-semibold text-[#5d4037]">{breadcrumb === "All Products" ? "Gift Items" : breadcrumb}</h1>
            <div className="text-xs text-[#8B7355]">Showing {displayProducts.length} Products</div>
          </div>

          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-md shadow-sm text-sm">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <div className="p-4">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <section className="grid grid-cols-2 gap-3">
          {displayProducts.map((p) => {
            const qty = getQuantity(p._id);
            const isOOS = p.inStock === false;
            return (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") navigate(`/product/${p._id}`); }}
                className={`relative bg-white rounded-lg border border-[#f0e6e2] shadow-sm overflow-hidden ${isOOS ? "opacity-75" : ""}`}
              >
                {/* Out of stock overlay */}
                {isOOS && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/40 text-white px-3 py-1 rounded-md font-semibold">Out of Stock</div>
                  </div>
                )}

                <div className="bg-white p-3 flex items-center justify-center aspect-square">
                  <img
                    src={p.mainImage || p.images?.[0] || "/placeholder.svg"}
                    alt={p.name}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                  />
                </div>

                <div className="px-3 py-2">
                  <h3 className="text-sm font-medium text-[#2b2b2b] line-clamp-2 mb-1">{p.name}</h3>

                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="text-sm font-semibold text-[#2b2b2b]">{(p.rating ?? 0).toFixed(1)}</span>
                    <Star size={14} className="fill-green-600 text-green-600" />
                    <span className="text-xs text-[#6b6b6b]">({p.reviews ?? 0})</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-base font-bold text-[#172021]">₹{p.price?.toLocaleString()}</div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="text-xs text-[#8B7355] line-through">₹{p.originalPrice?.toLocaleString()}</div>
                      )}
                      {discountPercent(p.originalPrice, p.price) && (
                        <div className="text-xs text-[#8B7355]">{discountPercent(p.originalPrice, p.price)}% off</div>
                      )}
                    </div>

                    {/* Add or quantity controls; disabled when out of stock */}
                    {isOOS ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-400 border border-[#eee] bg-[#fff]">
                        <ShoppingCart className="w-4 h-4" />
                        <span>Unavailable</span>
                      </div>
                    ) : qty > 0 ? (
                      <div className="flex items-center gap-2 bg-white border border-[#e9e2de] rounded-md shadow-sm px-2 py-1">
                        <button
                          onClick={(e) => handleDecrement(e, p)}
                          className="p-1 rounded disabled:opacity-50"
                          aria-label="Decrease quantity"
                          title="Decrease"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="px-2 text-sm font-medium">{qty}</div>
                        <button
                          onClick={(e) => handleIncrement(e, p)}
                          className="p-1 rounded"
                          aria-label="Increase quantity"
                          title="Increase"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleAdd(e, p)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e9e2de] rounded-md shadow-sm text-sm hover:shadow-md"
                        aria-label={`Add ${p.name} to cart`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {displayProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#8B7355]">No products found matching your filters</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Category;
