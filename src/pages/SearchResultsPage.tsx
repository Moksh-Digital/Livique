import { useEffect, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import axios from "axios"
import { Star, Truck, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PromoBanner from "@/components/Banner"

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
  : "http://64.227.146.210:5000/api";    // production = droplet IP



const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get("keyword") || ""
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) return
      setLoading(true)
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/products/search?keyword=${keyword}`
        )
        setResults(data)
      } catch (error) {
        console.error("Error fetching results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [keyword])

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId)
    } else {
      newWishlist.add(productId)
    }
    setWishlist(newWishlist)
  }

  const discountPercentage = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PromoBanner />
      <Header />

      <main className="flex-grow">
        <div className="min-h-screen">
          {/* Header Section */}
          <div className="bg-[#8B4513] sticky top-0 z-10 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-5">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Search Results for{" "}
                <span className="text-[#FFD700]">"{keyword}"</span>
              </h1>
              <p className="text-sm text-[#F5E6D3] mt-1">
                {results.length} products found
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#D2691E]"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#D2691E] transition-all duration-300 flex flex-col group cursor-pointer no-underline"
                  >
                    {/* Image Container */}
                    <div className="relative bg-[#FAFAFA] overflow-hidden h-48 flex items-center justify-center">
                      <img
                        src={product.mainImage || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                      {/* Discount Badge */}
                      {product.originalPrice > product.price && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                          -{discountPercentage(
                            product.originalPrice,
                            product.price
                          )}
                          %
                        </div>
                      )}
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleWishlist(product._id)
                        }}
                        className="absolute top-2 left-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all border border-gray-200"
                      >
                        <Heart
                          size={18}
                          className={
                            wishlist.has(product._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex flex-col flex-grow bg-white">
                      {/* Category */}
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 font-medium">
                        {product.subcategory}
                      </p>

                      {/* Product Name */}
                      <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2 h-10">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-600 line-clamp-1 mb-3">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < Math.floor(product.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="mb-3">
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

                      {/* Delivery Info */}
                      <div className="flex items-center gap-2 text-xs text-green-600 mb-4 bg-green-50 px-2 py-1 rounded">
                        <Truck size={14} />
                        <span className="font-medium">{product.delivery}</span>
                      </div>

                      {/* Add to Cart Button */}
                      <Button className="w-full bg-[#D2691E] hover:bg-[#B8551A] text-white font-semibold py-2 rounded-md transition-colors shadow-sm">
                        Add to Cart
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="text-6xl mb-4"></div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  No products found
                </h2>
                <p className="text-gray-600">
                  Try searching with different keywords
                </p>
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