import { useParams, Link } from "react-router-dom";
import { Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/contexts/ProductsContext";
import Header from "@/components/Header";

const Category = () => {
  const { category } = useParams();
  const { products, getProductsByCategory } = useProducts();
  
  const categoryProducts = category 
    ? getProductsByCategory(category.replace(/-/g, ' '))
    : products;

  const categoryName = category
    ? category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'All Products';

  const categories = [
    { name: "Gift Hampers", icon: "🎁" },
    { name: "Premium Gifts", icon: "💎" },
    { name: "Sweets", icon: "🍬" },
    { name: "Chocolates", icon: "🍫" },
    { name: "Dryfruits", icon: "🥜" },
    { name: "Home Décor", icon: "🪔" },
    { name: "Personalised Gifts", icon: "🎨" },
    { name: "Diyas", icon: "🕯️" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          {" / "}
          <span className="text-foreground font-medium">{categoryName}</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">{categoryProducts.length} Products</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold">4.8</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by :</span>
            <Button variant="outline" size="sm">
              Recommended <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat, idx) => (
            <Link key={idx} to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card className="flex flex-col items-center justify-center p-4 min-w-[120px] hover:shadow-lg transition-shadow cursor-pointer rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200">
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-xs font-semibold text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Card>
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categoryProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full rounded-2xl">
                <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                  <span className="text-6xl">{product.image}</span>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-medium mb-2 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-muted-foreground line-through text-xs">
                      ₹{product.originalPrice}
                    </span>
                    <span className="font-bold text-lg">₹{product.price}</span>
                    <span className="text-xs text-success font-semibold">
                      {product.discount}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Earliest Delivery: <span className="font-semibold text-foreground">{product.delivery}</span>
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Category;
