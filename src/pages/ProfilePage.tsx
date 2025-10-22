import React, { useEffect, useState } from "react";
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
} from "lucide-react";

// 1. Define a TypeScript interface for your user data
interface UserProfile {
  name: string;
  email: string;
  createdAt: string; // Assuming createdAt is a string (like an ISO date string)
  // Add any other fields you get from your API here
  // e.g., avatarUrl?: string;
}

const ProfilePage = () => {
  // 2. Type your state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // For better error handling

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT stored after login
        if (!token) {
          throw new Error("No authorization token found. Please log in.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get<UserProfile>( // Type the expected response
          "http://localhost:5000/api/users/profile",
          config
        );
        setUser(data);
      } catch (err: any) { // Catch and handle errors
        console.error("Error fetching profile:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load profile. Please try again."
        );
      } finally {
        setLoading(false); // This always runs
      }
    };
    fetchProfile();
  }, []);

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
              <button className="mt-6 w-full bg-gray-800 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
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
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="border-b border-gray-200 p-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Order Summary
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Stat 1: Total Orders */}
                <div className="bg-blue-50 p-5 rounded-lg">
                  <Package className="h-7 w-7 text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-blue-800">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">5</p>
                </div>

                {/* Stat 2: Last Purchase */}
                <div className="bg-green-50 p-5 rounded-lg">
                  <Clock className="h-7 w-7 text-green-600 mb-2" />
                  <p className="text-sm font-medium text-green-800">
                    Last Purchase
                  </p>
                  <p className="text-xl font-semibold text-gray-900 pt-3">
                    2 days ago
                  </p>
                </div>

                {/* Stat 3: Most Purchased */}
                <div className="bg-yellow-50 p-5 rounded-lg">
                  <Star className="h-7 w-7 text-yellow-600 mb-2" />
                  <p className="text-sm font-medium text-yellow-800">
                    Most Purchased
                  </p>
                  <p className="text-lg font-semibold text-gray-900 pt-3 truncate">
                    Wireless Headphones
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-200 p-6">
                <button className="w-full text-center text-blue-600 font-semibold hover:underline">
                  View All Orders
                </button>
              </div>
            </div>

            {/* Mock Address Card */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="border-b border-gray-200 p-6 flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Your Addresses
                </h3>
                <button className="text-sm text-blue-600 font-semibold hover:underline">
                  Manage Addresses
                </button>
              </div>
              <div className="p-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="font-semibold text-gray-800">
                      Default Shipping
                    </span>
                  </div>
                  <p className="text-gray-600 ml-7">
                    123 Innovation Drive,
                    <br />
                    Mohali, Punjab, 140507
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;