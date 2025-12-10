import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import StepsTracker from "@/components/StepsTracker";
import axios from 'axios'; // 👈 IMPORT AXIOS

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

  handler: async (response) => {
    const verifyRes = await axios.post(
      `${API_BASE_URL}/payment-verify`,
      response
    );

    if (verifyRes.data.success) {
      // ✅ Create order in DB after successful payment
      const { data: createdOrder } = await axios.post(
        `${API_BASE_URL}/orders`,
        { ...orderData, paymentStatus: "Paid" },
        config
      );

      clearCart();
      localStorage.removeItem("shippingAddress");

      toast({
        title: "Payment Successful!",
        description: `Order ID: ${createdOrder._id || createdOrder.id}`,
      });

      navigate("/order-confirmation", { state: { order: createdOrder } });
    } else {
      toast({
        title: "Payment Verification Failed",
        description: "Please try again.",
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

  // 👇👇👇 FORCE SHOW UPI BLOCK EVEN IN TEST MODE
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
    <div className="min-h-screen bg-background">
      <Header />
            <StepsTracker currentStep={2} />   {/* 👈 Add this line */}


      <main className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <h1 className="text-3xl font-bold mb-6">Payment Options</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ---------------- PAYMENT METHODS ---------------- */}
          <div className="lg:col-span-2">
            <Card className="p-6 rounded-2xl">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">
                        Pay when you receive
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/50">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                      <div className="font-semibold">
                        Razorpay (UPI, Cards, Net Banking)
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Secure online payment
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">
                        Visa, Mastercard, Amex
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* ---------------- ORDER SUMMARY ---------------- */}
          <div>
            <Card className="p-6 rounded-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    ₹{subtotal.toLocaleString()}
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
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
              >
                Place Order
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;
