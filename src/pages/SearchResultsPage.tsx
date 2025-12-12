import { useEffect, useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { Star, Truck, Heart, Search, AlertCircle, ShoppingCart, Zap, Plus, Minus } from "lucide-react"
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
  const cartCtx: any = useCart() || {}
  const cart = Array.isArray(cartCtx.cart) ? cartCtx.cart : cartCtx.items || []
  const addToCart = cartCtx.addToCart || cartCtx.addItem || cartCtx.add
  const updateQuantity = cartCtx.updateQuantity || cartCtx.setQuantity
  const removeFromCart = cartCtx.removeFromCart || cartCtx.removeItem || cartCtx.remove
  const getTotalItems = cartCtx.getTotalItems || cartCtx.totalItems || (() => (cart || []).reduce((s: any, it: any) => s + (it.quantity || 0), 0))

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

  // helper to get quantity in cart
  const getQuantity = (productId: string) => {
    const item = (cart || []).find((i: any) => i && (i.id === productId || i._id === productId))
    return item ? (item.quantity ?? 0) : 0
  }

  // Handle add to cart
  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    e.preventDefault()
    if (typeof addToCart === "function") {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage || product.images?.[0] || "/placeholder.svg",
        delivery: product.delivery || "Standard",
        deliveryCharge: 0,
      })
    }
  }

  // Handle increment
  const handleIncrement = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    e.preventDefault()
    const current = getQuantity(product._id)
    if (typeof updateQuantity === "function") {
      updateQuantity(product._id, current + 1)
    } else if (typeof addToCart === "function") {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.mainImage || product.images?.[0] || "/placeholder.svg",
        delivery: product.delivery || "Standard",
        deliveryCharge: 0,
      })
    }
  }

  // Handle decrement
  const handleDecrement = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation()
    e.preventDefault()
    const current = getQuantity(product._id)
    if (current <= 1) {
      if (typeof removeFromCart === "function") {
        removeFromCart(product._id)
      } else if (typeof updateQuantity === "function") {
        updateQuantity(product._id, 0)
      }
    } else {
      if (typeof updateQuantity === "function") {
        updateQuantity(product._id, current - 1)
      }
    }
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResults.map((product) => {
                  const isAdded = cart?.some((item) => item.id === product._id || (item as any)._id === product._id)
                  
                  return (
                    <div
                      key={product._id}
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="relative bg-white rounded-lg border border-[#f0e6e2] shadow-sm overflow-hidden"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter") navigate(`/product/${product._id}`); }}
                    >
                      {/* IMAGE AREA */}
                      <div className="relative bg-white p-3 flex items-center justify-center aspect-square">
                        <img
                          src={product.mainImage || product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => e.currentTarget.src = "/placeholder.svg"}
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="px-3 py-2">
                        <h3 className="text-sm font-medium text-[#2b2b2b] line-clamp-2 mb-1">
                          {product.name}
                        </h3>

                        <div className="flex items-center gap-2 text-xs mb-2">
                          <span className="text-sm font-semibold text-[#2b2b2b]">
                            {(product.rating ?? 0).toFixed(1)}
                          </span>
                          <Star size={14} className="fill-green-600 text-green-600" />
                          <span className="text-xs text-[#6b6b6b]">({product.reviews ?? 0})</span>
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-base font-bold text-[#172021]">
                              ₹{product.price?.toLocaleString()}
                            </div>

                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-xs text-[#8B7355] line-through">
                                ₹{product.originalPrice?.toLocaleString()}
                              </div>
                            )}
                          </div>

                          {/* BUTTON - Add / Added */}
                          {isAdded ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white border border-green-600 rounded-md text-sm"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Added</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                handleAdd(e, product)
                              }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e9e2de] rounded-md shadow-sm text-sm hover:shadow-md"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
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