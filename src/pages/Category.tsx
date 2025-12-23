// src/pages/Category.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Filter, ShoppingCart, Gift } from "lucide-react";
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
  delivery?: string;
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

  // useCart context — defensive handling in case names differ
  const cartCtx: any = useCart() || {};
  const cart = Array.isArray(cartCtx.cart) ? cartCtx.cart : cartCtx.items || [];
  const addToCart = cartCtx.addToCart || cartCtx.addItem || cartCtx.add;
  // Note: removeFromCart and updateQuantity are available in context but currently unused in the grid UI

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
    <div className="space-y-6 p-4">
      {currentCategory && currentCategory.subcategories?.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm">Subcategories</h3>
          <div className="space-y-2">
            {currentCategory.subcategories.map((sub: any) => (
              <Link
                key={sub.slug}
                to={`/category/${currentCategory.slug}/${sub.slug}`}
                className={`block text-sm py-1 hover:text-primary ${subcategory === sub.slug ? "text-primary font-semibold" : ""}`}
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

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <Header />
      <style>{`
        [data-side="left"] {
          top: 64px !important;
          height: calc(100vh - 64px) !important;
          left: 0 !important;
        }
      `}</style>

      <main className="max-w-[1400px] mx-auto px-6 py-8 pb-40 md:pb-12">
        <div className="flex gap-8">
          {/* LEFT: Filters (desktop visible) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white border rounded-lg shadow-sm overflow-hidden sticky top-24">
              <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                <h2 className="font-semibold text-lg mb-2">Filters</h2>
                <FilterSidebar />
              </div>
            </div>
          </aside>

          {/* RIGHT: Product grid */}
          <section className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#3b2b28]">
                  {breadcrumb === "All Products" ? "Home Decor" : breadcrumb}
                </h1>
                <div className="text-sm text-[#8B7355] mt-1">
                  Showing {displayProducts.length} Products
                </div>
              </div>

              {/* Filters button for smaller screens */}
              <div className="lg:hidden">
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-md shadow-sm text-sm">
                      <Filter className="w-4 h-4" /> Filters
                    </button>
                  </SheetTrigger>

                  <SheetContent
                    side="left"
                    className="w-80 fixed left-0"
                    style={{
                      top: "100px",
                      height: "calc(100vh - 70px)",
                      overflowY: "auto",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>

                    <div className="mt-6 px-4 pb-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {displayProducts.length === 0 ? (
              <div className="col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-4 flex flex-col items-center justify-center py-20 px-6">
                <div className="text-center max-w-md">
                  {/* Decorative Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative w-24 h-24 md:w-32 md:h-32">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF76]/20 to-[#C18E63]/20 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 md:inset-3 flex items-center justify-center bg-white rounded-full border-2 border-[#D4AF76]">
                        <Gift className="w-12 h-12 md:w-16 md:h-16 text-[#C18E63]" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>

                  {/* Heading */}
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#5D4037] mb-3">
                    Coming Soon
                  </h2>

                  {/* Description */}
                  <p className="text-[#8B7355] text-sm md:text-base mb-6 leading-relaxed">
                    We're curating an amazing collection of {breadcrumb.toLowerCase()} just for you. Check back soon for exclusive products!
                  </p>

                  {/* Decorative Line */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF76]"></div>
                    <span className="text-[#C18E63] text-lg">✨</span>
                    <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF76]"></div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-[#C18E63] to-[#D4AF76] text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Browse Other Categories
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((product) => {
                  const isOOS = product.inStock === false;
                  const isAdded = cart?.some(
                    (item: any) =>
                      item.id === product._id || item._id === product._id
                  );

                  return (
                    <div
                      key={product._id}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="relative bg-white rounded-lg border border-[#f0e6e2] shadow-sm overflow-hidden"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          navigate(`/product/${product._id}`);
                      }}
                    >
                      {/* IMAGE AREA */}
                      <div className="relative bg-white p-3 flex items-center justify-center aspect-square">
                        <img
                          src={
                            product.mainImage ||
                            product.images?.[0] ||
                            "/placeholder.svg"
                          }
                          alt={product.name}
                          className={`w-full h-full object-cover rounded-md ${
                            isOOS ? "grayscale" : ""
                          }`}
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder.svg")
                          }
                        />

                        {/* OUT OF STOCK LABEL */}
                        {isOOS && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <span className="bg-red-600 text-white px-3 py-1 rounded-md font-semibold shadow">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="px-3 py-2">
                        <h3 className="text-sm font-medium text-[#2b2b2b] line-clamp-2 mb-1">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-2 text-xs mb-2">
                          <span className="text-sm font-semibold text-[#2b2b2b]">
                            {(product.rating ?? 0).toFixed(1)}
                          </span>
                          <Star
                            size={14}
                            className="fill-green-600 text-green-600"
                          />
                          <span className="text-xs text-[#6b6b6b]">
                            ({product.reviews ?? 0})
                          </span>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-base font-bold text-[#172021]">
                              ₹{product.price?.toLocaleString()}
                            </div>

                            {product.originalPrice &&
                              product.originalPrice > product.price && (
                                <div className="text-xs text-[#8B7355] line-through">
                                  ₹{product.originalPrice?.toLocaleString()}
                                </div>
                              )}
                          </div>

                          {/* BUTTON - Add / Added / Disabled */}
                          {isOOS ? (
                            <button
                              disabled
                              className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-500 border border-gray-300 rounded-md text-sm"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span className="hidden md:block">
                                Unavailable
                              </span>
                            </button>
                          ) : isAdded ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white border border-green-600 rounded-md text-sm"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Added</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                addToCart({
                                  id: product._id,
                                  name: product.name,
                                  price: product.price,
                                  image:
                                    product.mainImage ||
                                    product.images?.[0] ||
                                    "/placeholder.svg",
                                  delivery: product.delivery || "Standard",
                                  // Preserve delivery charges even when adding from category grid
                                  deliveryCharge: product.deliveryCharge ?? 499,
                                  quantity: 1,
                                });
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e9e2de] rounded-md shadow-sm text-sm hover:shadow-md"
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
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Category;