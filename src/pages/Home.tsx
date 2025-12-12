import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CATEGORIES } from "@/data/categories"
import { useState, useRef, useEffect,} from "react"
import BannerSlider from "./BannerSlider"
const Home = () => {
  const navigate = useNavigate()
  const [featuredActiveIndex, setFeaturedActiveIndex] = useState(0)
  const [homeDecorActiveIndex, setHomeDecorActiveIndex] = useState(0)
  const [jewelryActiveIndex, setJewelryActiveIndex] = useState(0)

  const featuredScrollRef = useRef<HTMLDivElement>(null)
  const homeDecorScrollRef = useRef<HTMLDivElement>(null)
  const jewelryScrollRef = useRef<HTMLDivElement>(null)
  const beautyScrollRef = useRef<HTMLDivElement>(null)
  const toyScrollRef = useRef<HTMLDivElement>(null)
  const stationaryScrollRef = useRef<HTMLDivElement>(null)
  const featuredGifts = [
    {
      name: "Customized Mug",
      image: "https://www.fnp.com/images/pr/l/v20230918223819/personalized-mug-for-her_1.jpg",
    },
    {
      name: "Scented Candle",
      image: "https://m.media-amazon.com/images/I/81HSydTuXVL.jpg",
    },
    {
      name: "Gift Box",
      image: "https://m.media-amazon.com/images/I/51fgzRAZiRL.jpg",
    },
    {
      name: "Perfume Set",
      image: "https://m.media-amazon.com/images/I/61-x2-oHOvL._AC_UF1000,1000_QL80_.jpg",
    },
  ]

  const homeDecorItems = [
    {
      name: "Wall Clock",
      image: "https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw6ef4a954/images/Titan/Catalog/W0046PA01_1.jpg?sw=800&sh=800",
    },
    {
      name: "Candle Stand",
      image: "https://nestasia.in/cdn/shop/products/DSC6301.jpg?v=1680864642",
    },
    {
      name: "Flower Vase",
      image: "https://m.media-amazon.com/images/I/51LMse-rYWL._AC_UF894,1000_QL80_.jpg",
    },
    {
      name: "Wall Art",
      image: "https://artstreet.in/cdn/shop/files/71U0MNnAYJL._SL1300_f5e7a943-77ad-490d-a338-a1d81ab06ba3_700x700.jpg?v=1755503553",
    },
  ]

  const jewelryItems = [
    {
      name: "Earrings",
      image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSsNWsu2HAvJVxfLzEBWsMvwrSdyv675LhyQjLZR1s4WlnpjctXK27w1sAbp-gvvrdi1-eV12TzfjGj93wwnBcplArYPo8LocF2QukxitDjVKLI3IsGzr8j",
    },
    {
      name: "Necklaces",
      image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTea7KjYKz3mWBxrBGlOYgxIby1yw-fTfvzyXbxvsxOGF-7iS2HDjNJO8P5uE0XU4-dl88pbaU0_1ImIfZRBu1dRWnIBUBG3VH_BRO5e7o_bKgV-MgOoogd3A",
    },
    {
      name: "Bracelets & Bangles",
      image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQpVXo6_Tfea_8RqWRov8dIL2f6Q48kW4DWTCuE9rNVPDpJJWfav5FfawXvWXJpLx7b4Z63q4PuvogdBOjcWhKnisiAbzmbEuKJuwEipA9DK2V4CAE7tE-GP58",
    },
    {
      name: "Rings",
      image: "https://cdn-media.glamira.com/media/product/newgeneration/view/1/sku/sydney016-n1/diamond/diamond-Brillant_AAA/stone2/diamond-Brillant_AAA/alloycolour/yellow.jpg",
    },
  ]

  const beautyItems = [
    {
      name: "Brooches",
      image: "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/66474e1e12f40e3c7f9522ab589263f1.jpg?imageView2/2/w/800/q/70/format/webp",
    },
    {
      name: "Key Chain , Bag Charms",
      image: "https://m.media-amazon.com/images/I/610zXODDvML._AC_UY1000_.jpg",
    },
    {
      name: "Caps And Hats",
      image: "https://i5.walmartimages.com/asr/b3286d6a-a0c4-49fb-8302-6a2c7e48bee9_1.f039201c0336ccf0464e979c24ac54d8.jpeg?odnWidth=1000&odnHeight=1000&odnBg=ffffff",
    },
    {
      name: "Hand Gloves",
      image: "https://m.media-amazon.com/images/I/61yGM1RTA9L._AC_UY1100_.jpg",
    },
  ]

  const toyItems = [
    {
      name: "Teddy Bear",
      image: "https://m.media-amazon.com/images/I/41xJambIv2L._AC_UF1000,1000_QL80_.jpg",
    },
    {
      name: "Remote Car",
      image: "https://m.media-amazon.com/images/I/61Ny+lQg+TL._AC_UF1000,1000_QL80_.jpg",
    },
    {
      name: "Building Blocks",
      image: "https://rukminim2.flixcart.com/image/480/480/xif0q/block-construction/h/u/3/200-piece-classic-big-building-bricks-large-toy-blocks-original-imahaeyp4qhn4vfy.jpeg?q=90",
    },
    {
      name: "Doll Set",
      image: "https://m.media-amazon.com/images/I/81DI+QuY4zL.jpg",
    },
  ]
  const stationaryItems = [
    {
      name: "Hairbands",
      image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQd_PGhzXxzKXmtvfXsYfeoW8MDhKP-7W8AgXt9HhMi14bShNmCxc-KBNxGVF4zrZBfGM9xiz1HOiN-IPRrzrYhVGhZj82_ZC3yvtHu1fR0_wNiIHOREcmI_KHY",
    },
    {
      name: "Scrunchies",
      image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQYxqdOXpmJKsBrtfbB7ePxzprCQUMGCa_OI13e9G0odceT4h_HFTY8FdCYbZ3_x3We2mFcM25iy0gxTNCvxzq-NWA4a9DCp4n-HK_jgDM34B_EdvI_WcLpaFfu",
    },
    {
      name: "Claw Clips",
      image: "https://jewelsmars.com/cdn/shop/files/3B9120E1-9779-4FD4-80CF-0C84013D746C.jpg?v=1729679011",
    },
    {
      name: "Hair Pins & Barrettes",
      image: "https://images-cdn.ubuy.co.in/66856064ad5d1a0d92061382-vintage-retro-hair-stick-hairpin-long.jpg",
    },
  ]
  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    setActiveIndex: (index: number) => void,
    itemsLength: number
  ) => {
    if (!ref.current) return
    const scrollLeft = ref.current.scrollLeft
    const itemWidth = ref.current.scrollWidth / itemsLength
    const index = Math.round(scrollLeft / itemWidth)
    setActiveIndex(index)
  }

  useEffect(() => {
    const featuredRef = featuredScrollRef.current
    const homeDecorRef = homeDecorScrollRef.current
    const jewelryRef = jewelryScrollRef.current

    const handleFeaturedScroll = () =>
      handleScroll(featuredScrollRef, setFeaturedActiveIndex, featuredGifts.length)
    const handleHomeDecorScroll = () =>
      handleScroll(homeDecorScrollRef, setHomeDecorActiveIndex, homeDecorItems.length)
    const handleJewelryScroll = () =>
      handleScroll(jewelryScrollRef, setJewelryActiveIndex, jewelryItems.length)

    featuredRef?.addEventListener("scroll", handleFeaturedScroll)
    homeDecorRef?.addEventListener("scroll", handleHomeDecorScroll)
    jewelryRef?.addEventListener("scroll", handleJewelryScroll)

    return () => {
      featuredRef?.removeEventListener("scroll", handleFeaturedScroll)
      homeDecorRef?.removeEventListener("scroll", handleHomeDecorScroll)
      jewelryRef?.removeEventListener("scroll", handleJewelryScroll)
    }
  }, [])

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
      <Header />

      <main className="w-full p-0 pb-24 md:pb-8">

        <BannerSlider />
        {/* <div 
          className="relative w-full" 
          style={{ margin: 0, padding: 0 }} 
        >
         <Card 
           className="banner-card h-[300px] md:h-[500px] w-full relative overflow-hidden rounded-none">
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
           
            <div style={{ 
              position: "relative", 
              zIndex: 10, 
              padding: "2.5rem 1.5rem", 
              color: "#fff", 
              textAlign: "center", 
              display: "flex", 
              flexDirection: "column", 
              justifyContent: "center", 
              height: "100%" 
            }}>
             
            </div>
          </Card>
        </div> */}

        {/* Categories Section - Compact Icons */}
        <section className="mb-4 px-0">
          <div className="text-center mb-6 mt-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-[2px] w-10 bg-gradient-to-r from-transparent to-[#D4AF76]"></div>
              <h2 className="text-2xl md:text-4xl font-bold text-[#5D4037]">Shop by Category</h2>
              <div className="h-[2px] w-10 bg-gradient-to-l from-transparent to-[#D4AF76]"></div>
            </div>
          </div>

          {/* Super tight horizontal grid */}

          {/* Mobile View */}
          <div className="md:hidden space-y-4">

            {/* First Row */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <div key={cat.id} className="flex-shrink-0 text-center">
                  <Link to={`/category/${cat.slug}`}>
                    <div
                      className="relative rounded-lg overflow-hidden page-card mb-1
                      w-[80px] h-[80px]"
                      style={{
                        border: "1.5px solid #D0D0D0",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <img
                        src={cat.image || "/placeholder.svg"}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  <div className="text-[14px] font-semibold text-center leading-tight text-[#5D4037]">
            {(() => {
              const words = cat.name.split(" ");
              const lines = [];
              let temp = "";

              words.forEach((word) => {
                if (word.length <= 3) {
                  // chote words previous ke saath join karo
                  temp += (temp ? " " : "") + word;
                } else {
                  if (temp) lines.push(temp); // previous temp push karo
                  temp = word; // current word store karo
                }
              });

              if (temp) lines.push(temp); // last temp push karo

              return lines.map((line, i) => <div key={i}>{line}</div>);
            })()}
          </div>

                  </Link>
                </div>
              ))}
            </div>

            {/* Second Row */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
              {CATEGORIES.slice(6, 12).map((cat) => (
                <div key={cat.id} className="flex-shrink-0 text-center">
                  <Link to={`/category/${cat.slug}`}>
                    <div
                      className="relative rounded-lg overflow-hidden page-card mb-1
                      w-[80px] h-[80px]"
                      style={{
                        border: "1.5px solid #D0D0D0",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <img
                        src={cat.image || "/placeholder.svg"}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  <div className="text-[14px] font-semibold text-center leading-tight text-[#5D4037]">

                    {(() => {
                      const words = cat.name.split(" ");
                      const lines = [];
                      let temp = "";

                      words.forEach((word) => {
                        if (word.length <= 3) {
                          // chote words previous ke saath join karo
                          temp += (temp ? " " : "") + word;
                        } else {
                          if (temp) lines.push(temp); // previous temp push karo
                          temp = word; // current word store karo
                        }
                      });

                      if (temp) lines.push(temp); // last temp push karo

                      return lines.map((line, i) => <div key={i}>{line}</div>);
                    })()}
                  </div>

                  </Link>
                </div>
              ))}
            </div>
          </div>
          
            {/* Desktop View */}
           <div className="hidden md:grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-y-6 gap-x-1 justify-items-center">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="text-center transition-transform duration-300 ease-out hover:-translate-y-2"
          >
            <Link to={`/category/${cat.slug}`}>
              <div
                className="relative rounded-lg overflow-hidden page-card mb-2
                w-[100px] h-[100px] hover:shadow-lg"
                style={{
                  border: "1.5px solid #D0D0D0",
                  transition: "all 0.3s ease",
                }}
              >
                <img
                  src={cat.image || "/placeholder.svg"}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-[12px] font-semibold text-center leading-tight text-[#5D4037]">
                {cat.name}
              </div>
            </Link>
          </div>
        ))}
      </div> 
        </section>




        {/* Featured Gifts Section */}
        <section
          className="w-full py-8"
          style={{ backgroundColor: "#F3ECE5" }}
        >
          {/* Section Heading */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2 px-4">
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#C18E63]"></div>
              <h2 className="text-3xl font-serif text-[#3E2723] font-semibold">
                Featured Gifts
              </h2>
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#C18E63]"></div>
            </div>
            <Link
              to="/category/gift-items"
              className="text-sm text-[#B94C63] font-semibold underline-offset-2 hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Cards Grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-10"
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {featuredGifts.map((item, idx) => (
              <Link
                key={idx}
                to={`/category/gift-items/${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  key={idx}
                  className="bg-[#FFFFFF]  shadow-md  hover:shadow-lg  transition-all  duration-300  flex flex-col  border-[6px]  border-white  rounded-none h-[300px] md:h-[440px]"
                >

                  {/* Image Section */}
                  <div
                    className="relative overflow-hidden flex-shrink-0 md:h-[70%] h-[65%]" // 🔹 slightly smaller image for mobile
                    style={{
                      border: "3px solid #FFFFFF",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Text Section */}
                  <div className="text-center py-2 flex-grow flex flex-col justify-center">
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

  {/* Banner grid*/} {/*bg-[#EDE5DF] */}
 <div className="w-full bg-white px-4 py-6">
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

    {/* Left Big Image */}
    <div className="md:col-span-3 relative group">
      <img
        src="https://res.cloudinary.com/dkngwrebq/image/upload/v1765519953/IMG-20251211-WA0064_taynue.jpg"
        alt="Calendar"
        className="w-full h-[220px] md:h-[500px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
      />
      {/* <h2 className="absolute top-4 left-6 text-lg md:text-2xl font-semibold text-[#B67A43]">
        Calendar
      </h2> */}
      <button onClick={() => navigate('/category')} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full shadow-lg transition-transform group-hover:scale-105">
        Explore Now
      </button>
    </div>

    {/* Right Side */}
    <div className="md:col-span-2 flex flex-col gap-4">

      {/* Top right image */}
      <div className="relative group">
        <img
          src="https://res.cloudinary.com/dkngwrebq/image/upload/v1765519953/IMG-20251211-WA0062_c1egut.jpg"
          alt="New Year"
          className="w-full h-[180px] md:h-[240px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* <h2 className="absolute top-3 left-6 text-md md:text-xl font-semibold text-[#B67A43]">
          New Year & Christmas
        </h2> */}
        <button onClick={() => navigate('/category')} className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full shadow-lg transition-transform group-hover:scale-105">
          Explore Now
        </button>
      </div>

      {/* Bottom side — 2 images side-by-side on desktop, full width on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

        <div className="relative group">
          <img
            src="https://res.cloudinary.com/dkngwrebq/image/upload/v1765519805/IMG-20251211-WA0057_dqpfik.jpg"
            alt="Season"
            className="w-full h-[180px] md:h-[240px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {/* <h2 className="absolute top-3 left-4 text-md md:text-lg font-semibold text-[#B67A43]">
            Seasons Greetings Card
          </h2> */}
         <button onClick={() => navigate('/category')} className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-2 rounded-full shadow-lg transition-transform group-hover:scale-105 whitespace-nowrap">
          Explore Now
        </button>

        </div>

        <div className="relative group">
          <img
            src="https://res.cloudinary.com/dkngwrebq/image/upload/v1765519954/IMG-20251212-WA0006_w3wnfw.jpg"
            alt="Corporate Gifts"
            className="w-full h-[180px] md:h-[240px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {/* <h2 className="absolute top-3 left-4 text-md md:text-lg font-semibold text-[#B67A43]">
            Corporate Gifts
          </h2> */}
         <button onClick={() => navigate('/category')} className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-black px-5 py-2 rounded-full shadow-lg transition-transform group-hover:scale-105 whitespace-nowrap">
          Explore Now
        </button>

        </div>

      </div>
    </div>
  </div>
</div>


        {/* Home Decor Section */}
        <section className="w-full py-8 ">
          {/* Section Heading */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2 px-4">
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#C18E63]"></div>
              <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] font-semibold">
                Home Decor & Lifestyle
              </h2>
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#C18E63]"></div>
            </div>
            <Link
              to="/category/home-decor"
              className="text-sm text-[#B94C63] font-semibold underline-offset-2 hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Cards Grid */}
          <div
            ref={homeDecorScrollRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-10"
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {homeDecorItems.map((cat, idx) => (
              <Link
                key={idx}
                to={`/category/home-decor/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  key={idx}
                  className="bg-[#F3ECE5] shadow-md hover:shadow-lg transition-all duration-300 flex flex-col border-[8px] border-[#F3ECE5] rounded-none h-[320px] md:h-[440px]"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden flex-shrink-0 h-[65%] md:h-[70%] border-[3px] border-white bg-white">
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Text Section */}
                  <div className="text-center py-2 flex-grow flex flex-col justify-center">
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </section>



        {/* Offer Banner 2 - Full Width */}
        <div className="w-full mb-6">
    <Link
    to="/category/flower"
    className="block"
  >
    <Card
      className="relative overflow-hidden rounded-none h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px]"
    >
      {/* Background Image */}
      <img
        src="https://res.cloudinary.com/dkngwrebq/image/upload/v1765519953/IMG-20251211-WA0055_u8qdql.jpg"
        alt="Buy 2 Get 1 FREE"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </Card>
  </Link>
        </div>




        {/* Jewelry & Accessories Section */}
        <section
          className="w-full py-8"
          style={{ backgroundColor: "#FFF8F0" }}
        >
          {/* Section Heading */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2 px-4">
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#D4AF76]"></div>
              <h2 className="text-2xl md:text-3xl font-serif text-[#5D4037] font-semibold">
                Jewelry & Accessories
              </h2>
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#D4AF76]"></div>
            </div>
            <Link
              to="/category/jewelry"
              className="text-sm text-[#ff0066] font-semibold underline-offset-2 hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Cards Grid (Same as Featured Gifts) */}
          <div
            ref={jewelryScrollRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-10"
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {jewelryItems.map((cat, idx) => (
              <Link
                key={idx}
                to={`/category/jewelry/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className="bg-[#FFFFFF] shadow-md hover:shadow-lg transition-all duration-300 flex flex-col border-[6px] border-white rounded-none h-[300px] md:h-[440px]"
                >
                  {/* Image Section */}
                  <div
                    className="relative overflow-hidden flex-shrink-0 md:h-[70%] h-[65%]"
                    style={{
                      border: "3px solid #FFFFFF",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Text Section */}
                  <div className="text-center py-2 flex-grow flex flex-col justify-center">
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* Final Offer Banner - 3 Full Width */}
        <div className="w-full mb-0">

            <Link
    to="/category/jewelry"
    className="block"
  >
          <Card
            className="relative overflow-hidden rounded-none h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px]"
          >
            {/* Background Image */}
            <img
              src="https://res.cloudinary.com/dkngwrebq/image/upload/v1765519954/IMG-20251212-WA0005_sfru9e.jpg"
              alt="FREE Shipping"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black/30"></div> */}

            {/* Text Content */}
            {/* <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 h-full">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                🚚 FREE Shipping Above ₹499!
              </h3>
              <p className="text-sm sm:text-base">
                Shop now and save on delivery charges
              </p>
            </div> */}
          </Card>
          </Link>
        </div>


        {/* Delightful Toy Gifts */}

        <section className="w-full py-8 ">
          {/* Section Heading */}
          <div className="text-center mb-8 ">
            <div className="flex items-center justify-center gap-4 mb-2 px-4 ">
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#C18E63]"></div>
              <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] font-semibold">
                Delightful Toy Gifts
              </h2>
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#C18E63]"></div>
            </div>
            <Link
              to="/category/toys"
              className="text-sm text-[#B94C63] font-semibold underline-offset-2 hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Cards Grid */}
          <div
            ref={toyScrollRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-10"
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {toyItems.map((cat, idx) => (
              <Link
                key={idx}
                to={`/category/toys/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  key={idx}
                  className="bg-[#F3ECE5] shadow-md hover:shadow-lg transition-all duration-300 flex flex-col border-[8px] border-[#F3ECE5] rounded-none h-[320px] md:h-[440px]"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden flex-shrink-0 h-[65%] md:h-[70%] border-[3px] border-white bg-white">
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Text Section */}
                  <div className="text-center py-2 flex-grow flex flex-col justify-center">
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>


        </section>




        {/* Gifting Stationery & More */}

        <section
          className="w-full py-8"
          style={{ backgroundColor: "#FFF8F0" }}
        >
          {/* Section Heading */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2 px-4">
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#D4AF76]"></div>
              <h2 className="text-2xl md:text-3xl font-serif text-[#5D4037] font-semibold">
                Hair Accessories
              </h2>
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#D4AF76]"></div>
            </div>
            <Link
              to="/category/hair-accessories"
              className="text-sm text-[#ff0066] font-semibold underline-offset-2 hover:underline"
            >
              View All
            </Link>
          </div>


          <div
            ref={jewelryScrollRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-10"
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {stationaryItems.map((cat, idx) => (
              <Link
                key={idx}
                to={`/category/gift-items/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  className="bg-[#FFFFFF] shadow-md hover:shadow-lg transition-all duration-300 flex flex-col border-[6px] border-white rounded-none h-[300px] md:h-[440px]"
                >
                  {/* Image Section */}
                  <div
                    className="relative overflow-hidden flex-shrink-0 md:h-[70%] h-[65%]"
                    style={{
                      border: "3px solid #FFFFFF",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Text Section */}
                  <div className="text-center py-2 flex-grow flex flex-col justify-center">
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Final Offer Banner - 4 Full Width */}
        <div className="w-full mb-0">
            <Link
    to="/category/watches"
    className="block"
  >
          <Card
            className="relative overflow-hidden rounded-none h-[280px] sm:h-[380px] md:h-[450px] lg:h-[500px]"
          >
            {/* Background Image */}
            <img
              src="https://res.cloudinary.com/dkngwrebq/image/upload/v1765519954/IMG-20251211-WA0059_bu8jpb.jpg"
              alt="FREE Shipping"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            {/* <div className="absolute inset-0 bg-black/30"></div> */}

            {/* Text Content */}
            {/* <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 h-full">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                🚚 FREE Shipping Above ₹499!
              </h3>
              <p className="text-sm sm:text-base">
                Shop now and save on delivery charges
              </p>
            </div> */}
          </Card>
          </Link>
        </div>


        {/* Beauty & Fragrance Collection */}

        <section className="w-full py-8 ">
          {/* Section Heading */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-2 px-4">
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#C18E63]"></div>
              <h2 className="text-2xl md:text-3xl font-serif text-[#3E2723] font-semibold">
                Fashion Accessories
              </h2>
              <div className="flex-1 max-w-[250px] h-[1px] bg-[#C18E63]"></div>
            </div>
            <Link
              to="/category/bags-wallets"
              className="text-sm text-[#B94C63] font-semibold underline-offset-2 hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Cards Grid */}
          <div
            ref={beautyScrollRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-10 cursor-pointer"
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
            }}
          >
            {beautyItems.map((cat, idx) => (
              <Link
                key={idx}
                to={`/category/bags-wallets/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div
                  key={idx}
                  className="bg-[#F3ECE5] shadow-md hover:shadow-lg transition-all duration-300 flex flex-col border-[8px] border-[#F3ECE5] rounded-none h-[320px] md:h-[440px]"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden flex-shrink-0 h-[65%] md:h-[70%] border-[3px] border-white bg-white">
                    <img
                      src={cat.image || "/placeholder.svg"}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Text Section */}
                  <div className="text-center py-2 flex-grow flex flex-col justify-center">
                    <h3 className="text-xs md:text-sm font-medium text-gray-800 truncate">
                      {cat.name}
                    </h3>
                  </div>
                </div>
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