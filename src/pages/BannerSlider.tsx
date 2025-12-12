import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const BANNER_IMAGES = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dkngwrebq/image/upload/v1765519954/IMG-20251211-WA0059_bu8jpb.jpg",
    alt: "Flat 25% OFF on Gifts",
    title: "",
    subtitle: "",
    link: "/offers/diwali-sale",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dkngwrebq/image/upload/v1765521675/Red_White_and_Gold_Elegant_Christmas_Banner_Landscape_1_vxi2lx.png",
    alt: "Ajmal Luxury Perfumes",
    title: "",
    subtitle: "",
    link: "/category/perfumes",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dkngwrebq/image/upload/v1765519951/IMG-20251211-WA0051_ftfyzo.jpg",
    alt: "Buy 2 Get 1 FREE",
    title: "",
    subtitle: "",
    link: "/offers/buy-2-get-1-free",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dkngwrebq/image/upload/v1765521337/Black_Elegant_Minimalist_Perfume_Presentation_bnbsle.png",
    alt: "Jewelry Collection",
    title: "",
    subtitle: "",
    link: "/category/jewelry",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dkngwrebq/image/upload/v1765521801/Red_Elegant_Christmas_Gift_Banner_gvzi0b.png",
    alt: "Fresh Flower Arrangements",
    title: "",
    subtitle: "",
    link: "/category/flowers",
  },
];

const BannerSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = BANNER_IMAGES.length;
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = useCallback(() => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (deltaX > threshold) {
      goToNext();
    } else if (deltaX < -threshold) {
      goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }, [goToNext, goToPrev]);

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
<div
      className="relative w-full h-[150px] sm:h-[220px] md:h-[500px] overflow-hidden mt-11 sm:mt-4 md:mt-6 rounded-md"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides with fade animation */}
      {BANNER_IMAGES.map((banner, idx) => (
        <Link key={banner.id} to={banner.link}>
          <Card
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover bg-black transition-all"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-3 sm:px-6">
              <h3 className="text-lg sm:text-2xl md:text-5xl font-extrabold mb-1 sm:mb-3 text-white drop-shadow-md leading-tight">
                {banner.title}
              </h3>
              <p className="text-xs sm:text-base md:text-xl font-medium text-white drop-shadow-sm">
                {banner.subtitle}
              </p>
            </div>
          </Card>
        </Link>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 p-2 sm:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full z-20 transition hidden md:block"
      >
        &larr;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 p-2 sm:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full z-20 transition hidden md:block"
      >
        &rarr;
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {BANNER_IMAGES.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full cursor-pointer transition-all ${
              idx === activeIndex
                ? "bg-pink-600 border border-white scale-110"
                : "bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
