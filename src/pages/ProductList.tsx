import { Link } from "react-router-dom";
import { Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const ProductList = () => {
  const categories = [
    { name: "Gift Hampers", icon: "🎁" },
    { name: "Premium Gifts", icon: "💎" },
    { name: "Gifts in 60 mins", icon: "⚡" },
    { name: "Luxe Gifts", icon: "✨" },
    { name: "Sweets", icon: "🍬" },
    { name: "Chocolates", icon: "🍫" },
    { name: "Dryfruits", icon: "🥜" },
    { name: "Home Décor", icon: "🪔" },
    { name: "Personalised Gifts", icon: "🎨" },
    { name: "Diyas", icon: "🕯️" },
  ];

  const products = [
    {
      id: 1,
      name: "Diwali Jade N Fridge Magnet Gift",
      price: 1199,
      originalPrice: 1299,
      discount: "8% OFF",
      delivery: "Today",
      image: "🌿",
    },
    {
      id: 2,
      name: "Diwali Dazzle Delight",
      price: 1449,
      originalPrice: 1799,
      discount: "19% OFF",
      delivery: "Today",
      image: "🥜",
    },
    {
      id: 3,
      name: "Festive Treats Chocolate n Nut...",
      price: 1449,
      originalPrice: 1799,
      discount: "19% OFF",
      badge: "Festive Radiance",
      delivery: "Today",
      image: "🍫",
    },
    {
      id: 4,
      name: "Sacred Saffron Kaju Katli with...",
      price: 1299,
      originalPrice: 1449,
      discount: "10% OFF",
      delivery: "Today",
      image: "🪔",
    },
    {
      id: 5,
      name: "Diwali Yellow and Orange Bloom Pots",
      price: 799,
      originalPrice: 999,
      discount: "20% OFF",
      delivery: "Today",
      image: "🌼",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Home</Link>
          {" / "}
          <Link to="/gifts" className="hover:text-foreground">Gifts</Link>
          {" / "}
          <span className="text-foreground font-medium">Diwali Gifts</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Diwali Gifts</h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">40 of 660 Gifts</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold">4.8</span>
              </div>
              <Button variant="link" className="p-0 h-auto text-sm text-primary">
                941 Reviews <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
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
            <Card key={idx} className="flex flex-col items-center justify-center p-4 min-w-[120px] hover:shadow-lg transition-shadow cursor-pointer rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200">
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-xs font-semibold text-center whitespace-nowrap">
                {cat.name}
              </span>
            </Card>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full rounded-2xl">
                <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                  {((product as any).mainImage || (product as any).images?.[0] || product.image).toString().startsWith('data:') ||
                  ((product as any).mainImage || (product as any).images?.[0] || product.image).toString().startsWith('http') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={(product as any).mainImage || (product as any).images?.[0] || product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-6xl">{(product as any).mainImage || (product as any).images?.[0] || product.image}</span>
                  )}
                   {product.badge && (
                     <Badge className="absolute bottom-2 left-2 right-2 bg-secondary text-white text-xs">
                       {product.badge}
                     </Badge>
                   )}
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

export default ProductList;
