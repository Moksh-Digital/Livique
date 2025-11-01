import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CATEGORIES } from "@/data/categories"
import PromoBanner from "@/components/Banner"

const Home = () => {

  const featuredGifts = [
    {
      name: "Teddy Bears",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    },
    {
      name: "Customized Mugs",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
    },
    {
      name: "Flower Bouquets",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
    },
  ]

  const homeDecorItems = [
    {
      name: "Cushions",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    },
    {
      name: "Indoor Plants",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
    },
    {
      name: "Clocks & Figurines",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    },
  ]

  const jewelryItems = [
    {
      name: "Jewelry",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    },
    {
      name: "Scented Candles",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    },
    {
      name: "Chocolates",
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
    },
  ]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f8" }}>
      <style>{`
        @media (max-width: 767px) {
          .diwali-grid {
            grid-template-columns: 1fr !important;
          }
          .diwali-poster {
            height: 280px !important;
            order: -1;
          }
          .diwali-boxes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 768px) {
          .diwali-grid {
            grid-template-columns: 1fr 2fr !important;
          }
          .diwali-poster {
            height: auto !important;
            min-height: 400px;
          }
        }

        /* Subtle hover system: smaller lift & zoom, stronger shadow depth */
        .page-card {
          transition: transform 220ms cubic-bezier(.2,.9,.25,1), box-shadow 220ms ease;
          will-change: transform;
          cursor: pointer;
          transform: translateZ(0);
        }
        /* small lift, tiny scale — don't move up too much */
        .page-card:hover {
          transform: translateY(-4px) scale(1.008);
          box-shadow: 0 14px 34px rgba(15,23,42,0.10);
        }
        .page-card:active {
          transform: translateY(-2px) scale(1.003);
          box-shadow: 0 8px 18px rgba(15,23,42,0.12);
        }

        /* images get a gentle zoom only */
        .page-card img {
          transition: transform 420ms cubic-bezier(.2,.8,.2,1), filter 220ms ease;
          display: block;
          width: 100%;
          height: auto;
          backface-visibility: hidden;
          transform-origin: center;
        }
        .page-card:hover img {
          transform: scale(1.03);
          filter: brightness(.96);
        }

        /* Banner overlay depth */
        .banner-card {
          position: relative;
          overflow: hidden;
        }
        .banner-card .banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.42));
          opacity: 1;
          transition: opacity 300ms ease, transform 300ms ease;
          pointer-events: none;
        }
        .banner-card:hover .banner-overlay {
          transform: translateY(-2px);
          opacity: 1;
        }

        /* Slightly less aggressive diwali poster zoom */
        .diwali-poster:hover img {
          transform: scale(1.02);
          filter: saturate(1.03);
        }

        /* Primary button: micro motion, gradient shift and arrow reveal */
        .primary-btn {
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease, background-position 300ms ease;
          background-image: linear-gradient(90deg,#ff4d94,#ff0066);
          background-size: 200% 100%;
          background-position: 0% 50%;
          border: none;
          color: #fff !important;
          border-radius: 10px;
          padding: 10px 14px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .primary-btn:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 22px rgba(255,0,119,0.16);
          filter: brightness(1.03);
          background-position: 100% 50%;
        }
        .primary-btn:active {
          transform: translateY(0) scale(0.999);
          box-shadow: 0 6px 14px rgba(0,0,0,0.08);
        }
        /* add subtle arrow that slides in on hover */
        .primary-btn::after {
          content: "→";
          display: inline-block;
          margin-left: 6px;
          opacity: 0;
          transform: translateX(-6px);
          transition: transform 180ms ease, opacity 180ms ease;
          font-weight: 700;
        }
        .primary-btn:hover::after {
          opacity: 1;
          transform: translateX(0);
        }

        /* Accessibility focus */
        .page-card:focus-visible,
        .primary-btn:focus-visible {
          outline: 3px solid rgba(255,0,119,0.14);
          outline-offset: 4px;
        }

        /* Small label polish */
        .badge-bounce {
          transition: transform 220ms ease;
        }
        .page-card:hover .badge-bounce {
          transform: translateY(-2px);
        }

        /* Pressed feel for interactive cards */
        .page-card:active .badge-bounce { transform: translateY(-1px); }

        /* prefer reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .page-card, .page-card img, .primary-btn, .primary-btn::after {
            transition: none !important;
            transform: none !important;
          }
        }

        a { text-decoration: none; color: inherit; }
        
        /* Hide scrollbar for horizontal scroll */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <PromoBanner />
      <Header />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "0" }}>
        {/* Hero Banner
        <div className="px-4 pt-4 pb-0">
          <Card
            className="page-card banner-card mb-0"
            style={{ position: "relative", overflow: "hidden", borderRadius: "20px" }}
          >
            <img
              src="https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwlai_rqgu8e.jpg"
              alt="Celebrate Dil Ki Diwali"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 1,
              }}
            />
            <div className="banner-overlay" />
            <div style={{ position: "relative", zIndex: 10, padding: "2rem", color: "#fff" }}>
              <p className="text-sm font-semibold mb-1">20TH - 21ST OCTOBER</p>
              <h2 className="text-2xl font-bold mb-1">Celebrate Dil Ki Diwali</h2>
              <p className="text-sm mb-3">Festive blessings and sweet delights!</p>
            </div>
          </Card>
        </div> */}

        {/* Offer Banner 1 - Full Width */}
        <div className="w-full mt-4 mb-6">
          <Card 
            className="banner-card" 
            style={{ 
              position: "relative", 
              overflow: "hidden", 
              borderRadius: "0",
              margin: 0,
              height: "250px"
            }}
          >
            <img
              src="https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwali2_qdaxy2.jpg"
              alt="Flat 25% OFF"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 1,
              }}
            />
            <div className="banner-overlay" />
            <div style={{ position: "relative", zIndex: 10, padding: "2.5rem 1.5rem", color: "#fff", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
              <h3 className="text-3xl font-bold mb-2">🎉 Flat 25% OFF on First Order!</h3>
              <p className="text-base">Use code: FIRST25 | Valid till 31st Oct</p>
            </div>
          </Card>
        </div>

        {/* Categories Section - Compact Icons */}
        <section className="mb-8 px-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#D4AF76]"></div>
              <h2 className="text-2xl font-bold text-[#5D4037]">Shop by Category</h2>
              <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#D4AF76]"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {CATEGORIES.slice(0, 8).map((cat) => (
              <div key={cat.id} className="text-center">
                <Link to={`/category/${cat.slug}`}>
                  <div 
                    className="relative rounded-lg overflow-hidden page-card aspect-square mb-2"
                    style={{
                      transition: "all 0.3s ease",
                      border: "2px solid #D0D0D0",
                    }}
                  >
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-[10px] md:text-[11px] font-semibold text-center leading-tight px-1 text-[#5D4037]">
                    {cat.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Gifts Section */}
        <section className="mb-0" style={{ backgroundColor: "#FFF8F0", padding: "2rem 0" }}>
          <div className="mb-5 px-4" style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1 h-[1px] bg-[#D4AF76]"></div>
              <h2 className="text-xl md:text-2xl font-bold text-[#5D4037] px-4">Featured Gifts</h2>
              <div className="flex-1 h-[1px] bg-[#D4AF76]"></div>
            </div>
            <div className="text-center">
              <Link to="/category/gifts" className="text-xs md:text-sm text-[#ff0066] font-semibold hover:underline">
                View All →
              </Link>
            </div>
          </div>
          <div 
            className="flex gap-4 px-4 overflow-x-auto no-scrollbar pb-2" 
            style={{ 
              maxWidth: "1400px", 
              margin: "0 auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {featuredGifts.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/category/gifts/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                style={{ 
                  minWidth: "160px",
                  maxWidth: "160px",
                  scrollSnapAlign: "start"
                }}
              >
                <Card className="page-card" style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: "#FAF3E8", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "10px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#333" }}>{cat.name}</div>
                </Card>
              </Link>
            ))}
          </div>
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {featuredGifts.map((_, idx) => (
              <div 
                key={idx} 
                style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: idx === 0 ? "#ff0066" : "#D0D0D0",
                  transition: "background-color 0.3s ease"
                }}
              />
            ))}
          </div>
        </section>

        {/* Home Decor Section */}
        <section className="mb-0" style={{ backgroundColor: "#ffffff", padding: "2rem 0" }}>
          <div className="mb-5 px-4" style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1 h-[1px] bg-[#D4AF76]"></div>
              <h2 className="text-xl md:text-2xl font-bold text-[#5D4037] px-4">Home Decor & Lifestyle</h2>
              <div className="flex-1 h-[1px] bg-[#D4AF76]"></div>
            </div>
            <div className="text-center">
              <Link to="/category/home-decor" className="text-xs md:text-sm text-[#ff0066] font-semibold hover:underline">
                View All →
              </Link>
            </div>
          </div>
          <div 
            className="flex gap-4 px-4 overflow-x-auto no-scrollbar pb-2" 
            style={{ 
              maxWidth: "1400px", 
              margin: "0 auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {homeDecorItems.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/category/home-decor-gifting/${cat.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")}`}
                style={{ 
                  minWidth: "160px",
                  maxWidth: "160px",
                  scrollSnapAlign: "start"
                }}
              >
                <Card className="page-card" style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: "#F5EFE6", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "10px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#333" }}>{cat.name}</div>
                </Card>
              </Link>
            ))}
          </div>
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {homeDecorItems.map((_, idx) => (
              <div 
                key={idx} 
                style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: idx === 0 ? "#ff0066" : "#D0D0D0",
                  transition: "background-color 0.3s ease"
                }}
              />
            ))}
          </div>
        </section>

        {/* Offer Banner 2 - Full Width */}
        <div className="w-full mb-6">
          <Card 
            className="banner-card" 
            style={{ 
              position: "relative", 
              overflow: "hidden", 
              borderRadius: "0",
              margin: 0,
              height: "250px"
            }}
          >
            <img
              src="https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwlai_rqgu8e.jpg"
              alt="Buy 2 Get 1 FREE"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 1,
              }}
            />
            <div className="banner-overlay" />
            <div style={{ position: "relative", zIndex: 10, padding: "2.5rem 1.5rem", color: "#fff", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
              <h3 className="text-3xl font-bold mb-2">💝 Buy 2 Get 1 FREE!</h3>
              <p className="text-base">On selected gift items | Limited time offer</p>
            </div>
          </Card>
        </div>

        {/* Jewelry & Accessories Section */}
        <section className="mb-0" style={{ backgroundColor: "#FFF8F0", padding: "2rem 0" }}>
          <div className="mb-5 px-4" style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1 h-[1px] bg-[#D4AF76]"></div>
              <h2 className="text-xl md:text-2xl font-bold text-[#5D4037] px-4">Jewelry & Accessories</h2>
              <div className="flex-1 h-[1px] bg-[#D4AF76]"></div>
            </div>
            <div className="text-center">
              <Link to="/category/jewelry" className="text-xs md:text-sm text-[#ff0066] font-semibold hover:underline">
                View All →
              </Link>
            </div>
          </div>
          <div 
            className="flex gap-4 px-4 overflow-x-auto no-scrollbar pb-2" 
            style={{ 
              maxWidth: "1400px", 
              margin: "0 auto",
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {jewelryItems.map((cat, idx) => (
              <Link 
                key={idx} 
                to={`/category/gifts/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                style={{ 
                  minWidth: "160px",
                  maxWidth: "160px",
                  scrollSnapAlign: "start"
                }}
              >
                <Card className="page-card" style={{ borderRadius: "12px", overflow: "hidden", backgroundColor: "#FAF3E8", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "10px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#333" }}>{cat.name}</div>
                </Card>
              </Link>
            ))}
          </div>
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-3">
            {jewelryItems.map((_, idx) => (
              <div 
                key={idx} 
                style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: idx === 0 ? "#ff0066" : "#D0D0D0",
                  transition: "background-color 0.3s ease"
                }}
              />
            ))}
          </div>
        </section>

        {/* Final Offer Banner - Full Width */}
        <div className="w-full mb-0">
          <Card 
            className="banner-card" 
            style={{ 
              position: "relative", 
              overflow: "hidden", 
              borderRadius: "0",
              margin: 0,
              height: "250px"
            }}
          >
            <img
              src="https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwali2_qdaxy2.jpg"
              alt="FREE Shipping"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 1,
              }}
            />
            <div className="banner-overlay" />
            <div style={{ position: "relative", zIndex: 10, padding: "2.5rem 1.5rem", color: "#fff", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
              <h3 className="text-3xl font-bold mb-2">🚚 FREE Shipping Above ₹499!</h3>
              <p className="text-base">Shop now and save on delivery charges</p>
            </div>
          </Card>
        </div>

      </main>
      <Footer />
    </div>
  )
}

export default Home