import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState("hand");

  const product = getProductById(id || '');

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  // Ensure mainImage is included first, then gallery images, then legacy image.
  // Remove falsy values and duplicates so mainImage always appears in the array.
  const ordered = [
    product.mainImage,
    ...(product.images || []),
    product.image
  ].filter(Boolean) as string[];
  const unique = Array.from(new Set(ordered));
  const images = unique.slice(0, 4);

  // if selectedImage is out of bounds (e.g. images changed), reset to 0
  useEffect(() => {
    if (selectedImage >= images.length) setSelectedImage(0);
  }, [images, selectedImage]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage || (product.images && product.images[0]) || product.image,
      delivery: product.delivery
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <Card className="mb-4 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                {(() => {
                  const display = images[selectedImage] ?? images[0] ?? (product.mainImage || product.image);
                  if (typeof display === "string" && (display.startsWith?.("data:") || display.startsWith?.("http"))) {
                    // eslint-disable-next-line @next/next/no-img-element
                    return <img src={display} alt={product.name} className="object-contain w-full h-full" />;
                  }
                  return <span className="text-[200px]">{display}</span>;
                })()}
              </div>
            </Card>
            
            <div className="grid grid-cols-4 gap-2">
              {images.map((src, idx) => (
                 <Card
                   key={idx}
                   className={`cursor-pointer rounded-xl overflow-hidden ${selectedImage === idx ? "ring-2 ring-primary" : ""}`}
                   onClick={() => setSelectedImage(idx)}
                 >
                   <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                     {src && (src.startsWith?.("data:") || src.startsWith?.("http")) ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={src} alt={`thumb-${idx}`} className="object-contain w-full h-full" />
                     ) : (
                       <span className="text-4xl">{src || (product.mainImage || product.image)}</span>
                     )}
                   </div>
                 </Card>
               ))}
             </div>
           </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              <span className="text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-success font-semibold">{product.discount}</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description || `Experience the best in class ${product.name}. Premium quality with great features and excellent build quality. Perfect for everyday use with outstanding performance.`}
            </p>

            {/* Available Options */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Delivery Options</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card 
                  className={`p-4 cursor-pointer rounded-xl ${
                    deliveryOption === "hand" ? "border-primary border-2" : ""
                  }`}
                  onClick={() => setDeliveryOption("hand")}
                >
                  <div className="text-center">
                    <p className="font-semibold text-sm mb-1">Hand Delivery ₹599</p>
                    <p className="text-xs text-muted-foreground">Earliest by {product.delivery}</p>
                  </div>
                </Card>
                
                <Card 
                  className={`p-4 cursor-pointer rounded-xl ${
                    deliveryOption === "courier" ? "border-primary border-2" : ""
                  }`}
                  onClick={() => setDeliveryOption("courier")}
                >
                  <div className="text-center">
                    <p className="font-semibold text-sm mb-1">Courier ₹449</p>
                    <p className="text-xs text-muted-foreground">Earliest by Tomorrow</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 rounded-xl border-primary text-primary hover:bg-primary/5"
                onClick={handleAddToCart}
              >
                🛒 Add To Cart
              </Button>
              
              <Button 
                className="h-12 rounded-xl bg-primary hover:bg-primary/90"
                onClick={handleBuyNow}
              >
                🛍️ Buy Now
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
