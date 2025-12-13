import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import StepsTracker from "@/components/StepsTracker";
import { useProducts } from "@/contexts/ProductsContext";

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;
  const { refreshProducts } = useProducts();

  // Refresh products when order is confirmed to update quantities
  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
      <StepsTracker currentStep={3} />

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
    <div className="min-h-screen" style={{ background: '#F8F8F8' }}>
      <Header />
      <StepsTracker currentStep={3} />
      
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        {/* Success Header */}
        <Card className="p-8 text-center border-[1.5px] mb-6" style={{ borderColor: '#D4AF76', background: '#FFFFFF' }}>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#E8F5E9' }}>
              <CheckCircle2 className="h-12 w-12" style={{ color: '#4CAF50' }} />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#5D4037]">Order Placed Successfully!</h1>
          <p className="text-sm md:text-base text-[#7A5E55] mb-4">
            Thank you for shopping with us. Your order has been confirmed and will be processed shortly.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm" style={{ background: '#FFF8E6', color: '#5D4037' }}>
            <span className="font-semibold">Order ID:</span>
            <span className="font-mono">{order.id || order._id}</span>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Details */}
          <Card className="p-6 border-[1.5px]" style={{ borderColor: '#D4AF76', background: '#FFFFFF' }}>
            <h2 className="text-lg font-bold text-[#5D4037] mb-4">Order Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#F3ECE5' }}>
                <span className="text-sm text-[#7A5E55]">Order Date</span>
                <span className="text-sm font-semibold text-[#3E2723]">
                  {new Date(order.date || order.createdAt).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#F3ECE5' }}>
                <span className="text-sm text-[#7A5E55]">Payment Method</span>
                <span className="text-sm font-semibold text-[#3E2723] capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b" style={{ borderColor: '#F3ECE5' }}>
                <span className="text-sm text-[#7A5E55]">Status</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full" 
                      style={{ background: '#E8F5E9', color: '#2E7D32' }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: '#4CAF50' }}></span>
                  {order.status || 'Confirmed'}
                </span>
              </div>

              <div className="pt-3">
                <p className="text-sm text-[#7A5E55] mb-2">Delivery Address</p>
                <div className="p-3 rounded-lg text-sm" style={{ background: '#FFF8E6' }}>
                  <p className="font-semibold text-[#3E2723]">{order.address?.fullName}</p>
                  <p className="text-[#7A5E55] mt-1">
                    {order.address?.street || `${order.address?.houseNo}, ${order.address?.locality}`}
                  </p>
                  <p className="text-[#7A5E55]">
                    {order.address?.city}, {order.address?.state} - {order.address?.pincode}
                  </p>
                  <p className="text-[#7A5E55] mt-1">Mobile: {order.address?.mobile}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Price Breakdown */}
          <Card className="p-6 border-[1.5px]" style={{ borderColor: '#D4AF76', background: '#FFFFFF' }}>
            <h2 className="text-lg font-bold text-[#5D4037] mb-4">Price Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#7A5E55]">Subtotal</span>
                <span className="font-semibold text-[#3E2723]">₹{order.subtotal?.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-[#7A5E55]">Delivery Charges</span>
                <span className="font-semibold text-[#3E2723]">
                  {order.deliveryCharges === 0 ? (
                    <span style={{ color: '#4CAF50' }}>Free</span>
                  ) : (
                    `₹${order.deliveryCharges?.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-[#7A5E55]">Tax</span>
                <span className="font-semibold text-[#3E2723]">₹0</span>
              </div>

              <div className="my-3 h-[1.5px]" style={{ background: '#D4AF76' }}></div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-[#5D4037]">Total Amount</span>
                <span className="text-2xl font-bold text-[#3E2723]">₹{order.total?.toLocaleString()}</span>
              </div>

              <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: '#FFF8E6', color: '#7A5E55' }}>
                <p className="flex items-start gap-2">
                  <span className="text-[#5D4037] mt-0.5">ℹ</span>
                  <span>You will receive an email confirmation with order tracking details shortly.</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Ordered Items */}
        {order.items && order.items.length > 0 && (
          <Card className="p-6 mt-6 border-[1.5px]" style={{ borderColor: '#D4AF76', background: '#FFFFFF' }}>
            <h2 className="text-lg font-bold text-[#5D4037] mb-4">Ordered Items ({order.items.length})</h2>
            <div className="space-y-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 pb-3 border-b last:border-b-0" style={{ borderColor: '#F3ECE5' }}>
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#F8F8F8' }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-[#3E2723] line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-[#7A5E55] mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm font-bold text-[#5D4037] mt-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Link to="/">
            <Button className="w-full h-12 rounded-lg text-white font-semibold shadow-lg" style={{ background:'#5D4037' }}>
              Continue Shopping
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="outline" className="w-full h-12 rounded-lg border-[1.5px] font-semibold" style={{ borderColor: '#D4AF76' }}>
              Track Order
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
