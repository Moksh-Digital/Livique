import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  // ✅ Calculate total delivery dynamically
  const totalDeliveryCharges = cart.reduce(
    (acc, item) => acc + (item.deliveryCharge || 0),
    0
  );

  const totalPrice = getTotalPrice();
  const grandTotal = totalPrice + totalDeliveryCharges;

  const handleCheckout = () => {
    navigate("/address");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-[1400px] mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">
            Add some products to get started!
          </p>
          <Button className=" bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916]" onClick={() => navigate("/")}>Browse Products</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ---------------- CART ITEMS ---------------- */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const key = item.id || item.id || `${item.name || "item"}-${index}`;
              return (
                <Card key={key} className="p-4 rounded-2xl">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {typeof item.image === "string" &&
                    (item.image.startsWith?.("data:") ||
                      item.image.startsWith?.("http")) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-4xl">{item.image}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-3">
                    {/* top row: name + price */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <span className="font-bold text-lg whitespace-nowrap">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Delivery: {item.delivery}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Delivery Charge: ₹{item.deliveryCharge?.toLocaleString() || 0}
                    </div>

                    {/* Quantity + delete inline */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                </Card>
              );
            })}
          </div>

          {/* ---------------- ORDER SUMMARY ---------------- */}
          <div>
            <Card className="p-6 rounded-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  <span className="font-semibold">
                    ₹{totalDeliveryCharges.toLocaleString()}
                  </span>
                </div>

                <div className="h-px bg-border my-3"></div>

                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full h-12 rounded-xl bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916] text-white hover:bg-primary/90 mb-3"
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
