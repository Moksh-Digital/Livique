import { useParams, Link } from "react-router-dom";
import {
  Star,
  ChevronDown,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCategoryBySlug } from "@/data/categories";
import PromoBanner from "@/components/Banner"

const Category = () => {
  const { category, subcategory } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // 🧭 Breadcrumb Logic
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

  // 🧩 Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/products";
        
        // If we have both category and subcategory, it's a subcategory view
        if (subcategory) {
          url += `?category=${category}&subcategory=${subcategory}`;
        } else if (category) {
          // Main category view - show all products from this category and its subcategories
          url += `?category=${category}`;
        }

        console.log("🔍 Fetching from URL:", url);
        const { data } = await axios.get(url);
        setProducts(data);
        console.log("Fetched products:", data);
        console.log("🔍 Category:", category, "Subcategory:", subcategory);
        console.log("🔍 Current category data:", currentCategory);

      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, subcategory]);

  // 🧮 Filter products
  let displayProducts = products.filter((product: any) => {
    const priceMatch =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    const ratingMatch =
      selectedRatings.length === 0 ||
      selectedRatings.some((r) => product.rating >= r);
    return priceMatch && ratingMatch;
  });

  // 🧱 Filter Sidebar Component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Subcategories */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm">Subcategories</h3>
          <div className="space-y-2">
            {currentCategory.subcategories.map((sub) => (
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

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Price Range</h3>
        <div className="px-2">
          <Slider
            min={0}
            max={300000}
            step={1000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Customer Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={(checked) => {
                  if (checked)
                    setSelectedRatings([...selectedRatings, rating]);
                  else
                    setSelectedRatings(
                      selectedRatings.filter((r) => r !== rating)
                    );
                }}
              />
              <Label
                htmlFor={`rating-${rating}`}
                className="text-sm flex items-center gap-1 cursor-pointer"
              >
                <span>{rating}</span>
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-muted-foreground">& Up</span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 🔄 Loading & Error States
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  // 🧩 Main UI
  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          {category && (
            <>
              {" / "}
              <Link
                to={`/category/${category}`}
                className="hover:text-foreground"
              >
                {category
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              </Link>
            </>
          )}
          {subcategory && (
            <>
              {" / "}
              <span className="text-foreground font-medium">{breadcrumb}</span>
            </>
          )}
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6 border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Filters</h2>
                {(selectedRatings.length > 0 ||
                  priceRange[0] > 0 ||
                  priceRange[1] < 300000) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPriceRange([0, 300000]);
                      setSelectedRatings([]);
                    }}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{breadcrumb}</h1>
                <div className="text-sm text-muted-foreground">
                  Showing {displayProducts.length}{" "}
                  {displayProducts.length === 1 ? "Product" : "Products"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filters */}
                <Sheet open={showFilters} onOpenChange={setShowFilters}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                <Button variant="outline" size="sm">
                  Sort by: Recommended
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>


            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayProducts.map((product: any) => (
                <Link key={product._id} to={`/product/${product._id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 rounded-xl group">
                    <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          product.mainImage ||
                          product.images?.[0] ||
                          "/placeholder.png"
                        }
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-3">
                      <h3 className="text-sm font-medium mb-2 line-clamp-2 min-h-[40px]">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded">
                          <span className="text-xs font-semibold">
                            {product.rating}
                          </span>
                          <Star className="h-3 w-3 fill-success text-success" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-lg">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground line-through text-xs">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Delivery:{" "}
                        <span className="font-semibold text-foreground">
                          {product.delivery || "Standard"}
                        </span>
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* No Products */}
            {displayProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products found matching your filters
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setPriceRange([0, 300000]);
                    setSelectedRatings([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Category;
