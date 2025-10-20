import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the localStorage key
const LOCAL_STORAGE_KEY = 'livique_admin_products';

// Helper function to get initial products from localStorage
const getInitialProducts = (defaultProducts: Product[]): Product[] => {
  try {
    const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
    // If data exists, parse it. Otherwise, return the default array.
    return savedProducts ? JSON.parse(savedProducts) : defaultProducts;
  } catch (error) {
    console.error("Error reading from localStorage, using default products:", error);
    return defaultProducts;
  }
};


export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string; // legacy emoji fallback
  mainImage?: string; // new: main image URL / dataURL
  images?: string[]; // new: gallery images (URLs / dataURLs)
  delivery: string;
  category: string;
  subcategory: string;
  inStock: boolean;
  badge?: string;
  description?: string;
}

export interface SubCategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  icon: string;
  subcategories: SubCategory[];
}

interface ProductsContextType {
  products: Product[];
  categories: Category[];
  getProductsByCategory: (category: string) => Product[];
  getProductsBySubcategory: (subcategory: string) => Product[];
  getProductById: (id: string) => Product | undefined;

  // ✅ Add these
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}


const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Define your default product list (used for the initial state if localStorage is empty)
const DEFAULT_PRODUCTS: Product[] = [
    // Electronics - Mobile Phones
    { id: '1', name: 'iPhone 15 Pro Max', price: 134900, originalPrice: 159900, discount: '16% off', rating: 4.8, reviews: 2543, image: '📱', delivery: 'Tomorrow', category: 'Electronics', subcategory: 'Mobile Phones', inStock: true, badge: 'SALE 50%' },
    { id: '2', name: 'Samsung Galaxy S24 Ultra', price: 124999, originalPrice: 139999, discount: '11% off', rating: 4.7, reviews: 1876, image: '📱', delivery: 'Today', category: 'Electronics', subcategory: 'Mobile Phones', inStock: true, badge: 'SALE 50%' },
    { id: '3', name: 'OnePlus 12 5G', price: 64999, originalPrice: 69999, discount: '7% off', rating: 4.6, reviews: 3421, image: '📱', delivery: 'Tomorrow', category: 'Electronics', subcategory: 'Mobile Phones', inStock: true },
    
    // Electronics - Laptops
    { id: '4', name: 'MacBook Pro 16"', price: 249900, originalPrice: 269900, discount: '7% off', rating: 4.9, reviews: 876, image: '💻', delivery: '2 days', category: 'Electronics', subcategory: 'Laptops', inStock: true, badge: 'SALE 50%' },
    { id: '5', name: 'Dell XPS 15', price: 189999, originalPrice: 209999, discount: '10% off', rating: 4.7, reviews: 654, image: '💻', delivery: 'Tomorrow', category: 'Electronics', subcategory: 'Laptops', inStock: true },
    { id: '6', name: 'HP Pavilion Gaming', price: 84990, originalPrice: 99990, discount: '15% off', rating: 4.5, reviews: 1234, image: '💻', delivery: 'Today', category: 'Electronics', subcategory: 'Laptops', inStock: true, badge: 'SALE 50%' },
    
    // Electronics - Headphones
    { id: '7', name: 'Sony WH-1000XM5', price: 29990, originalPrice: 34990, discount: '14% off', rating: 4.8, reviews: 2156, image: '🎧', delivery: 'Today', category: 'Electronics', subcategory: 'Headphones', inStock: true },
    { id: '8', name: 'Apple AirPods Pro', price: 24900, originalPrice: 26900, discount: '7% off', rating: 4.7, reviews: 3421, image: '🎧', delivery: 'Tomorrow', category: 'Electronics', subcategory: 'Headphones', inStock: true, badge: 'SALE 50%' },
    
    // Fashion - Men Clothing
    { id: '9', name: 'Levi\'s Men Jeans', price: 2499, originalPrice: 3499, discount: '29% off', rating: 4.4, reviews: 8765, image: '👖', delivery: 'Tomorrow', category: 'Fashion', subcategory: 'Men Clothing', inStock: true },
    { id: '10', name: 'Nike T-Shirt', price: 1299, originalPrice: 1999, discount: '35% off', rating: 4.3, reviews: 5432, image: '👕', delivery: 'Today', category: 'Fashion', subcategory: 'Men Clothing', inStock: true, badge: 'SALE 50%' },
    
    // Fashion - Women Clothing
    { id: '11', name: 'Ethnic Kurti Set', price: 1899, originalPrice: 2999, discount: '37% off', rating: 4.5, reviews: 6543, image: '👗', delivery: 'Tomorrow', category: 'Fashion', subcategory: 'Women Clothing', inStock: true },
    { id: '12', name: 'Designer Saree', price: 4999, originalPrice: 8999, discount: '44% off', rating: 4.6, reviews: 3210, image: '🥻', delivery: '2 days', category: 'Fashion', subcategory: 'Women Clothing', inStock: true, badge: 'SALE 50%' },
    
    // Home & Furniture
    { id: '13', name: 'Wooden Study Table', price: 8999, originalPrice: 12999, discount: '31% off', rating: 4.3, reviews: 876, image: '🪑', delivery: '5 days', category: 'Home & Furniture', subcategory: 'Furniture', inStock: true },
    { id: '14', name: 'Decorative Wall Art', price: 1499, originalPrice: 2499, discount: '40% off', rating: 4.4, reviews: 2345, image: '🖼️', delivery: 'Tomorrow', category: 'Home & Furniture', subcategory: 'Home Decor', inStock: true, badge: 'SALE 50%' },
    { id: '15', name: 'LED Table Lamp', price: 899, originalPrice: 1599, discount: '44% off', rating: 4.2, reviews: 1876, image: '💡', delivery: 'Today', category: 'Home & Furniture', subcategory: 'Lighting', inStock: true },
    
    // Books & Stationery
    { id: '16', name: 'Premium Notebook Set', price: 299, originalPrice: 499, discount: '40% off', rating: 4.5, reviews: 4321, image: '📓', delivery: 'Tomorrow', category: 'Books & Stationery', subcategory: 'Notebooks', inStock: true },
    { id: '17', name: 'Parker Pen Set', price: 1299, originalPrice: 1999, discount: '35% off', rating: 4.7, reviews: 2109, image: '🖊️', delivery: 'Today', category: 'Books & Stationery', subcategory: 'Pens', inStock: true, badge: 'SALE 50%' },
    { id: '18', name: 'Art Sketch Book', price: 399, originalPrice: 699, discount: '43% off', rating: 4.6, reviews: 1654, image: '📔', delivery: 'Tomorrow', category: 'Books & Stationery', subcategory: 'Sketch Books', inStock: true },
    
    // Sports & Fitness
    { id: '19', name: 'Yoga Mat Premium', price: 1299, originalPrice: 1999, discount: '35% off', rating: 4.5, reviews: 3210, image: '🧘', delivery: 'Today', category: 'Sports & Fitness', subcategory: 'Yoga', inStock: true },
    { id: '20', name: 'Dumbbell Set 10kg', price: 2499, originalPrice: 3499, discount: '29% off', rating: 4.4, reviews: 1987, image: '🏋️', delivery: 'Tomorrow', category: 'Sports & Fitness', subcategory: 'Exercise Equipment', inStock: true, badge: 'SALE 50%' },
];

// normalize defaults to include mainImage/images so we don't update every item
const INITIAL_PRODUCTS: Product[] = DEFAULT_PRODUCTS.map(p => ({
  ...p,
  mainImage: (p as any).mainImage ?? p.image,
  images: (p as any).images ?? [ (p as any).image ],
}));

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const categories: Category[] = [
    {
      name: 'Electronics',
      slug: 'electronics',
      icon: '📱',
      subcategories: [
        { name: 'Mobile Phones', slug: 'mobile-phones' },
        { name: 'Laptops', slug: 'laptops' },
        { name: 'Tablets', slug: 'tablets' },
        { name: 'Televisions', slug: 'televisions' },
        { name: 'Cameras', slug: 'cameras' },
        { name: 'Headphones', slug: 'headphones' },
        { name: 'Speakers', slug: 'speakers' },
        { name: 'Smart Watches', slug: 'smart-watches' },
        { name: 'Power Banks', slug: 'power-banks' },
        { name: 'Gaming Consoles', slug: 'gaming-consoles' },
      ],
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      icon: '👕',
      subcategories: [
        { name: 'Men Clothing', slug: 'men-clothing' },
        { name: 'Women Clothing', slug: 'women-clothing' },
        { name: 'Kids Clothing', slug: 'kids-clothing' },
        { name: 'Men Footwear', slug: 'men-footwear' },
        { name: 'Women Footwear', slug: 'women-footwear' },
        { name: 'Watches', slug: 'watches' },
        { name: 'Sunglasses', slug: 'sunglasses' },
        { name: 'Bags & Luggage', slug: 'bags-luggage' },
        { name: 'Jewellery', slug: 'jewellery' },
        { name: 'Accessories', slug: 'accessories' },
      ],
    },
    {
      name: 'Home & Furniture',
      slug: 'home-furniture',
      icon: '🛋️',
      subcategories: [
        { name: 'Furniture', slug: 'furniture' },
        { name: 'Home Decor', slug: 'home-decor' },
        { name: 'Kitchen & Dining', slug: 'kitchen-dining' },
        { name: 'Bed & Bath', slug: 'bed-bath' },
        { name: 'Garden & Outdoor', slug: 'garden-outdoor' },
        { name: 'Home Improvement', slug: 'home-improvement' },
        { name: 'Lighting', slug: 'lighting' },
        { name: 'Storage', slug: 'storage' },
      ],
    },
    {
      name: 'Beauty & Personal Care',
      slug: 'beauty-personal-care',
      icon: '💄',
      subcategories: [
        { name: 'Makeup', slug: 'makeup' },
        { name: 'Skin Care', slug: 'skin-care' },
        { name: 'Hair Care', slug: 'hair-care' },
        { name: 'Fragrances', slug: 'fragrances' },
        { name: 'Bath & Body', slug: 'bath-body' },
        { name: 'Men Grooming', slug: 'men-grooming' },
        { name: 'Beauty Tools', slug: 'beauty-tools' },
      ],
    },
    {
      name: 'Books & Stationery',
      slug: 'books-stationery',
      icon: '📚',
      subcategories: [
        { name: 'Books', slug: 'books' },
        { name: 'Pens', slug: 'pens' },
        { name: 'Pencils', slug: 'pencils' },
        { name: 'Notebooks', slug: 'notebooks' },
        { name: 'Sketch Books', slug: 'sketch-books' },
        { name: 'Erasers', slug: 'erasers' },
        { name: 'School Supplies', slug: 'school-supplies' },
        { name: 'Art Supplies', slug: 'art-supplies' },
        { name: 'Office Supplies', slug: 'office-supplies' },
      ],
    },
    {
      name: 'Sports & Fitness',
      slug: 'sports-fitness',
      icon: '⚽',
      subcategories: [
        { name: 'Exercise Equipment', slug: 'exercise-equipment' },
        { name: 'Yoga', slug: 'yoga' },
        { name: 'Sports Shoes', slug: 'sports-shoes' },
        { name: 'Cricket', slug: 'cricket' },
        { name: 'Football', slug: 'football' },
        { name: 'Badminton', slug: 'badminton' },
        { name: 'Swimming', slug: 'swimming' },
        { name: 'Cycling', slug: 'cycling' },
      ],
    },
    {
      name: 'Toys & Baby Products',
      slug: 'toys-baby',
      icon: '🧸',
      subcategories: [
        { name: 'Toys', slug: 'toys' },
        { name: 'Baby Care', slug: 'baby-care' },
        { name: 'Baby Fashion', slug: 'baby-fashion' },
        { name: 'Diapers', slug: 'diapers' },
        { name: 'Baby Feeding', slug: 'baby-feeding' },
        { name: 'Baby Gear', slug: 'baby-gear' },
      ],
    },
    {
      name: 'Grocery & Food',
      slug: 'grocery-food',
      icon: '🛒',
      subcategories: [
        { name: 'Fruits & Vegetables', slug: 'fruits-vegetables' },
        { name: 'Dairy Products', slug: 'dairy-products' },
        { name: 'Beverages', slug: 'beverages' },
        { name: 'Snacks', slug: 'snacks' },
        { name: 'Cooking Essentials', slug: 'cooking-essentials' },
        { name: 'Organic', slug: 'organic' },
      ],
    },
    {
      name: 'Appliances',
      slug: 'appliances',
      icon: '🔌',
      subcategories: [
        { name: 'Air Conditioners', slug: 'air-conditioners' },
        { name: 'Refrigerators', slug: 'refrigerators' },
        { name: 'Washing Machines', slug: 'washing-machines' },
        { name: 'Microwave Ovens', slug: 'microwave-ovens' },
        { name: 'Vacuum Cleaners', slug: 'vacuum-cleaners' },
        { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
      ],
    },
    {
      name: 'Automotive',
      slug: 'automotive',
      icon: '🚗',
      subcategories: [
        { name: 'Car Accessories', slug: 'car-accessories' },
        { name: 'Bike Accessories', slug: 'bike-accessories' },
        { name: 'Car Electronics', slug: 'car-electronics' },
        { name: 'Helmets', slug: 'helmets' },
        { name: 'Car Care', slug: 'car-care' },
      ],
    },
  ];

  
  // 1. Initialize state by reading from localStorage or falling back to default
  const [products, setProducts] = useState<Product[]>(() => getInitialProducts(INITIAL_PRODUCTS));

  // 2. Use useEffect to save products to localStorage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [products]); // Dependency array ensures this runs on mount and when 'products' changes


  // helper to normalize a string to slug form (same rules admin uses)
  const toSlug = (s?: string) =>
    (s || "")
      .toString()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const getProductsByCategory = (categorySlug: string) => {
    if (!categorySlug) return [];
    const slug = categorySlug.toLowerCase();
    return products.filter((product) => {
      const pSlug = (product as any).categorySlug
        ? String((product as any).categorySlug).toLowerCase()
        : toSlug(product.category);
      return pSlug === slug;
    });
  };

  const getProductsBySubcategory = (subcategorySlug: string) => {
    if (!subcategorySlug) return [];
    const slug = subcategorySlug.toLowerCase();
    return products.filter((product) => {
      const pSubSlug = (product as any).subcategorySlug
        ? String((product as any).subcategorySlug).toLowerCase()
        : toSlug(product.subcategory);
      return pSubSlug === slug;
    });
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };


  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        getProductsByCategory,
        getProductsBySubcategory,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};