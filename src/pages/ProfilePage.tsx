import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import {
  User,
  CalendarDays,
  Package,
  Clock,
  Star,
  Loader2,
  AlertCircle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  X,
} from "lucide-react";

// NEW INTERFACE for Order
interface Order {
  _id: string;
  total: number;
  createdAt: string;
  status: string;
  paymentMethod?: string;
  paymentStatus?: string;
  trackingId?: string;
  trackingUpdatedAt?: string;
  shippingAddress?: {
    fullName?: string;
    mobile?: string;
    houseNo?: string;
    street?: string;
    landmark?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    image?: string; // optional product image
  }[];
}


// 1. Define a TypeScript interface for your user data
interface UserProfile {
  name: string;
  email: string;
  createdAt: string; // Assuming createdAt is a string (like an ISO date string)
  // Add any other fields you get from your API here
}

// ✅ AUTO SWITCH API BASE URL
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api"          // local dev
  : "https://api.livique.co.in/api";    // production = droplet IP



const ProfilePage = () => {
  // 2. Type your state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // For better error handling
  const [orders, setOrders] = useState<Order[]>([]); // 👈 STATE FOR ORDERS
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });


useEffect(() => {
  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    console.log("Fetching addresses...");

    const { data } = await axios.get(`${API_BASE_URL}/users/addresses`, {
      
      
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(data);
  };
  fetchAddresses();
}, []);


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token"); // JWT stored after login
      
      if (!token) {
        setError("No authorization token found. Please log in.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        // Fetch User Profile and Orders concurrently using Promise.all
        const [userResponse, ordersResponse] = await Promise.all([
            axios.get<UserProfile>(`${API_BASE_URL}/users/profile`, config),
            
            axios.get<Order[]>(`${API_BASE_URL}/orders/my-orders`, config), // 👈 API call to fetch user's orders
            
        ]);

        setUser(userResponse.data);
        setOrders(ordersResponse.data); // Save fetched orders
        setEditingName(userResponse.data.name); // Initialize editing name

      } catch (err: any) { 
        console.error("Error fetching profile or orders:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load profile or orders. Please check the API connection."
        );
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, []); // Run once on component mount

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!editingName.trim()) {
      setEditError("Name cannot be empty.");
      return;
    }

    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.patch(
        `${API_BASE_URL}/users/profile`,
        
        { name: editingName },
        config
      );

      setUser(prevUser => 
        prevUser ? { ...prevUser, name: response.data.name } : null
      );
      setEditSuccess(true);
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        setShowEditProfileModal(false);
        setEditSuccess(false);
      }, 1500);
    } catch (err: any) {
      setEditError(
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setEditLoading(false);
    }
  };


  // ---------------- ORDER STATISTICS CALCULATION ----------------
  const totalOrders = orders.length;

  // Assumes backend returns orders sorted by createdAt descending
  const lastPurchaseDate = totalOrders > 0 
    ? new Date(orders[0].createdAt)
    : null;
    
  const lastPurchaseDisplay = lastPurchaseDate 
    ? lastPurchaseDate.toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
      })
    : "N/A";
    
  // Find the most frequently purchased item name by aggregating all items across all orders
  const allItems = orders.flatMap(order => order.items);
  const itemCounts = allItems.reduce((acc, item) => {
      // Use item name as key and sum up quantities
      acc[item.name] = (acc[item.name] || 0) + item.quantity; 
      return acc;
  }, {} as Record<string, number>);
  
  const mostPurchasedItem = totalOrders > 0 ? Object.keys(itemCounts).reduce((a, b) => 
      itemCounts[a] > itemCounts[b] ? a : b, 'N/A'
  ) : 'N/A';
  // ---------------- END CALCULATIONS ----------------


  // --- 3. Better Loading State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-[#FFF8F0]">
        <Loader2 className="h-16 w-16 animate-spin text-[#8B4513]" />
        <p className="ml-4 text-xl text-[#5D4037]">Loading Your Profile...</p>
      </div>
    );
  }

  // --- 4. Better Error State ---
  if (error) {
    return (
      <div className="container mx-auto max-w-4xl my-12 p-8">
        <div className="flex flex-col justify-center items-center min-h-[300px] text-red-700 bg-red-50 p-8 rounded-2xl border border-red-200">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p className="text-2xl font-semibold">Oops! Something went wrong.</p>
          <p className="text-lg mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // --- 5. Better "Not Found" State ---
  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl my-12 p-8">
        <div className="flex flex-col justify-center items-center min-h-[300px] text-[#5D4037] bg-[#FFF8F0] p-8 rounded-2xl">
          <User className="h-16 w-16 text-[#8B7355] mb-4" />
          <p className="text-2xl font-semibold text-[#5D4037]">
            User not found
          </p>
          <p className="text-[#8B7355] mt-2">
            We couldn't find a profile. Please try logging in again.
          </p>
        </div>
      </div>
    );
  }

  // --- 6. The Enhanced Profile Page (Success State) ---

  // Fix for "Invalid Date" - check if createdAt exists before parsing
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <>
      <Header />
      <div className="bg-[#FFF8F0] min-h-screen p-4 md:p-8 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5D4037] mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Column 1: Profile & Settings Cards --- */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-[#E8D5C4]">
              <div className="flex justify-center mb-4">
                <div className="h-28 w-28 rounded-full bg-[#F5E6D3] flex items-center justify-center ring-4 ring-[#FFF8F0] shadow-md">
                  <User className="h-16 w-16 text-[#8B4513]" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-[#5D4037]">
                {user.name}
              </h2>
              <p className="text-[#8B7355] mt-1">{user.email}</p>
              <div className="border-t border-[#E8D5C4] w-full my-6" />
              <div className="flex items-center text-[#5D4037] justify-center">
                <CalendarDays className="h-5 w-5 mr-3 text-[#8B4513]" />
                <span className="font-medium">Joined:</span>
                <span className="ml-2">{joinedDate}</span>
              </div>
              <button className="mt-6 w-full bg-[#8B4513] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#5D4037] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-opacity-50"
                onClick={() => setShowEditProfileModal(true)}
              >
                Edit Profile
              </button>
            </div>

            {/* Mock Settings Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4]">
              <h3 className="text-xl font-semibold text-[#5D4037] mb-4">
                Account Settings
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-[#FFF8F0] cursor-pointer">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-3 text-[#8B4513]" />
                    <span className="text-[#5D4037]">Login & Security</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#8B7355]" />
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-[#FFF8F0] cursor-pointer">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-[#8B4513]" />
                    <span className="text-[#5D4037]">Payment Methods</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </li>
              </ul>
            </div>
          </div>

          {/* --- Column 2: Order Summary & Address --- */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Order Summary Card - NOW DYNAMICALLY POPULATED */}
<div className="bg-white rounded-2xl shadow-lg border border-[#E8D5C4]">
  <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-center">
    <h3 className="text-2xl font-semibold text-[#5D4037]">My Orders</h3>
    <span className="text-[#8B7355] text-sm">({orders.length} orders)</span>
  </div>

  {orders.length === 0 ? (
    <div className="p-8 text-center text-[#8B7355]">
      <Package className="mx-auto h-12 w-12 text-[#D4AF76] mb-3" />
      <p className="text-lg font-medium">You haven't placed any orders yet.</p>
      <p className="text-sm text-[#8B7355] mt-1">
        Start shopping to see your orders here.
      </p>
    </div>
  ) : (
    <div className="divide-y divide-gray-100">
      {orders.map((order) => (
        <div key={order._id} className="p-6 hover:bg-[#FFF8F0] transition-colors">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <div>
              <p className="text-sm text-[#8B7355]">
                Order ID: <span className="text-[#5D4037] font-medium">{order._id}</span>
              </p>
              <p className="text-sm text-[#8B7355] mt-1">
                Ordered on{" "}
                <span className="text-[#5D4037] font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "Pending"
                    ? "bg-amber-100 text-amber-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-[#F5E6D3] text-[#5D4037]"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border border-[#E8D5C4] rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#F5E6D3] rounded-md flex items-center justify-center text-[#8B7355] text-sm">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="text-[#5D4037] font-medium">{item.name}</p>
                    <p className="text-[#8B7355] text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-[#5D4037] font-semibold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Footer (Total & Actions) */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6">
            <div>
              <p className="text-[#8B7355] text-sm">Total Amount</p>
              <p className="text-lg font-bold text-[#5D4037]">₹{order.total}</p>
            </div>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <button 
                onClick={() => setSelectedOrder(order)}
                className="text-[#8B4513] font-semibold text-sm hover:underline"
              >
                View Details
              </button>
              <button 
                onClick={() => setTrackingOrder(order)}
                className="text-[#8B7355] font-semibold text-sm hover:underline"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

            
            {/* Mock Address Card */}
<div className="bg-white rounded-2xl shadow-lg border border-[#E8D5C4]">
  <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-center">
    <h3 className="text-2xl font-semibold text-[#5D4037]">Your Addresses</h3>
    <button
      className="text-sm text-[#8B4513] font-semibold hover:underline"
      onClick={() => setShowAddressForm(!showAddressForm)}
    >
      {showAddressForm ? "Cancel" : "Manage Addresses"}
    </button>
  </div>

  <div className="p-6">
    {showAddressForm ? (
      <>
        <h4 className="text-lg font-semibold text-[#5D4037] mb-4">Add New Address</h4>
<form
  onSubmit={async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Map `phone` to `mobile` to match backend schema
    const payload = {
      ...formData,
      mobile: formData.phone,
    };

    try {
      
      await axios.post(`${API_BASE_URL}/users/addresses`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optionally, fetch addresses again instead of reloading
      const { data } = await axios.get(`${API_BASE_URL}/users/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(data);

      setShowAddressForm(false);
      setFormData({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (err: any) {
      console.error("Error saving address:", err.response?.data?.message || err.message);
    }
  }}
  className="space-y-3"
>
  <input
    placeholder="Full Name"
    className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
    value={formData.fullName}
    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
  />
  <input
    placeholder="Phone"
    className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  />
  <input
    placeholder="Street"
    className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
    value={formData.street}
    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
  />
  <input
    placeholder="City"
    className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
    value={formData.city}
    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
  />
  <input
    placeholder="State"
    className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
    value={formData.state}
    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
  />
  <input
    placeholder="Pincode"
    className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
    value={formData.pincode}
    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
  />
  <button className="w-full bg-[#8B4513] text-white py-2 rounded font-semibold hover:bg-[#5D4037] transition-colors">
    Save Address
  </button>
</form>

      </>
    ) : (
      addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr) => (
  <div key={addr._id} className="border border-[#E8D5C4] p-4 rounded-lg space-y-1 hover:bg-[#FFF8F0] transition-colors">
    <p className="font-semibold text-[#5D4037]">{addr.fullName}</p>
    <p className="text-[#8B7355]">
      {addr.houseNo ? addr.houseNo + ", " : ""}
      {addr.street ? addr.street + ", " : ""}
      {addr.landmark ? addr.landmark + ", " : ""}
      {addr.locality ? addr.locality + ", " : ""}
      {addr.city ? addr.city + ", " : ""}
      {addr.state ? addr.state + " - " : ""}
      {addr.pincode}
    </p>
    <p className="text-[#8B7355] text-sm">📞 {addr.mobile}</p>
    {addr.isDefault && (
      <span className="text-green-600 font-medium">Default Address</span>
    )}
  </div>
))}

        </div>
      ) : (
        <p className="text-[#8B7355]">No saved addresses yet.</p>
      )
    )}
  </div>
</div>

          </div>
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-[#E8D5C4]">
            {/* Modal Header */}
            <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-[#5D4037]">Track Order</h2>
                <p className="text-xs text-[#8B7355] mt-1 break-all">Order ID: {trackingOrder._id}</p>
              </div>
              <button
                onClick={() => setTrackingOrder(null)}
                className="text-[#8B7355] hover:text-[#5D4037] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {trackingOrder.trackingId ? (
                <div className="space-y-4">
                  {/* Tracking Available */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <Package className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Order Shipped!</h3>
                    <p className="text-sm text-green-700">Your order is on its way</p>
                  </div>

                  {/* Tracking Information */}
                  <div className="bg-[#FFF8F0] rounded-xl p-4 border border-[#E8D5C4]">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#8B7355] mb-1">Tracking ID</p>
                        <p className="text-[#5D4037] font-mono font-semibold text-lg break-all">
                          {trackingOrder.trackingId}
                        </p>
                      </div>
                      
                      {trackingOrder.trackingUpdatedAt && (
                        <div>
                          <p className="text-xs text-[#8B7355] mb-1">Shipped On</p>
                          <p className="text-[#5D4037] font-medium">
                            {new Date(trackingOrder.trackingUpdatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-[#8B7355] mb-1">Current Status</p>
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {trackingOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      // Copy tracking ID to clipboard
                      navigator.clipboard.writeText(trackingOrder.trackingId!);
                      alert("Tracking ID copied to clipboard!");
                    }}
                    className="w-full px-4 py-2.5 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#5D4037] transition-colors"
                  >
                    Copy Tracking ID
                  </button>

                  <p className="text-xs text-center text-[#8B7355]">
                    Use this tracking ID to track your order with the courier service
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* No Tracking Available */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <Clock className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">Order Confirmed</h3>
                    <p className="text-sm text-amber-700">
                      Tracking number will be shown once the product has been shipped
                    </p>
                  </div>

                  <div className="bg-[#FFF8F0] rounded-xl p-4 border border-[#E8D5C4]">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8B7355]">Order Status</span>
                        <span className="text-[#5D4037] font-semibold">{trackingOrder.status}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8B7355]">Order Date</span>
                        <span className="text-[#5D4037] font-medium">
                          {new Date(trackingOrder.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-[#8B7355] mb-2">
                      We'll send you an email with the tracking details once your order is shipped.
                    </p>
                  </div>

                  <button
                    onClick={() => setTrackingOrder(null)}
                    className="w-full px-4 py-2.5 border-2 border-[#E8D5C4] text-[#5D4037] rounded-lg font-semibold hover:bg-[#FFF8F0] transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100] overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 border-2 border-[#E8D5C4] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-start sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#5D4037]">Order Details</h2>
                <p className="text-xs md:text-sm text-[#8B7355] mt-1 break-all">Order ID: {selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#8B7355] hover:text-[#5D4037] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Order Status & Timeline */}
              <div className="bg-[#FFF8F0] rounded-xl p-4 md:p-5 border border-[#E8D5C4]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs md:text-sm text-[#8B7355] mb-2">Order Status</p>
                    <span
                      className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-full ${
                        selectedOrder.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : selectedOrder.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : selectedOrder.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : selectedOrder.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-[#F5E6D3] text-[#5D4037]"
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#8B7355] mb-2">Order Date</p>
                    <p className="text-[#5D4037] font-semibold text-sm">
                      {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      <span className="block text-xs text-[#8B7355] mt-1">
                        {new Date(selectedOrder.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#8B7355] mb-2">Payment Method</p>
                    <p className="text-[#5D4037] font-semibold text-sm">
                      {selectedOrder.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                  </div>
                </div>

                {/* Tracking Info if available */}
                {selectedOrder.trackingId && (
                  <div className="mt-4 pt-4 border-t border-[#E8D5C4]">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs text-green-700 font-medium mb-1">Tracking ID</p>
                          <p className="text-green-800 font-mono font-bold text-sm break-all">
                            {selectedOrder.trackingId}
                          </p>
                          {selectedOrder.trackingUpdatedAt && (
                            <p className="text-xs text-green-600 mt-2">
                              Shipped on {new Date(selectedOrder.trackingUpdatedAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedOrder.trackingId!);
                            alert("Tracking ID copied!");
                          }}
                          className="text-green-600 hover:text-green-800 text-xs font-semibold underline"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Products Ordered */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#5D4037] mb-4">Products Ordered</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 border border-[#E8D5C4] rounded-lg p-3 hover:bg-[#FFF8F0] transition-colors"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-[#E8D5C4] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F5E6D3] rounded-lg flex items-center justify-center text-[#8B7355] flex-shrink-0">
                          <Package className="h-10 w-10" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#5D4037] font-semibold text-sm md:text-base">{item.name}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                          <p className="text-[#8B7355] text-sm">Qty: <span className="font-medium">{item.quantity}</span></p>
                          <p className="text-[#8B7355] text-sm">Price: <span className="font-medium">₹{item.price}</span></p>
                        </div>
                        <div className="mt-2 sm:hidden">
                          <p className="text-xs text-[#8B7355]">Subtotal</p>
                          <p className="text-lg font-bold text-[#5D4037]">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block flex-shrink-0">
                        <p className="text-xs text-[#8B7355]">Subtotal</p>
                        <p className="text-lg md:text-xl font-bold text-[#5D4037]">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#5D4037] mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                    Shipping Address
                  </h3>
                  <div className="bg-[#FFF8F0] rounded-xl p-4 md:p-5 border border-[#E8D5C4]">
                    <p className="font-semibold text-[#5D4037] text-base md:text-lg mb-2">
                      {selectedOrder.shippingAddress.fullName}
                    </p>
                    <p className="text-[#8B7355] text-sm leading-relaxed">
                      {selectedOrder.shippingAddress.houseNo && `${selectedOrder.shippingAddress.houseNo}, `}
                      {selectedOrder.shippingAddress.street && `${selectedOrder.shippingAddress.street}, `}
                      {selectedOrder.shippingAddress.landmark && `${selectedOrder.shippingAddress.landmark}, `}
                      {selectedOrder.shippingAddress.locality && `${selectedOrder.shippingAddress.locality}, `}
                      {selectedOrder.shippingAddress.city && `${selectedOrder.shippingAddress.city}, `}
                      {selectedOrder.shippingAddress.state && `${selectedOrder.shippingAddress.state} - `}
                      {selectedOrder.shippingAddress.pincode}
                    </p>
                    {selectedOrder.shippingAddress.mobile && (
                      <p className="text-[#8B7355] text-sm mt-2">
                        <span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.mobile}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#5D4037] mb-4">Price Details</h3>
                <div className="bg-[#FFF8F0] rounded-xl p-4 md:p-5 border border-[#E8D5C4] space-y-3">
                  <div className="flex justify-between text-[#8B7355] text-sm">
                    <span>Subtotal ({selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">₹{selectedOrder.total}</span>
                  </div>
                  <div className="flex justify-between text-[#8B7355] text-sm">
                    <span>Delivery Charges</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <div className="border-t border-[#E8D5C4] pt-3 flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-[#5D4037]">Total Amount</span>
                    <span className="text-xl md:text-2xl font-bold text-[#5D4037]">₹{selectedOrder.total}</span>
                  </div>
                  {selectedOrder.paymentStatus && (
                    <div className="flex justify-between items-center pt-2 text-sm">
                      <span className="text-[#8B7355]">Payment Status</span>
                      <span className="text-green-600 font-semibold uppercase">{selectedOrder.paymentStatus}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E8D5C4]">
                <button className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#5D4037] transition-colors text-sm md:text-base">
                  Download Invoice
                </button>
                <button className="flex-1 px-4 md:px-6 py-2.5 md:py-3 border-2 border-[#8B4513] text-[#8B4513] rounded-lg font-semibold hover:bg-[#FFF8F0] transition-colors text-sm md:text-base">
                  Need Help?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 border-2 border-[#E8D5C4]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#5D4037]">Edit Profile</h2>
              <button
                onClick={() => {
                  setShowEditProfileModal(false);
                  setEditError(null);
                  setEditSuccess(false);
                }}
                className="text-[#8B7355] hover:text-[#5D4037] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {editError}
              </div>
            )}

            {editSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                Profile updated successfully!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5D4037] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  disabled={editLoading}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none disabled:bg-[#F5E6D3]"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5D4037] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg bg-[#F5E6D3] text-[#8B7355] cursor-not-allowed"
                />
                <p className="text-xs text-[#8B7355] mt-1">Email cannot be changed</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowEditProfileModal(false);
                    setEditError(null);
                    setEditSuccess(false);
                    setEditingName(user?.name || "");
                  }}
                  disabled={editLoading}
                  className="flex-1 px-4 py-2 border border-[#E8D5C4] text-[#5D4037] rounded-lg font-semibold hover:bg-[#FFF8F0] transition-colors disabled:opacity-50 cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={editLoading}
                  className="flex-1 px-4 py-2 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#5D4037] transition-colors disabled:bg-[#8B7355] disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default ProfilePage;
