import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useState } from "react";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ✅ Calculate total delivery dynamically
  const totalDeliveryCharges = cart.reduce(
    (acc, item) => acc + (item.deliveryCharge || 0),
    0
  );

  const totalPrice = getTotalPrice();
  const grandTotal = totalPrice + totalDeliveryCharges;

  const handleCheckout = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
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
                <Card key={key} className="p-5 rounded-2xl border border-[#f0e6e2]">
                  <div className="flex gap-4 sm:gap-5">
                    {/* Image */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {typeof item.image === "string" &&
                      (item.image.startsWith?.("data:") ||
                        item.image.startsWith?.("http")) ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl sm:text-5xl">{item.image}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      {/* Top: Name + Price */}
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-[#2b2b2b] mb-3 break-words line-clamp-2">
                          {item.name}
                        </h3>
                        
                        <div className="text-xs sm:text-sm text-[#8B7355] space-y-1 mb-3">
                          <div>Delivery: <span className="font-medium text-[#5D4037]">{item.delivery}</span></div>
                          <div>Delivery Charge: <span className="font-medium text-[#5D4037]">₹{item.deliveryCharge?.toLocaleString() || 0}</span></div>
                        </div>
                      </div>

                      {/* Bottom: Quantity + Price + Delete */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded hover:bg-white"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded hover:bg-white"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-bold text-lg sm:text-xl text-[#172021] whitespace-nowrap">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md border-0 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center text-center px-2 py-4">
            {/* Icon */}
            <div className="mb-6 w-16 h-16 bg-gradient-to-br from-[#A7443F] via-[#7C2A25] to-[#3A1916] rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <DialogTitle className="text-3xl font-bold text-[#1a1a1a] mb-3">
              Login Required
            </DialogTitle>

            {/* Description */}
            <DialogDescription className="text-base text-[#666] leading-relaxed">
              Please login to your account to proceed with checkout and complete your order.
            </DialogDescription>

            {/* Decorative line */}
            <div className="w-12 h-1 bg-gradient-to-r from-[#A7443F] to-[#3A1916] rounded-full mt-6 mb-6"></div>

            {/* Message */}
            <p className="text-sm text-[#888] mb-2">
              🎁 Sign in to access your cart and exclusive offers
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
