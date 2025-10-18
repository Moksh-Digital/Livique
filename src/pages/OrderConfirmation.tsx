import { useLocation, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <p>No order information found</p>
          <Link to="/">
            <Button className="mt-4">Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8 rounded-2xl text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-20 w-20 text-success" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We've received it and will process it shortly.
          </p>

          <div className="bg-accent/20 rounded-xl p-6 mb-6">
            <div className="grid gap-3 text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-bold">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold text-xl">₹ {order.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-semibold capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-semibold text-success">{order.status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link to="/">
              <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="w-full h-12 rounded-xl">
                View All Products
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default OrderConfirmation;
