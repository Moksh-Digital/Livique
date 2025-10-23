// Gift Shop Categories - Organized for gift business
export const CATEGORIES = [
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    description: "Beautiful accessories and jewelry",
    subcategories: [
      { name: "Bags & Clutches", slug: "bags-clutches" },
      { name: "Scarves & Stoles", slug: "scarves-stoles" },
    ],
  },
  {
    id: "home-lifestyle",
    name: "Home & Lifestyle",
    slug: "home-lifestyle",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    description: "Home decor and lifestyle items",
    subcategories: [
      { name: "Cushions", slug: "cushions" },
      { name: "Candles & Home Fragrances", slug: "candles-home-fragrances" },
    ],
  },
  {
    id: "sale-offers",
    name: "Sale & Offers",
    slug: "sale-offers",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400",
    description: "Special offers and clearance items",
    subcategories: [
      { name: "Clearance Stock", slug: "clearance-stock" },
      { name: "Limited Time Offers", slug: "limited-time-offers" },
    ],
  },
  {
    id: "home-decor-gifting",
    name: "Home Decor",
    slug: "home-decor-gifting",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    description: "Home decor and gifting items",
    subcategories: [
      { name: "Clocks", slug: "clocks" },
      { name: "Show Pieces", slug: "show-pieces" },
      { name: "Scented Candles", slug: "scented-candles" },
      { name: "Indoor Plants", slug: "indoor-plants" },
      { name: "Table Lamps", slug: "table-lamps" },
      { name: "Wall Art", slug: "wall-art" },
      { name: "Posters", slug: "posters" },
    ],
  },
  {
    id: "aesthetic-gifts",
    name: "Aesthetic Gifts",
    slug: "aesthetic-gifts",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    description: "Spiritual and aesthetic wellness items",
    subcategories: [
      { name: "Candles", slug: "candles" },
      { name: "Diffusers", slug: "diffusers" },
      { name: "Crystals", slug: "crystals" },
      { name: "Trays", slug: "trays" },
    ],
  },
  {
    id: "beauty-self-care",
    name: "Beauty & Self Care",
    slug: "beauty-self-care",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    description: "Beauty and self-care products",
    subcategories: [
      { name: "Perfumes", slug: "perfumes" },
      { name: "Skincare Kits", slug: "skincare-kits" },
      { name: "Bath & Body Gift Sets", slug: "bath-body-gift-sets" },
      { name: "Shaving Kits", slug: "shaving-kits" },
      { name: "Makeup Hampers", slug: "makeup-hampers" },
      { name: "Haircare Sets", slug: "haircare-sets" },
      { name: "Spa Hampers", slug: "spa-hampers" },
      { name: "Fragrance Candles", slug: "fragrance-candles" },
      { name: "Essential Oil Sets", slug: "essential-oil-sets" },
      { name: "Relaxation Boxes", slug: "relaxation-boxes" },
    ],
  },
  {
    id: "toys",
    name: "Toys",
    slug: "toys",
    image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400",
    description: "Toys for all ages",
    subcategories: [
      { name: "Teddy Bears", slug: "teddy-bears" },
      { name: "Barbie Dolls", slug: "barbie-dolls" },
      { name: "Mini Toys", slug: "mini-toys" },
      { name: "Toys by Age", slug: "toys-by-age" },
      { name: "Desk Toys", slug: "desk-toys" },
    ],
  },
  {
    id: "customized-gifts",
    name: "Customized Gifts",
    slug: "customized-gifts",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
    description: "Personalized gifts for special moments",
    subcategories: [
      { name: "Customized Mugs", slug: "customized-mugs" },
      { name: "Customized Shirts", slug: "customized-shirts" },
      { name: "Engraved Pens", slug: "engraved-pens" },
    ],
  },
  {
    id: "flowers",
    name: "Flowers",
    slug: "flowers",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400",
    description: "Fresh flowers for every occasion",
    subcategories: [
      { name: "Flower Bouquets", slug: "flower-bouquets" },
      { name: "Flower Baskets", slug: "flower-baskets" },
    ],
  },
  {
    id: "sweets-chocolates",
    name: "Sweets & Chocolates",
    slug: "sweets-chocolates",
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
    description: "Sweet treats and chocolates",
    subcategories: [
      { name: "Chocolates", slug: "chocolates" },
      { name: "Sweets", slug: "sweets" },
    ],
  },
  {
    id: "jewelry-accessories",
    name: "Jewelry & Accessories",
    slug: "jewelry-accessories",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    description: "Beautiful jewelry and accessories",
    subcategories: [
      { name: "Bracelets", slug: "bracelets" },
      { name: "Pendants", slug: "pendants" },
      { name: "Earrings", slug: "earrings" },
      { name: "Wallets & Belts", slug: "wallets-belts" },
      { name: "Handbags & Clutches", slug: "handbags-clutches" },
    ],
  },
];

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string) => {
  return CATEGORIES.find(cat => cat.slug === slug);
};

// Helper function to get subcategory by slug
export const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string) => {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find(sub => sub.slug === subcategorySlug);
};
