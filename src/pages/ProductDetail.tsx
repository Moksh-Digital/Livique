import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/contexts/ProductsContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
// ✅ AUTO SWITCH API BASE URL
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api"          // local dev
  : "https://api.livique.co.in/api";    // production = droplet IP



const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();

  // ---------------- STATES ----------------
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [deliveryOption, setDeliveryOption] = useState<"hand" | "courier">("hand");
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  // ---------------- FETCH PRODUCT ----------------
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const found = getProductById(id || "");
        if (found) {
          setProduct(found);
          setLoading(false);
          loadSimilarProducts(found.subcategory, found.id);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
        loadSimilarProducts(data.subcategory, data._id || data.id);
      } catch (err) {
        console.error("Failed to load product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, getProductById]);

  // ---------------- FETCH SIMILAR PRODUCTS ----------------
  const loadSimilarProducts = async (subcategory: string, currentProductId: string) => {
    try {
      if (!subcategory) return;
      
      const res = await fetch(`${API_BASE_URL}/products?subcategory=${subcategory}`);
      if (!res.ok) throw new Error("Failed to fetch similar products");
      
      const data = await res.json();
      // Filter out current product and limit to 4 products
      // Transform _id to id for consistency with Product interface
      const filtered = data
        .filter((p: any) => (p._id || p.id) !== currentProductId)
        .map((p: any) => ({
          ...p,
          id: p._id || p.id, // Convert _id to id
        }))
        .slice(0, 4);
      
      setSimilarProducts(filtered);
    } catch (err) {
      console.error("Failed to load similar products:", err);
      setSimilarProducts([]);
    }
  };

  // ---------------- IMAGE LOGIC ----------------
  const images = useMemo(() => {
    if (!product) return [];
    const ordered = [product.mainImage, ...(product.images || []), product.image].filter(Boolean) as string[];
    const unique = Array.from(new Set(ordered));
    return unique.slice(0, 4);
  }, [product]);

  // Reset selected image if list changes
  useEffect(() => {
    if (selectedImage >= images.length) setSelectedImage(0);
  }, [images, selectedImage]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Update meta tags for sharing when product loads
  useEffect(() => {
    if (!product) return;

    let productImage = product.mainImage || (product.images && product.images[0]) || product.image;
    
    // Ensure absolute URL for image
    if (productImage && !productImage.startsWith('http')) {
      // If it's a relative URL, make it absolute
      productImage = `https://api.livique.co.in${productImage.startsWith('/') ? '' : '/'}${productImage}`;
    }
    
    const productTitle = `${product.name} - Livique`;
    const productPrice = `₹${product.price.toLocaleString()}`;
    const productDescription = product.description ? `${product.description} | ${productPrice}` : `Buy ${product.name} on Livique | ${productPrice}`;
    const productUrl = `https://www.livique.co.in/product/${product.id || id}`;

    // Update page title
    document.title = productTitle;

    // Helper function to update or create meta tags
    const setMetaTag = (property: string, content: string, isProperty = true) => {
      let tag = document.querySelector(
        isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`
      ) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement("meta");
        if (isProperty) {
          tag.setAttribute("property", property);
        } else {
          tag.setAttribute("name", property);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Update Open Graph tags (for Facebook, LinkedIn, WhatsApp, etc.)
    setMetaTag("og:title", productTitle, true);
    setMetaTag("og:description", productDescription, true);
    setMetaTag("og:image", productImage, true);
    setMetaTag("og:url", productUrl, true);
    setMetaTag("og:type", "product", true);
    setMetaTag("og:site_name", "Livique", true);

    // Update Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image", false);
    setMetaTag("twitter:title", productTitle, false);
    setMetaTag("twitter:description", productDescription, false);
    setMetaTag("twitter:image", productImage, false);
    setMetaTag("twitter:site", "@Livique", false);

    // Update description and other common tags
    setMetaTag("description", productDescription, false);

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", productUrl);

    console.log("Meta tags updated:", { productTitle, productImage, productUrl });

  }, [product, id]);

  // ---------------- CONDITIONAL UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button className="mt-4 " onClick={() => navigate("/")}>
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  // ---------------- MAIN DATA ----------------
  const handDeliveryCharge = product.deliveryCharge ?? 599;
  const courierDeliveryCharge = 449;

  const handleAddToCart = () => {
    if (product.inStock === false) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive"
      });
      return;
    }

    const selectedCharge = deliveryOption === "hand" ? handDeliveryCharge : courierDeliveryCharge;

    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.mainImage || (product.images && product.images[0]) || product.image,
      delivery: product.delivery,
      deliveryCharge: selectedCharge,
    });

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (product.inStock === false) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable.",
        variant: "destructive"
      });
      return;
    }
    handleAddToCart();
    navigate("/cart");
  };

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 py-6 pb-24 md:pb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* ---------------- PRODUCT IMAGES ---------------- */}
          <div>
            <Card className="mb-4 rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <img
                  src={images[selectedImage] ?? images[0] ?? product.mainImage}
                  alt={product.name}
                  className="object-contain w-full h-full"
                />
              </div>
            </Card>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {images.map((src, idx) => (
                <Card
                  key={idx}
                  className={`cursor-pointer rounded-xl overflow-hidden ${selectedImage === idx ? "ring-2 ring-primary" : ""
                    }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <div className="aspect-square bg-muted/50 flex items-center justify-center">
                    <img src={src} alt={`thumb-${idx}`} className="object-contain w-full h-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* ---------------- PRODUCT DETAILS ---------------- */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount && <span className="text-green-600 font-semibold">{product.discount}</span>}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviews?.toLocaleString()} reviews)
              </span>
            </div>

            <p className="text-muted-foreground mb-6">
              {product.description ||
                `Experience premium quality with our ${product.name}. Excellent build and high performance for daily use.`}
            </p>

            {/* ---------------- Action buttons ---------------- */}
            
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Delivery</h3>
              <Card className="p-4 rounded-xl shadow-md">
                <div className="text-center">
                  <p className="font-semibold text-sm mb-1">
                    Delivery ₹{(product.deliveryCharge ?? 499).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Expected by {product.deliveryDate || "2 days"}
                  </p>
                </div>
              </Card>
            </div>

              <div className="grid grid-cols-2 gap-3">
              {product.inStock === false ? (
                <div className="col-span-2">
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-center">
                    <p className="text-red-600 font-bold text-lg">Out of Stock</p>
                    <p className="text-red-500 text-sm mt-1">This product is currently unavailable</p>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-primary text-primary hover:bg-primary/10"
                    onClick={handleAddToCart}
                  >
                    🛒 Add To Cart
                  </Button>

                  <Button
                    className="h-12 rounded-xl bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916] hover:bg-primary/90"
                    onClick={handleBuyNow}
                  >
                    🛍️ Buy Now
                  </Button>
                </>
              )}
            </div>

            {/* ---------------- DELIVERY INFORMATION ---------------- */}
            <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Delivery Information</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    We ship our products with the help of our delivery partners that's why the date of delivery is an estimated date.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    There is a possibility of receiving the product prior or after the estimated date of delivery.
                  </span>
                </li>
                {/* <li className="flex gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    Our Same Day Delivery products are sourced locally at the delivery location from vendor and will be hand delivered within standard delivery timings.
                  </span>
                </li> */}
                <li className="flex gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    You have to give a delivery address where someone will surely be present to receive the order as our courier partners do not make a call to the customer before delivering their products.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    We do not deliver on Sundays and national holidays.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    You cannot redirect your order to an address other than the address given at the time of order.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    We carefully pack and ship all of our orders from the warehouse.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-400 mt-1">•</span>
                  <span className="text-sm text-gray-700">
                    Once the product will be dispatched, you will receive a tracking no. by which you can easily track your product.
                  </span>
                </li>
              </ul>
            </div>


          </div>
        </div>

        {/* ---------------- SIMILAR PRODUCTS SECTION ---------------- */}
        {similarProducts.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarProducts.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.mainImage || (product.images && product.images[0]) || product.image}
                        alt={product.name}
                        className="object-contain w-full h-full hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-3 flex flex-col flex-grow">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3 mt-auto">
                        <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      {product.inStock === false && (
                        <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
