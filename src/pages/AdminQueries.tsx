import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader2, AlertCircle, MessageSquare, CheckCircle, Clock } from "lucide-react";

// ✅ AUTO SWITCH API BASE URL
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api"
  : "https://api.livique.co.in/api";

interface Query {
  _id: string;
  name: string;
  email: string;
  phone: string;
  query: string;
  status: "Open" | "Resolved" | "Closed";
  adminReply?: string;
  order: {
    _id: string;
    total: number;
    status: string;
  };
  createdAt: string;
}

const AdminQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"All" | "Open" | "Resolved" | "Closed">("All");

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_BASE_URL}/queries/admin/all`, config);
      setQueries(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch queries");
      console.error("Error fetching queries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!selectedQuery || !replyText.trim()) return;

    setReplyLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(
        `${API_BASE_URL}/queries/${selectedQuery._id}`,
        {
          status: "Resolved",
          adminReply: replyText,
        },
        config
      );

      // Update local state
      setQueries(
        queries.map((q) =>
          q._id === selectedQuery._id
            ? { ...q, status: "Resolved", adminReply: replyText }
            : q
        )
      );

      setReplyText("");
      setSelectedQuery(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredQueries = filterStatus === "All" 
    ? queries 
    : queries.filter((q) => q.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="h-3 w-3" /> Open</span>;
      case "Resolved":
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Resolved</span>;
      case "Closed":
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Closed</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#8B4513]" />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-[#FFF8F0] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5D4037] flex items-center gap-2 md:gap-3">
            <MessageSquare className="h-6 w-6 md:h-8 md:w-8" />
            <span className="hidden sm:inline">Customer Queries</span>
            <span className="sm:hidden">Queries</span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 md:mb-6 overflow-x-auto">
          {["All", "Open", "Resolved", "Closed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex-shrink-0 ${
                filterStatus === status
                  ? "bg-[#8B4513] text-white"
                  : "bg-white text-[#8B4513] border-2 border-[#8B4513] hover:bg-[#FFF8F0]"
              }`}
            >
              {status} ({queries.filter((q) => status === "All" || q.status === status).length})
            </button>
          ))}
        </div>

        {/* Queries List */}
        {filteredQueries.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-[#8B7355] mx-auto mb-4 opacity-50" />
            <p className="text-[#8B7355] text-lg">No queries found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {filteredQueries.map((query) => (
              <div
                key={query._id}
                className="bg-white rounded-lg md:rounded-xl border-2 border-[#E8D5C4] p-3 md:p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedQuery(query)}
              >
                <div className="flex justify-between items-start gap-2 mb-3 md:mb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base md:text-lg font-bold text-[#5D4037] mb-1 truncate">{query.name}</h3>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs sm:text-sm text-[#8B7355] overflow-hidden">
                      <span className="truncate">📧 {query.email}</span>
                      <span className="truncate">📱 {query.phone}</span>
                    </div>
                  </div>
                  {getStatusBadge(query.status)}
                </div>

                <div className="bg-[#FFF8F0] rounded-lg p-2 md:p-3 mb-2 md:mb-3 border border-[#E8D5C4]">
                  <p className="text-xs md:text-sm text-[#5D4037] font-semibold mb-1">Query:</p>
                  <p className="text-xs md:text-sm text-[#8B7355] line-clamp-2">{query.query}</p>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-2 text-xs text-[#8B7355]">
                  <span className="truncate">Order ID: {query.order._id.substring(0, 8)}... | ₹{query.order.total}</span>
                  <span className="flex-shrink-0">{new Date(query.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 md:p-8 border-2 border-[#E8D5C4] my-4 md:my-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#5D4037]">Query Details</h2>
              <button
                onClick={() => {
                  setSelectedQuery(null);
                  setReplyText("");
                }}
                className="text-[#8B7355] hover:text-[#5D4037] transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Customer Info */}
            <div className="bg-[#FFF8F0] rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-[#E8D5C4]">
              <h3 className="text-base md:text-lg font-bold text-[#5D4037] mb-2 md:mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Name</p>
                  <p className="text-sm md:text-base text-[#5D4037] font-semibold truncate">{selectedQuery.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedQuery.status)}</div>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Email</p>
                  <p className="text-xs md:text-sm text-[#5D4037] break-all">{selectedQuery.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Phone</p>
                  <p className="text-sm md:text-base text-[#5D4037] font-semibold">{selectedQuery.phone}</p>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-[#FFF8F0] rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-[#E8D5C4]">
              <h3 className="text-base md:text-lg font-bold text-[#5D4037] mb-2 md:mb-3">Order Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Order ID</p>
                  <p className="text-xs md:text-sm text-[#5D4037] font-mono truncate">{selectedQuery.order._id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Amount</p>
                  <p className="text-sm md:text-base text-[#8B4513] font-bold">₹{selectedQuery.order.total}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8B7355] font-semibold">Status</p>
                  <p className="text-xs md:text-sm text-[#5D4037]">{selectedQuery.order.status}</p>
                </div>
              </div>
            </div>

            {/* Query Message */}
            <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-blue-200">
              <h3 className="text-base md:text-lg font-bold text-blue-900 mb-2">Customer Query</h3>
              <p className="text-xs md:text-sm text-blue-800 whitespace-pre-wrap break-words">{selectedQuery.query}</p>
            </div>

            {/* Admin Reply */}
            {selectedQuery.adminReply && (
              <div className="bg-green-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6 border border-green-200">
                <h3 className="text-base md:text-lg font-bold text-green-900 mb-2">Our Reply</h3>
                <p className="text-xs md:text-sm text-green-800 whitespace-pre-wrap break-words">{selectedQuery.adminReply}</p>
              </div>
            )}

            {/* Reply Form (only if not resolved) */}
            {selectedQuery.status !== "Resolved" && (
              <div className="space-y-3 md:space-y-4 border-t border-[#E8D5C4] pt-4 md:pt-6">
                <h3 className="text-base md:text-lg font-bold text-[#5D4037]">Send Reply</h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                  className="w-full px-3 md:px-4 py-2 border-2 border-[#E8D5C4] rounded-lg text-xs md:text-sm text-[#5D4037] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B4513] resize-none"
                />

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <button
                    onClick={() => {
                      setSelectedQuery(null);
                      setReplyText("");
                    }}
                    className="flex-1 px-4 py-2 sm:py-2.5 border-2 border-[#8B4513] text-[#8B4513] rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#FFF8F0] transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={replyLoading || !replyText.trim()}
                    className="flex-1 px-4 py-2 sm:py-2.5 bg-[#8B4513] text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#5D4037] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {replyLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Sending...</span>
                        <span className="sm:hidden">Send...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Send Reply & Resolve</span>
                        <span className="sm:hidden">Send Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQueries;
