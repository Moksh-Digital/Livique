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
const API_BASE_URL =
  `${window.location.protocol}//${window.location.hostname}:5000/api`;


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
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-gray-600" />
        <p className="ml-4 text-xl text-gray-700">Loading Your Profile...</p>
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
        <div className="flex flex-col justify-center items-center min-h-[300px] text-gray-700 bg-gray-100 p-8 rounded-2xl">
          <User className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-2xl font-semibold text-gray-800">
            User not found
          </p>
          <p className="text-gray-600 mt-2">
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
      <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Column 1: Profile & Settings Cards --- */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-28 w-28 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white shadow-md">
                  <User className="h-16 w-16 text-gray-500" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <div className="border-t border-gray-200 w-full my-6" />
              <div className="flex items-center text-gray-700 justify-center">
                <CalendarDays className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium">Joined:</span>
                <span className="ml-2">{joinedDate}</span>
              </div>
              <button className="mt-6 w-full bg-gray-800 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                onClick={() => setShowEditProfileModal(true)}
              >
                Edit Profile
              </button>
            </div>

            {/* Mock Settings Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Account Settings
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="text-gray-700">Login & Security</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </li>
                <li className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
                    <span className="text-gray-700">Payment Methods</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </li>
              </ul>
            </div>
          </div>

          {/* --- Column 2: Order Summary & Address --- */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Order Summary Card - NOW DYNAMICALLY POPULATED */}
<div className="bg-white rounded-2xl shadow-lg">
  <div className="border-b border-gray-200 p-6 flex justify-between items-center">
    <h3 className="text-2xl font-semibold text-gray-900">My Orders</h3>
    <span className="text-gray-600 text-sm">({orders.length} orders)</span>
  </div>

  {orders.length === 0 ? (
    <div className="p-8 text-center text-gray-600">
      <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
      <p className="text-lg font-medium">You haven’t placed any orders yet.</p>
      <p className="text-sm text-gray-500 mt-1">
        Start shopping to see your orders here.
      </p>
    </div>
  ) : (
    <div className="divide-y divide-gray-100">
      {orders.map((order) => (
        <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">
                Order ID: <span className="text-gray-800 font-medium">{order._id}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Ordered on{" "}
                <span className="text-gray-800 font-medium">
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
                    : order.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
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
                className="flex items-center justify-between border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="text-gray-800 font-medium">{item.name}</p>
                    <p className="text-gray-500 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-gray-900 font-semibold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Footer (Total & Actions) */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6">
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
            </div>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <button className="text-blue-600 font-semibold text-sm hover:underline">
                View Invoice
              </button>
              <button className="text-gray-600 font-semibold text-sm hover:underline">
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
<div className="bg-white rounded-2xl shadow-lg">
  <div className="border-b border-gray-200 p-6 flex justify-between items-center">
    <h3 className="text-2xl font-semibold text-gray-900">Your Addresses</h3>
    <button
      className="text-sm text-blue-600 font-semibold hover:underline"
      onClick={() => setShowAddressForm(!showAddressForm)}
    >
      {showAddressForm ? "Cancel" : "Manage Addresses"}
    </button>
  </div>

  <div className="p-6">
    {showAddressForm ? (
      <>
        <h4 className="text-lg font-semibold mb-4">Add New Address</h4>
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
    className="border p-2 w-full rounded"
    value={formData.fullName}
    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
  />
  <input
    placeholder="Phone"
    className="border p-2 w-full rounded"
    value={formData.phone}
    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  />
  <input
    placeholder="Street"
    className="border p-2 w-full rounded"
    value={formData.street}
    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
  />
  <input
    placeholder="City"
    className="border p-2 w-full rounded"
    value={formData.city}
    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
  />
  <input
    placeholder="State"
    className="border p-2 w-full rounded"
    value={formData.state}
    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
  />
  <input
    placeholder="Pincode"
    className="border p-2 w-full rounded"
    value={formData.pincode}
    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
  />
  <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">
    Save Address
  </button>
</form>

      </>
    ) : (
      addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((addr) => (
  <div key={addr._id} className="border p-4 rounded-lg space-y-1">
    <p className="font-semibold">{addr.fullName}</p>
    <p>
      {addr.houseNo ? addr.houseNo + ", " : ""}
      {addr.street ? addr.street + ", " : ""}
      {addr.landmark ? addr.landmark + ", " : ""}
      {addr.locality ? addr.locality + ", " : ""}
      {addr.city ? addr.city + ", " : ""}
      {addr.state ? addr.state + " - " : ""}
      {addr.pincode}
    </p>
    <p className="text-gray-600 text-sm">📞 {addr.mobile}</p>
    {addr.isDefault && (
      <span className="text-green-600 font-medium">Default Address</span>
    )}
  </div>
))}

        </div>
      ) : (
        <p className="text-gray-500">No saved addresses yet.</p>
      )
    )}
  </div>
</div>

          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button
                onClick={() => {
                  setShowEditProfileModal(false);
                  setEditError(null);
                  setEditSuccess(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  disabled={editLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none disabled:bg-gray-100"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={editLoading}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
