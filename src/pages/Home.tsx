import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const Home = () => {
  const categories = [
    {
      id: 1,
      name: "Diwali Gifts",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwlai_rqgu8e.jpg",
      date: "20th Oct",
    },
    {
      id: 2,
      name: "Birthday Gifts",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_134903_wljjgp.png",
    },
    {
      id: 3,
      name: "Bhai Dooj",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwali2_qdaxy2.jpg",
      date: "23rd Oct",
    },
    {
      id: 4,
      name: "Flowers",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134440_e48sou.png",
    },
    {
      id: 5,
      name: "Same Day...",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863146/Screenshot_2025-10-19_135647_hjtbob.png",
    },
    {
      id: 6,
      name: "FNP Luxe",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863176/Screenshot_2025-10-19_134405_e8qlnl.png",
      badge: "SELECT CITIES ONLY",
    },
    {
      id: 7,
      name: "Hatke Gifts",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863176/Screenshot_2025-10-19_134348_zfa066.png",
    },
    {
      id: 8,
      name: "Home Decor",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863144/Screenshot_2025-10-19_135449_n30nqt.png",
    },
    {
      id: 9,
      name: "Anniversary",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_135136_xz56f7.png",
    },
  ]

  const diwaliCategories = [
    {
      name: "Gift Hampers",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863175/Screenshot_2025-10-19_134336_kllm3w.png",
    },
    {
      name: "Sweets",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134541_fvmgyj.png",
    },
    {
      name: "Dry Fruits",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134629_sknntv.png",
    },
    {
      name: "Chocolates",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134704_ttd0zk.png",
    },
    {
      name: "Home Decor",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863144/Screenshot_2025-10-19_135551_jccq64.png",
    },
    {
      name: "Diyas",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_135028_om782n.png",
    },
  ]

  const birthdayCategories = [
    {
      name: "Cakes",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_134903_wljjgp.png",
    },
    {
      name: "Flowers",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134440_e48sou.png",
    },
    {
      name: "Personalised",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134814_scppzd.png",
    },
    {
      name: "Experiences",
      image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863176/Screenshot_2025-10-19_134405_e8qlnl.png",
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
      `}</style>
      <Header />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* Hero Banners */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {/* Banner Cards with full opacity */}
          {[
            {
              src: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwlai_rqgu8e.jpg",
              title: "Celebrate Dil Ki Diwali",
              date: "20TH - 21ST OCTOBER",
              desc: "Festive blessings and sweet delights!",
            },
            {
              src: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwali2_qdaxy2.jpg",
              title: "Bhai Jaisa, Dooja Nahi",
              date: "23RD OCTOBER | BHAI DOOJ",
              desc: "Celebrate your bond with festive delights!",
            },
          ].map((banner, idx) => (
            <Card
              key={idx}
              className="page-card banner-card"
              style={{ position: "relative", overflow: "hidden", borderRadius: "20px" }}
            >
              <img
                src={banner.src || "/placeholder.svg"}
                alt="Banner"
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
                <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>{banner.date}</p>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>{banner.title}</h2>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>{banner.desc}</p>
                <Button className="primary-btn" style={{ color: "#fff" }}>
                  ORDER NOW
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Categories */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          {categories.map((cat) => (
            <div key={cat.id} style={{ textAlign: "center" }}>
              <Link to={`/category/${cat.name.toLowerCase().replace(/\s/g, "-")}`}>
                <Card className="page-card" style={{ position: "relative", borderRadius: "20px", overflow: "hidden" }}>
                  <img
                    src={cat.image || "/placeholder.svg"}
                    alt={cat.name}
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                  {cat.date && (
                    <span
                      className="badge-bounce"
                      style={{
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        backgroundColor: "#ff0077",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {cat.date}
                    </span>
                  )}
                  {cat.badge && (
                    <span
                      className="badge-bounce"
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "#FFD700",
                        color: "#000",
                        padding: "2px 6px",
                        fontSize: "10px",
                        fontWeight: "600",
                        borderRadius: "6px",
                      }}
                    >
                      {cat.badge}
                    </span>
                  )}
                  <div style={{ padding: "8px", fontWeight: "600", fontSize: "0.9rem" }}>{cat.name}</div>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Diwali Surprises Section - RESPONSIVE FIX */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Diwali Surprises</h2>

          <div
            className="diwali-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "16px",
            }}
          >
            {/* Main Poster Card */}
            <Card
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
            </Card>

            {/* Right Side Small Square Boxes - 2 Columns with 3 boxes each */}
            <div
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
        </section>

        {/* Birthday Gifts Section */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Birthday Gifts That Wow</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
            {birthdayCategories.map((cat, idx) => (
              <Link key={idx} to={`/category/birthday-${cat.name.toLowerCase()}`}>
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

        {/* Popular in Gifting */}
        <section style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>Popular In Gifting</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Link key={item} to="/products">
                <Card className="page-card" style={{ borderRadius: "20px", overflow: "hidden" }}>
                  <img
                    src="https://res.cloudinary.com/dtbelwhff/image/upload/v1760863176/Screenshot_2025-10-19_134348_zfa066.png"
                    alt="Gift"
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                  <div style={{ padding: "8px", textAlign: "center", fontWeight: 600 }}>Gift Item {item}</div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
