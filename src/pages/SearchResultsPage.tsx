import { useEffect, useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Star, Truck, Heart, Search, AlertCircle, ShoppingCart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { useCart } from "@/contexts/CartContext"

interface Product {
  _id: string
  name: string
  price: number
  originalPrice: number
  category: string
  subcategory: string
  images: string[]
  mainImage: string
  description: string
  delivery: string
  rating: number
  reviews: number
  createdAt: string
  updatedAt: string
}
// ✅ AUTO SWITCH API BASE URL
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:5000/api"          // local dev
  : "https://api.livique.co.in/api";    // production = droplet IP



const SearchResultsPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get("keyword") || ""
  const [results, setResults] = useState<Product[]>([])
  const [filteredResults, setFilteredResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [searchInput, setSearchInput] = useState(keyword)
  const [sortBy, setSortBy] = useState("relevance")
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) return
      setLoading(true)
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/products/search?keyword=${keyword}`
        )
        setResults(data)
        // Sort by relevance (name match first, then others)
        const sorted = data.sort((a: Product, b: Product) => {
          const aNameMatch = a.name.toLowerCase().includes(keyword.toLowerCase()) ? 0 : 1
          const bNameMatch = b.name.toLowerCase().includes(keyword.toLowerCase()) ? 0 : 1
          return aNameMatch - bNameMatch
        })
        setFilteredResults(sorted)
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [keyword])

  // Handle sorting
  useEffect(() => {
    let sorted = [...results]
    
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "newest":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "relevance":
      default:
        sorted.sort((a, b) => {
          const aNameMatch = a.name.toLowerCase().includes(keyword.toLowerCase()) ? 0 : 1
          const bNameMatch = b.name.toLowerCase().includes(keyword.toLowerCase()) ? 0 : 1
          return aNameMatch - bNameMatch
        })
    }
    
    setFilteredResults(sorted)
  }, [sortBy, results, keyword])

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ keyword: searchInput })
    }
  }

  const discountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8F0]">
      <Header />

      <style>{`
        .search-card {
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
        }
        .search-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(139, 69, 19, 0.15);
        }
        .search-card img {
          transition: transform 0.4s ease;
        }
        .search-card:hover img {
          transform: scale(1.08);
        }
      `}</style>

      <main className="flex-grow pb-24 md:pb-8">
        <div className="min-h-screen">
          {/* Header Section with Search Bar */}
          <div className="bg-[#7C2A25] sticky top-0 z-10 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Search Results for{" "}
                <span className="text-[#FFD700] font-serif">"<em>{keyword}</em>"</span>
              </h1>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#8B7355]" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search for products..."
                      className="w-full pl-12 pr-4 py-2.5 rounded-lg border-2 border-[#E8D5C4] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#D2691E] text-[#5D4037] placeholder-[#8B7355]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FFD700] hover:bg-[#D4AF76] text-[#5D4037] rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                  >
                    Search
                  </button>
                </div>
              </form>

              <p className="text-sm text-[#F5E6D3]">
                {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-10">
            {filteredResults.length > 0 && (
              <div className="mb-8 flex justify-between items-center flex-col sm:flex-row gap-4">
                <p className="text-[#5D4037] font-medium">
                  Showing <span className="font-bold text-[#8B4513]">{filteredResults.length}</span> products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2.5 border-2 border-[#E8D5C4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] bg-white text-[#5D4037] font-medium hover:border-[#8B4513] transition-colors"
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-[#E8D5C4] border-t-[#8B4513]"></div>
                  <p className="mt-4 text-[#8B7355] font-medium">Finding products...</p>
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {filteredResults.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden border border-gray-200"
                  >
                    {/* Image Container */}
                    <div className="relative bg-gray-50 overflow-hidden aspect-square flex items-center justify-center">
                      <img
                        src={product.mainImage || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col">
                      {/* Product Name */}
                      <h3 className="font-medium text-sm text-gray-800 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-sm font-semibold text-gray-800">{product.rating}</span>
                        <Star size={14} className="fill-green-600 text-green-600" />
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>

                      {/* Price Section */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delivery Info
                      <div className="text-xs text-gray-600">
                        Delivery: <span className="font-medium">{product.delivery}</span>
                      </div> */}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border border-[#E8D5C4] shadow-sm">
                <AlertCircle className="h-16 w-16 text-[#8B7355] mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-semibold text-[#5D4037] mb-2">
                  No products found
                </h2>
                <p className="text-[#8B7355] mb-4">
                  Try searching with different keywords or browse our categories
                </p>
                <Link
                  to="/"
                  className="inline-block px-6 py-2 bg-[#8B4513] hover:bg-[#5D4037] text-white rounded-lg font-semibold transition-colors"
                >
                  Back to Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SearchResultsPage