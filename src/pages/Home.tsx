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
    {
      name: "Scented Candles",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    },
    {
      name: "Jewelry",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    },
    {
      name: "Chocolates",
      image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
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
    {
      name: "Candles",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
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
      {/* Show profile if logged in */}
{/* {localStorage.getItem("token") && <ProfilePage />} */}
      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* Hero Banners */}
        {/* Hero Banners */}
<div
  className="
    grid grid-cols-1 md:grid-cols-2 gap-4 mb-8
  "
>
  {/* ✅ Banner 1: Always visible */}
  <Card
    className="page-card banner-card"
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
      <Button className="primary-btn text-white">ORDER NOW</Button>
    </div>
  </Card>

  {/* ✅ Banner 2: Hidden only on mobile */}
  <Card
    className="hidden md:block page-card banner-card"
    style={{ position: "relative", overflow: "hidden", borderRadius: "20px" }}
  >
    <img
      src="https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwali2_qdaxy2.jpg"
      alt="Bhai Jaisa, Dooja Nahi"
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
      <p className="text-sm font-semibold mb-1">23RD OCTOBER | BHAI DOOJ</p>
      <h2 className="text-2xl font-bold mb-1">Bhai Jaisa, Dooja Nahi</h2>
      <p className="text-sm mb-3">Celebrate your bond with festive delights!</p>
      <Button className="primary-btn text-white">ORDER NOW</Button>
    </div>
  </Card>
</div>


        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Categories</h2>
          
          {/* Grid layout for all screen sizes */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="text-center">
                <Link to={`/category/${cat.slug}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow border border-gray-200 page-card aspect-square">
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="text-[12px] sm:text-[14px] font-semibold mt-2 text-center leading-tight">{cat.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </section>


        {/* Diwali Surprises Section - RESPONSIVE FIX */}
        {/* <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Diwali Surprises</h2>

          <div
            className="diwali-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "16px",
            }}
          > */}
            {/* Main Poster Card */}
            {/* <Card
              className="diwali-poster page-card"
              style={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                height: "auto",
                minHeight: "280px",
              }}
            >
              <img
                src="https://res.cloudinary.com/dtbelwhff/image/upload/v1760866242/Screenshot_2025-10-19_145858_wc7sww.png"
                alt="Diwali Poster"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Card> */}

            {/* Right Side Small Square Boxes - 2 Columns with 3 boxes each */}
            {/* <div
              className="diwali-boxes-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridAutoRows: "auto",
                gap: "16px",
              }}
            >
              {diwaliCategories.map((cat, idx) => (
                <Link key={idx} to={`/category/diwali-${cat.name.toLowerCase().replace(/\s/g, "-")}`}>
                  <Card
                    className="page-card"
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: "180px",
                    }}
                  >
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      style={{
                        width: "100%",
                        height: "70%",
                        objectFit: "cover",
                      }}
                    />
                    <span
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background: "#fff",
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px",
                      }}
                    >
                      {cat.name}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {/* Featured Gifts Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Featured Gifts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
            {featuredGifts.map((cat, idx) => (
              <Link key={idx} to={`/category/gifts/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card className="page-card" style={{ borderRadius: "20px", overflow: "hidden" }}>
                  <img
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "8px", textAlign: "center", fontWeight: 600 }}>{cat.name}</div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Home Decor & Lifestyle */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Home Decor & Lifestyle</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
            {homeDecorItems.map((cat, idx) => (
              <Link key={idx} to={`/category/home-decor-gifting/${cat.name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")}`}>
                <Card className="page-card" style={{ borderRadius: "20px", overflow: "hidden" }}>
                  <img
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "8px", textAlign: "center", fontWeight: 600 }}>{cat.name}</div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      {/* Profile Section: only show if user is logged in */}
    </div>
  )
}

export default Home
