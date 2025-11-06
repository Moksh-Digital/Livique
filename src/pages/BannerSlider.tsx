import React, { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"

const BANNER_IMAGES = [
  {
    id: 1,
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFoFdFrzkts19GJplQGP4wJQQDFNv4bYqVGw&s",
    alt: "Flat 25% OFF on Gifts",
    title: "✨ FLAT 25% OFF on all Gifts!",
    subtitle: "Limited time offer - Shop the collection now.",
    link: "/offers/diwali-sale",
  },
  {
    id: 2,
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNVNAGD9JtRzjDKgrVkE6x_h3xBYl4_NFZQw&s",
    alt: "Ajmal Luxury Perfumes",
    title: "Discover Ajmal Luxury Perfumes",
    subtitle: "Where every note whispers eternal luxury.",
    link: "/category/perfumes",
  },
  {
    id: 3,
    src: "https://archiesonline.com/cdn/shop/files/ajmal_banner2.jpg?v=1758024409&width=1880",
    alt: "Buy 2 Get 1 FREE",
    title: "🎁 Buy 2 Get 1 FREE!",
    subtitle: "On selected gift items | Limited time offer.",
    link: "/offers/buy-2-get-1-free",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1974",
    alt: "Jewelry Collection",
    title: "Exclusive Jewelry Collection",
    subtitle: "Perfect pieces for every occasion.",
    link: "/category/jewelry",
  },
  {
    id: 5,
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2um3ybUQ4IGc-WuFlRsggqfnWjRAoB6i0Gg&s",
    alt: "Fresh Flower Arrangements",
    title: "💐 Fresh Flowers for Same Day Delivery",
    subtitle: "Order before 3 PM for express service.",
    link: "/category/flowers",
  },
]

const BannerSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const totalSlides = BANNER_IMAGES.length

  const goToNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % totalSlides)
  }, [totalSlides])

  const goToPrev = () => {
    setActiveIndex((current) => (current - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setActiveIndex(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [goToNext])

  return (
    <div className="relative w-full overflow-hidden mt-6">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${activeIndex * 100}%)`, width: `${totalSlides * 100}%` }}
      >
        {BANNER_IMAGES.map((banner) => (
          <div key={banner.id} className="w-full flex-shrink-0">
            <Link to={banner.link}>
              <Card className="banner-card relative w-full h-[350px] md:h-[500px] overflow-hidden rounded-none">
                {/* Image - Fixed inside container */}
                <img
                  src={banner.src}
                  alt={banner.alt}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" /> {/* optional overlay */}
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
                  <h3 className="text-3xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-md">
                    {banner.title}
                  </h3>
                  <p className="text-base md:text-xl font-medium text-white drop-shadow-sm">
                    {banner.subtitle}
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <button 
        onClick={goToPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 p-3 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full hidden md:block"
      >
        &larr;
      </button>
      <button 
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full hidden md:block"
      >
        &rarr;
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {BANNER_IMAGES.map((_, idx) => (
          <div 
            key={idx} 
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer transition ${
              idx === activeIndex ? "bg-pink-600 border border-white" : "bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default BannerSlider
