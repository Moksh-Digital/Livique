import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Payment = () => {
  const navigate = useNavigate();
  const { totalPrice, clearCart, items } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const deliveryCharges = 599;
  const total = totalPrice + deliveryCharges;

  const handlePlaceOrder = () => {
    const address = JSON.parse(localStorage.getItem('shippingAddress') || '{}');
    const order = {
      id: `ORD${Date.now()}`,
      items,
      total,
      paymentMethod,
      address,
      date: new Date().toISOString(),
      status: 'Confirmed'
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    clearCart();
    toast({
      title: "Order Placed Successfully!",
      description: `Order ID: ${order.id}`
    });
    navigate("/order-confirmation", { state: { order } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Payment Options</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 rounded-2xl">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when you receive</div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/50">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Razorpay (UPI, Cards, Net Banking)</div>
                      <div className="text-sm text-muted-foreground">Secure online payment</div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-accent/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Credit/Debit Card</div>
                      <div className="text-sm text-muted-foreground">Visa, Mastercard, Amex</div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          </div>

          <div>
            <Card className="p-6 rounded-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹ {totalPrice}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  <span className="font-semibold">₹ {deliveryCharges}</span>
                </div>
                
                <div className="h-px bg-border my-3"></div>
                
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-xl">₹ {total}</span>
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
