import { Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductsContext";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { categories, products } = useProducts();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-8 md:p-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to ShopHub
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Discover amazing products across all categories with unbeatable prices and fast delivery
            </p>
            <Button size="lg" asChild>
              <Link to="/category/electronics">
                Start Shopping
              </Link>
            </Button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link key={category.slug} to={`/category/${category.slug}`}>
                <Card className="p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex flex-col items-center text-center gap-3">
                    <span className="text-5xl group-hover:scale-110 transition-transform">
                      {category.icon}
                    </span>
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="link" asChild>
              <Link to="/category/electronics">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.slice(0, 10).map((product) => (
              <Link key={product.id} to={`/category/${product.category.toLowerCase()}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                    {product.badge && (
                      <div className="absolute top-2 left-2 bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-semibold">
                        {product.badge}
                      </div>
                    )}
                    <span className="text-6xl group-hover:scale-110 transition-transform">
                      {product.image}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-2 mb-2 min-h-[40px]">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                      <span className="text-xs text-success font-semibold">{product.discount}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
