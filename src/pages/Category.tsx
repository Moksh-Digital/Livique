import { useParams, Link } from "react-router-dom";
import { Star, ChevronDown, Filter, Smartphone, Shirt, Home, Heart, BookOpen, Dumbbell, Shapes, ShoppingCart, Cpu, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/contexts/ProductsContext";
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

const Category = () => {
  const { category, subcategory } = useParams();
  const { products, categories, getProductsByCategory, getProductsBySubcategory } = useProducts();
  
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Determine which products to display
  let displayProducts: any[] = [];
  let breadcrumb = "All Products";

  if (category && subcategory) {
    // Subcategory page
    displayProducts = getProductsBySubcategory(subcategory);
    breadcrumb = subcategory.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  } else if (category) {
    // Category page
    displayProducts = getProductsByCategory(category);
    breadcrumb = category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  } else {
    // Default
    displayProducts = products;
  }

  // Apply filters
  displayProducts = displayProducts.filter(product => {
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const ratingMatch = selectedRatings.length === 0 || selectedRatings.some(r => product.rating >= r);
    return priceMatch && ratingMatch;
  });

  const currentCategory = categories.find(cat => 
    cat.slug === category || cat.subcategories.some(sub => sub.slug === subcategory)
  );

  // helper to return an icon component for a given category slug
  const getIconForSlug = (slug: string) => {
    const map: Record<string, JSX.Element> = {
      "electronics": <Smartphone className="h-4 w-4 mr-2" aria-hidden />,
      "fashion": <Shirt className="h-4 w-4 mr-2" aria-hidden />,
      "home & furniture": <Home className="h-4 w-4 mr-2" aria-hidden />,
      "home-furniture": <Home className="h-4 w-4 mr-2" aria-hidden />,
      "beauty & personal care": <Heart className="h-4 w-4 mr-2" aria-hidden />,
      "beauty-personal-care": <Heart className="h-4 w-4 mr-2" aria-hidden />,
      "books & stationery": <BookOpen className="h-4 w-4 mr-2" aria-hidden />,
      "books-stationery": <BookOpen className="h-4 w-4 mr-2" aria-hidden />,
      "sports & fitness": <Dumbbell className="h-4 w-4 mr-2" aria-hidden />,
      "sports-fitness": <Dumbbell className="h-4 w-4 mr-2" aria-hidden />,
      "toys & baby products": <Shapes className="h-4 w-4 mr-2" aria-hidden />,
      "grocery & food": <ShoppingCart className="h-4 w-4 mr-2" aria-hidden />,
      "grocery-food": <ShoppingCart className="h-4 w-4 mr-2" aria-hidden />,
      "appliances": <Cpu className="h-4 w-4 mr-2" aria-hidden />,
      "automotive": <Truck className="h-4 w-4 mr-2" aria-hidden />,
    };
    return map[slug.toLowerCase()] ?? <span className="w-4 h-4 mr-2" />;
  };

  // Sidebar for filters
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Categories</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <Link 
                to={`/category/${cat.slug}`}
                className="block text-sm py-1 hover:text-primary transition-colors flex items-center"
              >
                {getIconForSlug(cat.slug)}
                {cat.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-sm">Subcategories</h3>
          <div className="space-y-2">
            {currentCategory.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                to={`/category/${currentCategory.slug}/${sub.slug}`}
                className="block text-sm py-1 hover:text-primary transition-colors"
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
                  if (checked) {
                    setSelectedRatings([...selectedRatings, rating]);
                  } else {
                    setSelectedRatings(selectedRatings.filter(r => r !== rating));
                  }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          {category && (
            <>
              {" / "}
              <Link to={`/category/${category}`} className="hover:text-foreground">
                {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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
                {(selectedRatings.length > 0 || priceRange[0] > 0 || priceRange[1] < 300000) && (
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
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Showing {displayProducts.length} {displayProducts.length === 1 ? 'Product' : 'Products'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter */}
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
                  Sort by: Recommended <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Subcategory cards (only on category page) */}
            {currentCategory && !subcategory && currentCategory.subcategories.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {currentCategory.subcategories.map((sub) => (
                  <Link
                    key={sub.slug}
                    to={`/category/${currentCategory.slug}/${sub.slug}`}
                    className="block border rounded-lg hover:shadow-md transition p-4 text-center bg-card"
                  >
                    <h3 className="font-semibold">{sub.name}</h3>
                  </Link>
                ))}
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full rounded-xl group">
                    <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                      {product.badge && (
                         <div className="absolute top-2 left-2 bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-semibold z-10">
                           {product.badge}
                         </div>
                       )}
                      {(((product as any).mainImage || (product as any).images?.[0] || product.image) as string).startsWith('data:') ||
                      (((product as any).mainImage || (product as any).images?.[0] || product.image) as string).startsWith('http') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={(product as any).mainImage || (product as any).images?.[0] || product.image}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                          {(product as any).mainImage || (product as any).images?.[0] || product.image}
                        </span>
                      )}
                     </div>
                    
                    <div className="p-3">
                      <h3 className="text-sm font-medium mb-2 line-clamp-2 min-h-[40px]">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-success/10 rounded">
                          <span className="text-xs font-semibold">{product.rating}</span>
                          <Star className="h-3 w-3 fill-success text-success" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews.toLocaleString()})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                        <span className="text-muted-foreground line-through text-xs">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-success font-semibold">
                          {product.discount}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Delivery: <span className="font-semibold text-foreground">{product.delivery}</span>
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* No Products */}
            {displayProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your filters</p>
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
