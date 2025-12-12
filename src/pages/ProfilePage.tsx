import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";
import {
  User,
  CalendarDays,
  Package,
  Clock,
  Loader2,
  AlertCircle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  X,
  MessageSquare,
} from "lucide-react";

// --- INTERFACES ---

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
    image?: string;
  }[];
}

interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
}

interface Address {
  _id: string;
  fullName: string;
  mobile: string;
  houseNo?: string;
  street?: string;
  landmark?: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface QueryItem {
  _id: string;
  order: Order;
  query: string;
  status: string;
  adminReply?: string;
  createdAt: string;
}

// --- API CONFIG ---
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api"
  : "https://api.livique.co.in/api";

const ProfilePage = () => {
  // --- STATE ---
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [userQueries, setUserQueries] = useState<QueryItem[]>([]);
  
  const [activeTab, setActiveTab] = useState("orders");
  
  // Modals & Forms State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editingName, setEditingName] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<QueryItem | null>(null);
  
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    query: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // --- EFFECTS ---

  // Fetch Addresses separately or part of main load (kept separate as per original logic)
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const { data } = await axios.get<Address[]>(`${API_BASE_URL}/users/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(data);
      } catch (err) {
        console.error("Error fetching addresses", err);
      }
    };
    fetchAddresses();
  }, []);

  // Fetch Main Data
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

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
        const [userResponse, ordersResponse, queriesResponse] = await Promise.all([
          axios.get<UserProfile>(`${API_BASE_URL}/users/profile`, config),
          axios.get<Order[]>(`${API_BASE_URL}/orders/my-orders`, config),
          axios.get<QueryItem[]>(`${API_BASE_URL}/queries/user/my-queries`, config),
        ]);

        setUser(userResponse.data);
        setOrders(ordersResponse.data);
        setUserQueries(queriesResponse.data);
        setEditingName(userResponse.data.name);

      } catch (err: any) {
        console.error("Error fetching profile or orders:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load profile or orders."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- HANDLERS ---

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
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.patch(
        `${API_BASE_URL}/users/profile`,
        { name: editingName },
        config
      );

      setUser((prevUser) =>
        prevUser ? { ...prevUser, name: response.data.name } : null
      );
      setEditSuccess(true);

      setTimeout(() => {
        setShowEditProfileModal(false);
        setEditSuccess(false);
      }, 1500);
    } catch (err: any) {
      setEditError(err.response?.data?.message || err.message || "Failed update.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleSubmitContactForm = async () => {
    if (!contactFormData.phone.trim() || !contactFormData.query.trim()) {
      setContactError("Phone number and query are required.");
      return;
    }
    
    if (!selectedOrder) return; // Safety check

    setContactLoading(true);
    setContactError(null);
    setContactSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(
        `${API_BASE_URL}/queries`,
        {
          orderId: selectedOrder._id,
          name: contactFormData.name,
          email: contactFormData.email,
          phone: contactFormData.phone,
          query: contactFormData.query,
        },
        config
      );

      setContactSuccess(true);
      setShowContactForm(false);
      setContactFormData({ name: "", email: "", phone: "", query: "" });

      setTimeout(() => {
        setSelectedOrder(null);
      }, 2000);
    } catch (err: any) {
      setContactError(
        err.response?.data?.message || err.message || "Failed to submit query."
      );
    } finally {
      setContactLoading(false);
    }
  };

  const openContactForm = () => {
    if (user) {
      setContactFormData({
        name: user.name || "",
        email: user.email || "",
        phone: "",
        query: "",
      });
      setShowContactForm(true);
      setContactError(null);
      setContactSuccess(false);
    }
  };

  // --- LOADING / ERROR STATES ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] bg-[#FFF8F0]">
        <Loader2 className="h-16 w-16 animate-spin text-[#8B4513]" />
        <p className="ml-4 text-xl text-[#5D4037]">Loading Your Profile...</p>
      </div>
    );
  }

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

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl my-12 p-8">
        <div className="flex flex-col justify-center items-center min-h-[300px] text-[#5D4037] bg-[#FFF8F0] p-8 rounded-2xl">
          <User className="h-16 w-16 text-[#8B7355] mb-4" />
          <p className="text-2xl font-semibold text-[#5D4037]">User not found</p>
          <p className="text-[#8B7355] mt-2">Please try logging in again.</p>
        </div>
      </div>
    );
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  // --- RENDER ---
  return (
    <>
      <Header />
      <div className="bg-[#FFF8F0] min-h-screen p-4 md:p-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#5D4037] mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* --- Sidebar --- */}
            <div className="lg:col-span-1">
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
                <button
                  className="mt-6 w-full bg-[#8B4513] text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-[#5D4037] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:ring-opacity-50"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  Edit Profile
                </button>
              </div>

              {/* Mock Settings */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5C4] mt-8">
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

            {/* --- Main Content Area --- */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-2xl p-2 border border-[#E8D5C4] shadow-lg">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === "orders"
                      ? "bg-[#8B4513] text-white"
                      : "bg-transparent text-[#5D4037] hover:bg-[#FFF8F0]"
                  }`}
                >
                  <Package className="h-5 w-5 inline mr-2" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("queries")}
                  className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === "queries"
                      ? "bg-[#8B4513] text-white"
                      : "bg-transparent text-[#5D4037] hover:bg-[#FFF8F0]"
                  }`}
                >
                  <MessageSquare className="h-5 w-5 inline mr-2" />
                  Queries
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`flex-1 min-w-[100px] px-4 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === "addresses"
                      ? "bg-[#8B4513] text-white"
                      : "bg-transparent text-[#5D4037] hover:bg-[#FFF8F0]"
                  }`}
                >
                  <MapPin className="h-5 w-5 inline mr-2" />
                  Addresses
                </button>
              </div>

              {/* Tab: Orders */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-2xl shadow-lg border border-[#E8D5C4]">
                  <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-[#5D4037]">
                      My Orders
                    </h3>
                    <span className="text-[#8B7355] text-sm">
                      ({orders.length} orders)
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-[#8B7355]">
                      <Package className="mx-auto h-12 w-12 text-[#D4AF76] mb-3" />
                      <p className="text-lg font-medium">
                        You haven't placed any orders yet.
                      </p>
                      <p className="text-sm text-[#8B7355] mt-1">
                        Start shopping to see your orders here.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="p-6 hover:bg-[#FFF8F0] transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                            <div>
                              <p className="text-sm text-[#8B7355]">
                                Order ID:{" "}
                                <span className="text-[#5D4037] font-medium">
                                  {order._id}
                                </span>
                              </p>
                              <p className="text-sm text-[#8B7355] mt-1">
                                Ordered on{" "}
                                <span className="text-[#5D4037] font-medium">
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
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
                                    <p className="text-[#5D4037] font-medium">
                                      {item.name}
                                    </p>
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

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6">
                            <div>
                              <p className="text-[#8B7355] text-sm">
                                Total Amount
                              </p>
                              <p className="text-lg font-bold text-[#5D4037]">
                                ₹{order.total}
                              </p>
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
              )}

              {/* Tab: Queries */}
              {activeTab === "queries" && (
                <div className="bg-white rounded-2xl shadow-lg border border-[#E8D5C4]">
                  <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-[#5D4037]">
                      My Queries
                    </h3>
                    <span className="text-[#8B7355] text-sm">
                      ({userQueries.length} queries)
                    </span>
                  </div>

                  {userQueries.length === 0 ? (
                    <div className="p-8 text-center text-[#8B7355]">
                      <MessageSquare className="mx-auto h-12 w-12 text-[#D4AF76] mb-3" />
                      <p className="text-lg font-medium">
                        You haven't submitted any queries yet.
                      </p>
                      <p className="text-sm text-[#8B7355] mt-1">
                        Submit a query through the Contact Us button on your
                        orders.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {userQueries.map((query) => (
                        <div
                          key={query._id}
                          className="p-6 hover:bg-[#FFF8F0] transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <div>
                              <p className="text-sm text-[#8B7355]">
                                Order ID:{" "}
                                <span className="text-[#5D4037] font-medium">
                                  {query.order._id.substring(0, 8)}...
                                </span>
                              </p>
                              <p className="text-sm text-[#8B7355] mt-1">
                                Submitted on{" "}
                                <span className="text-[#5D4037] font-medium">
                                  {new Date(query.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                              </p>
                            </div>
                            <div className="mt-3 sm:mt-0">
                              <span
                                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                  query.status === "Resolved"
                                    ? "bg-green-100 text-green-700"
                                    : query.status === "Open"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {query.status}
                              </span>
                            </div>
                          </div>

                          <div className="bg-[#FFF8F0] rounded-lg p-4 mb-4 border border-[#E8D5C4]">
                            <p className="text-sm text-[#8B7355] font-semibold mb-1">
                              Your Query:
                            </p>
                            <p className="text-[#5D4037]">{query.query}</p>
                          </div>

                          {query.adminReply && (
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                              <p className="text-sm text-green-900 font-semibold mb-1">
                                🎯 Our Reply:
                              </p>
                              <p className="text-green-800">
                                {query.adminReply}
                              </p>
                            </div>
                          )}

                          <button
                            onClick={() => setSelectedQuery(query)}
                            className="mt-4 text-[#8B4513] font-semibold text-sm hover:underline"
                          >
                            View Full Details
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Addresses */}
              {activeTab === "addresses" && (
                <div className="bg-white rounded-2xl shadow-lg border border-[#E8D5C4]">
                  <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-center">
                    <h3 className="text-2xl font-semibold text-[#5D4037]">
                      Your Addresses
                    </h3>
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
                        <h4 className="text-lg font-semibold text-[#5D4037] mb-4">
                          Add New Address
                        </h4>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const token = localStorage.getItem("token");
                            const payload = {
                              ...formData,
                              mobile: formData.phone,
                            };

                            try {
                              await axios.post(
                                `${API_BASE_URL}/users/addresses`,
                                payload,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              // Refresh addresses
                              const { data } = await axios.get(
                                `${API_BASE_URL}/users/addresses`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
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
                              console.error(
                                "Error saving address:",
                                err.response?.data?.message || err.message
                              );
                            }
                          }}
                          className="space-y-3"
                        >
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fullName: e.target.value,
                              })
                            }
                          />
                          <input
                            type="tel"
                            placeholder="Phone"
                            className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            placeholder="Street"
                            className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                            value={formData.street}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                street: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            placeholder="City"
                            className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                            value={formData.city}
                            onChange={(e) =>
                              setFormData({ ...formData, city: e.target.value })
                            }
                          />
                          <input
                            type="text"
                            placeholder="State"
                            className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                            value={formData.state}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                state: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            placeholder="Pincode"
                            className="border border-[#E8D5C4] p-2 w-full rounded focus:ring-2 focus:ring-[#8B4513] focus:border-transparent outline-none"
                            value={formData.pincode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                pincode: e.target.value,
                              })
                            }
                          />
                          <button
                            type="submit"
                            className="w-full bg-[#8B4513] text-white py-2 rounded font-semibold hover:bg-[#5D4037] transition-colors"
                          >
                            Save Address
                          </button>
                        </form>
                      </>
                    ) : (
                      <>
                        {addresses.length > 0 ? (
                          <div className="space-y-4">
                            {addresses.map((addr) => (
                              <div
                                key={addr._id}
                                className="border border-[#E8D5C4] p-4 rounded-lg space-y-1 hover:bg-[#FFF8F0] transition-colors"
                              >
                                <p className="font-semibold text-[#5D4037]">
                                  {addr.fullName}
                                </p>
                                <p className="text-[#8B7355]">
                                  {addr.houseNo ? addr.houseNo + ", " : ""}
                                  {addr.street ? addr.street + ", " : ""}
                                  {addr.landmark ? addr.landmark + ", " : ""}
                                  {addr.locality ? addr.locality + ", " : ""}
                                  {addr.city ? addr.city + ", " : ""}
                                  {addr.state ? addr.state + " - " : ""}
                                  {addr.pincode}
                                </p>
                                <p className="text-[#8B7355] text-sm">
                                  📞 {addr.mobile}
                                </p>
                                {addr.isDefault && (
                                  <span className="text-green-600 font-medium">
                                    Default Address
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[#8B7355]">
                            No saved addresses yet.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Tracking Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-[#E8D5C4]">
            <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-[#5D4037]">
                  Track Order
                </h2>
                <p className="text-xs text-[#8B7355] mt-1 break-all">
                  Order ID: {trackingOrder._id}
                </p>
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
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <Package className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Order Shipped!
                    </h3>
                    <p className="text-sm text-green-700">
                      Your order is on its way
                    </p>
                  </div>

                  <div className="bg-[#FFF8F0] rounded-xl p-4 border border-[#E8D5C4]">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-[#8B7355] mb-1">
                          Tracking ID
                        </p>
                        <p className="text-[#5D4037] font-mono font-semibold text-lg break-all">
                          {trackingOrder.trackingId}
                        </p>
                      </div>

                      {trackingOrder.trackingUpdatedAt && (
                        <div>
                          <p className="text-xs text-[#8B7355] mb-1">
                            Shipped On
                          </p>
                          <p className="text-[#5D4037] font-medium">
                            {new Date(
                              trackingOrder.trackingUpdatedAt
                            ).toLocaleDateString("en-US", {
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
                        <p className="text-xs text-[#8B7355] mb-1">
                          Current Status
                        </p>
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {trackingOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (trackingOrder.trackingId) {
                        navigator.clipboard.writeText(trackingOrder.trackingId);
                        alert("Tracking ID copied to clipboard!");
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#5D4037] transition-colors"
                  >
                    Copy Tracking ID
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <Clock className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-amber-800 mb-2">
                      Order Confirmed
                    </h3>
                    <p className="text-sm text-amber-700">
                      Tracking number will be shown once the product has been
                      shipped
                    </p>
                  </div>

                  <div className="bg-[#FFF8F0] rounded-xl p-4 border border-[#E8D5C4]">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8B7355]">Order Status</span>
                        <span className="text-[#5D4037] font-semibold">
                          {trackingOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#8B7355]">Order Date</span>
                        <span className="text-[#5D4037] font-medium">
                          {new Date(trackingOrder.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
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
            <div className="border-b border-[#E8D5C4] p-6 flex justify-between items-start sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#5D4037]">
                  Order Details
                </h2>
                <p className="text-xs md:text-sm text-[#8B7355] mt-1 break-all">
                  Order ID: {selectedOrder._id}
                </p>
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
                    <p className="text-xs md:text-sm text-[#8B7355] mb-2">
                      Order Status
                    </p>
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
                    <p className="text-xs md:text-sm text-[#8B7355] mb-2">
                      Order Date
                    </p>
                    <p className="text-[#5D4037] font-semibold text-sm">
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-[#8B7355] mb-2">
                      Payment Method
                    </p>
                    <p className="text-[#5D4037] font-semibold text-sm">
                      {selectedOrder.paymentMethod === "COD"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Ordered */}
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#5D4037] mb-4">
                  Products Ordered
                </h3>
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
                        <h4 className="text-[#5D4037] font-semibold text-sm md:text-base">
                          {item.name}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2">
                          <p className="text-[#8B7355] text-sm">
                            Qty:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p className="text-[#8B7355] text-sm">
                            Price:{" "}
                            <span className="font-medium">₹{item.price}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block flex-shrink-0">
                        <p className="text-xs text-[#8B7355]">Subtotal</p>
                        <p className="text-lg md:text-xl font-bold text-[#5D4037]">
                          ₹{item.price * item.quantity}
                        </p>
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
                      {selectedOrder.shippingAddress.houseNo &&
                        `${selectedOrder.shippingAddress.houseNo}, `}
                      {selectedOrder.shippingAddress.street &&
                        `${selectedOrder.shippingAddress.street}, `}
                      {selectedOrder.shippingAddress.landmark &&
                        `${selectedOrder.shippingAddress.landmark}, `}
                      {selectedOrder.shippingAddress.locality &&
                        `${selectedOrder.shippingAddress.locality}, `}
                      {selectedOrder.shippingAddress.city &&
                        `${selectedOrder.shippingAddress.city}, `}
                      {selectedOrder.shippingAddress.state &&
                        `${selectedOrder.shippingAddress.state} - `}
                      {selectedOrder.shippingAddress.pincode}
                    </p>
                    {selectedOrder.shippingAddress.mobile && (
                      <p className="text-[#8B7355] text-sm mt-2">
                        <span className="font-medium">Phone:</span>{" "}
                        {selectedOrder.shippingAddress.mobile}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E8D5C4]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openContactForm();
                  }}
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#5D4037] transition-colors text-sm md:text-base flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-5 w-5" />
                  Contact Us
                </button>
                <button
                  type="button"
                  onClick={() => setTrackingOrder(selectedOrder)}
                  className="flex-1 px-4 md:px-6 py-2.5 md:py-3 border-2 border-[#8B4513] text-[#8B4513] rounded-lg font-semibold hover:bg-[#FFF8F0] transition-colors text-sm md:text-base"
                >
                  View Tracking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Us Modal */}
      {showContactForm && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border-2 border-[#E8D5C4] my-8 z-[10000]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#5D4037]">Contact Us</h2>
              <button
                onClick={() => {
                  setShowContactForm(false);
                  setContactError(null);
                }}
                className="text-[#8B7355] hover:text-[#5D4037] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-[#FFF8F0] rounded-lg border border-[#E8D5C4]">
              <p className="text-xs text-[#8B7355] font-semibold mb-1">
                Order ID
              </p>
              <p className="text-sm font-semibold text-[#5D4037] mb-3">
                {selectedOrder._id}
              </p>
              <p className="text-xs text-[#8B7355] font-semibold mb-1">
                Order Amount
              </p>
              <p className="text-lg font-bold text-[#8B4513]">
                ₹{selectedOrder.total}
              </p>
            </div>

            {contactError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {contactError}
              </div>
            )}

            {contactSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                Query submitted successfully! We'll contact you soon.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={contactFormData.name}
                  disabled
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg bg-[#FFF8F0] text-[#5D4037] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={contactFormData.email}
                  disabled
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg bg-[#FFF8F0] text-[#5D4037] font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={contactFormData.phone}
                  onChange={(e) =>
                    setContactFormData({
                      ...contactFormData,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg text-[#5D4037] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#5D4037] mb-2">
                  Your Query *
                </label>
                <textarea
                  value={contactFormData.query}
                  onChange={(e) =>
                    setContactFormData({
                      ...contactFormData,
                      query: e.target.value,
                    })
                  }
                  placeholder="Please describe your query regarding this order..."
                  rows={4}
                  className="w-full px-4 py-2 border border-[#E8D5C4] rounded-lg text-[#5D4037] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowContactForm(false)}
                className="flex-1 px-4 py-2.5 border-2 border-[#8B4513] text-[#8B4513] rounded-lg font-semibold hover:bg-[#FFF8F0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitContactForm}
                disabled={contactLoading}
                className="flex-1 px-4 py-2.5 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#5D4037] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {contactLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Query"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 border-2 border-[#E8D5C4]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#5D4037]">
                Edit Profile
              </h2>
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
                <p className="text-xs text-[#8B7355] mt-1">
                  Email cannot be changed
                </p>
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

      {/* Query Details Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border-2 border-[#E8D5C4] my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#5D4037]">
                Query Details
              </h2>
              <button
                onClick={() => setSelectedQuery(null)}
                className="text-[#8B7355] hover:text-[#5D4037] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="bg-[#FFF8F0] rounded-lg p-4 mb-6 border border-[#E8D5C4]">
              <h3 className="text-lg font-bold text-[#5D4037] mb-3">
                Order Information
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">
                    Order ID
                  </p>
                  <p className="text-[#5D4037] font-mono text-sm">
                    {selectedQuery.order._id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Amount</p>
                  <p className="text-[#8B4513] font-bold">
                    ₹{selectedQuery.order.total}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Status</p>
                  <p className="text-[#5D4037]">{selectedQuery.order.status}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-[#8B7355] font-semibold mb-2">
                Query Status
              </p>
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                  selectedQuery.status === "Resolved"
                    ? "bg-green-100 text-green-700"
                    : selectedQuery.status === "Open"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {selectedQuery.status}
              </span>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Your Query
              </h3>
              <p className="text-blue-800 whitespace-pre-wrap">
                {selectedQuery.query}
              </p>
            </div>

            {selectedQuery.adminReply ? (
              <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-2">
                  ✓ Our Response
                </h3>
                <p className="text-green-800 whitespace-pre-wrap">
                  {selectedQuery.adminReply}
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-200">
                <p className="text-amber-800">
                  ⏳ We're reviewing your query. Our team will respond shortly.
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedQuery(null)}
              className="w-full px-4 py-2.5 bg-[#8B4513] text-white rounded-lg font-semibold hover:bg-[#5D4037] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;