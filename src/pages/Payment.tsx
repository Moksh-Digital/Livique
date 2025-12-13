import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import StepsTracker from "@/components/StepsTracker";
import axios from 'axios'; // 👈 IMPORT AXIOS
import { Wallet, CreditCard, Landmark, Banknote } from "lucide-react";

// ✅ AUTO SWITCH API BASE URL
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api"          // local dev
  : "https://api.livique.co.in/api";    // production = droplet IP



const Payment = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("cod");

const handlePlaceOrder = async () => {
  const rawAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");

  const address = {
    fullName: rawAddress.fullName,
    mobile: rawAddress.mobile,
    street: `${rawAddress.houseNo}, ${rawAddress.street}, ${rawAddress.locality}`,
    city: rawAddress.city,
    state: rawAddress.state,
    pincode: rawAddress.pincode,
    landmark: rawAddress.landmark || "",
    addressType: rawAddress.addressType || "home",
  };

  const totalDeliveryCharges = cart.reduce(
    (acc, item) => acc + (item.deliveryCharge || 0),
    0
  );

  const subtotal = getTotalPrice();
  const total = subtotal + totalDeliveryCharges;

  const orderData = {
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      deliveryCharge: item.deliveryCharge,
    })),
    subtotal,
    deliveryCharges: totalDeliveryCharges,
    total,
    paymentMethod,
    address,
  };

  const token = localStorage.getItem("token");
  if (!token) {
    toast({
      title: "Error",
      description: "Please log in to place an order.",
      variant: "destructive",
    });
    return;
  }

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    if (paymentMethod === "cod") {
      // 🧾 Normal COD flow
      const { data: createdOrder } = await axios.post(
        `${API_BASE_URL}/orders`,
        orderData,
        config
      );

      clearCart();
      localStorage.removeItem("shippingAddress");

      toast({
        title: "Order Placed Successfully!",
        description: `Order ID: ${createdOrder._id || createdOrder.id}`,
      });

      navigate("/order-confirmation", { state: { order: createdOrder } });
    } else if (paymentMethod === "razorpay") {
      // 💳 Razorpay flow
      const { data } = await axios.post(
        `${API_BASE_URL}/payment/create-order`,
        { amount: total },
        config
      );

      const options = {
        key: import.meta.env.RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Livique Store",
        description: "E-commerce Payment",
        order_id: data.id,

        handler: async (response: any) => {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user?._id || localStorage.getItem("userId"),
              userEmail: user?.email || localStorage.getItem("userEmail"),
              userName: user?.name || localStorage.getItem("userName"),
              items: orderData.items,
              address: orderData.address,
              subtotal: orderData.subtotal,
              deliveryCharges: orderData.deliveryCharges,
              total: orderData.total,
              paymentMethod: "razorpay",
            };

            const verifyRes = await axios.post(
              `${API_BASE_URL}/payment/verify`,
              verifyData
            );

            if (verifyRes.data.success) {
              clearCart();
              localStorage.removeItem("shippingAddress");

              toast({
                title: "Payment Successful!",
                description: `Order ID: ${verifyRes.data.orderId}`,
              });

              navigate("/order-confirmation", { state: { orderId: verifyRes.data.orderId } });
            } else {
              toast({
                title: "Payment Verification Failed",
                description: verifyRes.data.message || "Please try again.",
                variant: "destructive",
              });
            }
          } catch (error: any) {
            console.error("❌ Payment verification error:", error.response?.data || error);
            toast({
              title: "Payment Verification Failed",
              description: error.response?.data?.message || "Please contact support.",
              variant: "destructive",
            });
          }
        },

        prefill: {
          name: address.fullName,
          email: "customer@example.com",
          contact: address.mobile,
        },

        theme: { color: "#3399cc" },

        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },

        upi: {
          flow: "intent",
        },

        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
            },
            sequence: ["upi", "card", "netbanking", "wallet"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } else {
      toast({
        title: "Unsupported Payment Method",
        description: "Please select a valid option.",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("❌ Order/Payment failed:", error.response?.data || error);
    toast({
      title: "Order Failed",
      description:
        error.response?.data?.message ||
        "Something went wrong. Please try again.",
      variant: "destructive",
    });
  }
};



  // ✅ Calculate total delivery dynamically (same as Cart.tsx)
  const totalDeliveryCharges = cart.reduce(
    (acc, item) => acc + (item.deliveryCharge || 0),
    0
  );

  const subtotal = getTotalPrice();
  const total = subtotal + totalDeliveryCharges;

  // const handlePlaceOrder = () => {
  //   const address = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
  //   const order = {
  //     id: `ORD${Date.now()}`,
  //     items: cart,
  //     subtotal,
  //     deliveryCharges: totalDeliveryCharges,
  //     total,
  //     paymentMethod,
  //     address,
  //     date: new Date().toISOString(),
  //     status: "Confirmed",
  //   };

  //   const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  //   orders.push(order);
  //   localStorage.setItem("orders", JSON.stringify(orders));

  //   clearCart();
  //   toast({
  //     title: "Order Placed Successfully!",
  //     description: `Order ID: ${order.id}`,
  //   });
  //   navigate("/order-confirmation", { state: { order } });
  // };

  return (
    <div className="min-h-screen" style={{ background: '#F8F8F8' }}>
      <Header />
      <StepsTracker currentStep={2} />

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-8">
        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          {/* ---------------- LEFT: PAYMENT OPTIONS ---------------- */}
          <div className="space-y-4">
            {/* Payment Options Card */}
            <Card className="p-6 border-[1.5px]" style={{ borderColor: '#D4AF76', background: '#FFFFFF' }}>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-[#5D4037]">Select Payment Option</h2>
                <p className="text-xs text-[#7A5E55] mt-1">All transactions are secure and encrypted</p>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  {/* COD */}
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                      ${paymentMethod === 'cod' ? 'border-[#5D4037] bg-[#FFF8E6]' : 'border-gray-200 hover:border-[#D4AF76]'}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <RadioGroupItem value="cod" id="cod" className="mt-0" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-5 w-5 text-[#5D4037]" />
                        <span className="font-semibold text-[#3E2723]">Cash on Delivery</span>
                      </div>
                      <p className="text-xs text-[#7A5E55] mt-1">Pay when your order arrives at your doorstep</p>
                    </Label>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] px-2 py-1 rounded-full font-medium" style={{background:'#F3ECE5', color:'#5D4037'}}>
                        Most Popular
                      </span>
                    </div>
                  </div>

                  {/* Razorpay */}
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                      ${paymentMethod === 'razorpay' ? 'border-[#5D4037] bg-[#FFF8E6]' : 'border-gray-200 hover:border-[#D4AF76]'}`}
                    onClick={() => setPaymentMethod('razorpay')}
                  >
                    <RadioGroupItem value="razorpay" id="razorpay" className="mt-0" />
                    <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-[#5D4037]" />
                        <span className="font-semibold text-[#3E2723]">UPI / Cards / Net Banking</span>
                      </div>
                      <p className="text-xs text-[#7A5E55] mt-1">Pay securely using Razorpay gateway</p>
                    </Label>
                    <img alt="Razorpay" src="https://d6xcmfyh68wv8.cloudfront.net/newsroom-content/uploads/2024/05/Razorpay-Logo.jpg" className="h-5" />
                  </div>
                </div>
              </RadioGroup>

              {/* Terms acceptance */}
              <div className="mt-6 pt-4 border-t" style={{ borderColor: '#E7D6BD' }}>
                <p className="text-xs text-[#7A5E55] flex items-start gap-2">
                  <span className="text-[#5D4037] mt-0.5">✓</span>
                  <span>By placing this order, you agree to our Terms & Conditions and Privacy Policy</span>
                </p>
              </div>
            </Card>
          </div>

          {/* ---------------- RIGHT: YOUR CART ---------------- */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-5 border-[1.5px]" style={{ borderColor: '#D4AF76', background: '#FFFFFF' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#5D4037]">Your Cart ({cart.length})</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b" style={{ borderColor: '#F3ECE5' }}>
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#F8F8F8' }}>
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#3E2723] line-clamp-2">{item.name}</h3>
                      <p className="text-xs text-[#7A5E55] mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-[#3E2723]">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="space-y-2 py-4" style={{ borderTop: '1.5px solid #D4AF76' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A5E55]">Subtotal</span>
                  <span className="font-semibold text-[#3E2723]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A5E55]">Shipping</span>
                  <span className="font-semibold text-[#3E2723]">
                    {totalDeliveryCharges === 0 ? 'Free' : `₹${totalDeliveryCharges.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7A5E55]">Tax</span>
                  <span className="font-semibold text-[#3E2723]">₹0</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-3 mb-4" style={{ borderTop: '1.5px solid #D4AF76' }}>
                <span className="text-base font-bold text-[#5D4037]">Total</span>
                <span className="text-2xl font-bold text-[#3E2723]">₹{total.toLocaleString()}</span>
              </div>

              {/* Pay Button */}
              <Button
                onClick={handlePlaceOrder}
                className="w-full h-12 rounded-lg text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                style={{ background: '#5D4037' }}
              >
                Pay ₹{total.toLocaleString()}
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
