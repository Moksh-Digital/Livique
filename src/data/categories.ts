// Gift Shop Categories - Updated structure
export const CATEGORIES = [
  {
    id: "home-decor",
    name: "Home Decor",
    slug: "home-decor",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    description: "Beautiful home decor items",
    subcategories: [
      { name: "Wall Clock", slug: "wall-clock" },
      { name: "Candle Stand", slug: "candle-stand" },
      { name: "Flower Vase", slug: "flower-vase" },
      { name: "Table Lamp", slug: "table-lamp" },
      { name: "Photo Frame", slug: "photo-frame" },
      { name: "Decorative Mirror", slug: "decorative-mirror" },
      { name: "Wall Art", slug: "wall-art" },
    ],
  },
  {
    id: "gift-items",
    name: "Gift Items",
    slug: "gift-items",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    description: "Perfect gift items for every occasion",
    subcategories: [
      { name: "Perfume Set", slug: "perfume-set" },
      { name: "Greeting Card", slug: "greeting-card" },
      { name: "Mini Plant Pot", slug: "mini-plant-pot" },
      { name: "Gift Box", slug: "gift-box" },
      { name: "Jewelry Organizer", slug: "jewelry-organizer" },
      { name: "Customized Mug", slug: "customized-mug" },
      { name: "Scented Candle", slug: "scented-candle" },
    ],
  },
  {
    id: "toys",
    name: "Toys",
    slug: "toys",
    image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400",
    description: "Fun toys for all ages",
    subcategories: [
      { name: "Teddy Bear", slug: "teddy-bear" },
      { name: "Remote Car", slug: "remote-car" },
      { name: "Building Blocks", slug: "building-blocks" },
      { name: "Doll Set", slug: "doll-set" },
      { name: "Puzzle Game", slug: "puzzle-game" },
      { name: "Soft Toy Bunny", slug: "soft-toy-bunny" },
      { name: "Action Figure", slug: "action-figure" },
    ],
  },
  {
    id: "jewelry",
    name: "Jewelry",
    slug: "jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
    description: "Elegant jewelry collection",
    subcategories: [
      { name: "Earrings", slug: "earrings" },
      { name: "Necklaces", slug: "necklaces" },
      { name: "Bracelets & Bangles", slug: "bracelets-bangles" },
      { name: "Rings", slug: "rings" },
      { name: "Anklets", slug: "anklets" },
      { name: "Nose Pins", slug: "nose-pins" },
    ],
  },
  {
    id: "hair-accessories",
    name: "Hair Accessories",
    slug: "hair-accessories",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    description: "Stylish hair accessories",
    subcategories: [
      { name: "Hairbands", slug: "hairbands" },
      { name: "Scrunchies", slug: "scrunchies" },
      { name: "Claw Clips", slug: "claw-clips" },
      { name: "Hair Pins & Barrettes", slug: "hair-pins-barrettes" },
      { name: "Head Wraps & Scarves", slug: "head-wraps-scarves" },
    ],
  },
  {
    id: "bags-wallets",
    name: "Bags & Wallets",
    slug: "bags-wallets",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    description: "Stylish bags and wallets",
    subcategories: [
      { name: "Handbags", slug: "handbags" },
      { name: "Sling Bags", slug: "sling-bags" },
      { name: "Tote Bags", slug: "tote-bags" },
      { name: "Mini Purses", slug: "mini-purses" },
      { name: "Clutches", slug: "clutches" },
      { name: "Wallets", slug: "wallets" },
    ],
  },
  {
    id: "sunglasses-eyewear",
    name: "Sunglasses & Eyewear",
    slug: "sunglasses-eyewear",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
    description: "Trendy eyewear collection",
    subcategories: [
      { name: "Oversized Sunglasses", slug: "oversized-sunglasses" },
      { name: "Cat-eye Sunglasses", slug: "cat-eye-sunglasses" },
      { name: "Round Frames", slug: "round-frames" },
      { name: "Transparent Frames", slug: "transparent-frames" },
      { name: "Fashion Specs", slug: "fashion-specs" },
    ],
  },
  {
    id: "watches",
    name: "Watches",
    slug: "watches",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
    description: "Stylish watches collection",
    subcategories: [
      { name: "Metal Strap Watches", slug: "metal-strap-watches" },
      { name: "Leather Strap Watches", slug: "leather-strap-watches" },
      { name: "Bracelet Watches", slug: "bracelet-watches" },
      { name: "Smart Analog Styles", slug: "smart-analog-styles" },
    ],
  },
  {
    id: "belts-scarves",
    name: "Belts & Scarves",
    slug: "belts-scarves",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
    description: "Fashion belts and scarves",
    subcategories: [
      { name: "Leather Belts", slug: "leather-belts" },
      { name: "Chain Belts", slug: "chain-belts" },
      { name: "Fabric Belts", slug: "fabric-belts" },
      { name: "Printed Scarves", slug: "printed-scarves" },
      { name: "Solid Color Scarves", slug: "solid-color-scarves" },
    ],
  },
  {
    id: "footwear-accessories",
    name: "Footwear Accessories",
    slug: "footwear-accessories",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    description: "Footwear and accessories",
    subcategories: [
      { name: "Toe Rings", slug: "toe-rings" },
      { name: "Anklets Beaded Metal", slug: "anklets-beaded-metal" },
      { name: "Shoe Clips Charms", slug: "shoe-clips-charms" },
    ],
  },
  {
    id: "other-fashion-accessories",
    name: "Fashion Accessories",
    slug: "other-fashion-accessories",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
    description: "Unique fashion accessories",
    subcategories: [
      { name: "Brooches", slug: "brooches" },
      { name: "Caps & Hats", slug: "caps-hats" },
      { name: "Gloves", slug: "gloves" },
      { name: "Keychains Bag Charms", slug: "keychains-bag-charms" },
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
