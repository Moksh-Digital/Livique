import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const Home = () => {
  const categories = [
    { id: 1, name: "Diwali Gifts", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwlai_rqgu8e.jpg", date: "20th Oct" },
    { id: 2, name: "Birthday Gifts", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_134903_wljjgp.png" },
    { id: 3, name: "Bhai Dooj", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwali2_qdaxy2.jpg", date: "23rd Oct" },
    { id: 4, name: "Flowers", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134440_e48sou.png" },
    { id: 5, name: "Same Day...", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863146/Screenshot_2025-10-19_135647_hjtbob.png" },
    { id: 6, name: "FNP Luxe", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863176/Screenshot_2025-10-19_134405_e8qlnl.png", badge: "SELECT CITIES ONLY" },
    { id: 7, name: "Hatke Gifts", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863176/Screenshot_2025-10-19_134348_zfa066.png" },
    { id: 8, name: "Home Decor", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863144/Screenshot_2025-10-19_135449_n30nqt.png" },
    { id: 9, name: "Anniversary", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_135136_xz56f7.png" },
  ];

  const diwaliCategories = [
    { name: "Gift Hampers", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863175/Screenshot_2025-10-19_134336_kllm3w.png" },
    { name: "Sweets", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134541_fvmgyj.png" },
    { name: "Dry Fruits", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134629_sknntv.png" },
    { name: "Chocolates", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134704_ttd0zk.png" },
    { name: "Home Decor", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863144/Screenshot_2025-10-19_135551_jccq64.png" },
    { name: "Diyas", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_135028_om782n.png" },
    { name: "Bhai Dooj Gifts", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863146/Screenshot_2025-10-19_135722_g1cxfr.png" },
    { name: "Send Gifts", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_135110_kky6gh.png" },
  ];

  const birthdayCategories = [
    { name: "Cakes", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863137/Screenshot_2025-10-19_134903_wljjgp.png" },
    { name: "Flowers", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134440_e48sou.png" },
    { name: "Personalised", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863136/Screenshot_2025-10-19_134814_scppzd.png" },
    { name: "Experiences", image: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863176/Screenshot_2025-10-19_134405_e8qlnl.png" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f8" }}>
      <Header />

      <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* Hero Banners */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {/* Banner Cards with full opacity */}
          {[
            { src: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwlai_rqgu8e.jpg", title: "Celebrate Dil Ki Diwali", date: "20TH - 21ST OCTOBER", desc: "Festive blessings and sweet delights!" },
            { src: "https://res.cloudinary.com/dtbelwhff/image/upload/v1760863231/diwali2_qdaxy2.jpg", title: "Bhai Jaisa, Dooja Nahi", date: "23RD OCTOBER | BHAI DOOJ", desc: "Celebrate your bond with festive delights!" },
          ].map((banner, idx) => (
            <Card key={idx} style={{ position: "relative", overflow: "hidden", borderRadius: "20px" }}>
              <img src={banner.src} alt="Banner" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 }} />
              <div style={{ position: "relative", zIndex: 10, padding: "2rem", color: "#fff" }}>
                <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>{banner.date}</p>
                <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>{banner.title}</h2>
                <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>{banner.desc}</p>
                <Button style={{ backgroundColor: "#ff0077", color: "#fff" }}>ORDER NOW</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Categories */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ textAlign: "center" }}>
              <Link to={`/category/${cat.name.toLowerCase().replace(/\s/g, "-")}`}>
                <Card style={{ position: "relative", borderRadius: "20px", overflow: "hidden" }}>
                  <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                  {cat.date && (
                    <span style={{ position: "absolute", top: "8px", left: "8px", backgroundColor: "#ff0077", color: "#fff", padding: "2px 6px", borderRadius: "12px", fontSize: "10px", fontWeight: "600" }}>
                      {cat.date}
                    </span>
                  )}
                  {cat.badge && (
                    <span style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#FFD700", color: "#000", padding: "2px 6px", fontSize: "10px", fontWeight: "600", borderRadius: "6px" }}>
                      {cat.badge}
                    </span>
                  )}
                  <div style={{ padding: "8px", fontWeight: "600", fontSize: "0.9rem" }}>{cat.name}</div>
                </Card>
              </Link>
            </div>
          ))}
        </div>

{/* Diwali Surprises Section */}
<section style={{ marginBottom: "48px" }}>
  <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>
    Diwali Surprises
  </h2>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
    {/* Main Poster Card */}
    <Card
      style={{
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
        height: "100%",
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

    {/* Right Side Small Square Boxes */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
      }}
    >
      {diwaliCategories.map((cat, idx) => (
        <Link
          key={idx}
          to={`/category/diwali-${cat.name.toLowerCase().replace(/\s/g, "-")}`}
        >
          {/* FIX: Reduced height to make boxes smaller */}
          <Card
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              height: "160px", // <-- CHANGED from 250px
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src={cat.image}
              alt={cat.name}
              style={{
                width: "100%",
                height: "125px", // <-- CHANGED from 200px
                objectFit: "cover",
              }}
            />
            <span
              style={{
                width: "100%",
                textAlign: "center",
                fontSize: "0.9rem",
                fontWeight: 600,
                background: "#fff",
                // flexGrow: 1 will automatically fill the remaining space (160px - 125px = 35px)
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
        <Card style={{ borderRadius: "20px", overflow: "hidden" }}>
          <img src={cat.image} alt={cat.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
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
        <Card style={{ borderRadius: "20px", overflow: "hidden" }}>
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
    </div>
  );
};

export default Home;
