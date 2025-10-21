import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the localStorage key
const LOCAL_STORAGE_KEY = 'livique_admin_products';


// Helper function to get initial products from localStorage
// 🚨 CHANGE 1: This function now ignores the defaultProducts argument and returns an EMPTY array
// We no longer rely on any local mock data.
const getInitialProducts = (): Product[] => {
  try {
    const savedProducts = localStorage.getItem(LOCAL_STORAGE_KEY);
    // If data exists, parse it. Otherwise, return an EMPTY array.
    return savedProducts ? JSON.parse(savedProducts) : [];
  } catch (error) {
    console.error("Error reading from localStorage, starting with empty products:", error);
    return [];
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

  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  // 🚨 CHANGE 2: Add setter function to the interface
  setProducts: (products: Product[]) => void;
}


const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// 🚨 CHANGE 3: DELETE the entire DEFAULT_PRODUCTS and INITIAL_PRODUCTS constants.
// If you copy/paste this file, ensure those mock data blocks are gone!

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const categories: Category[] = [
    // Your existing large categories array remains here...
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


  // 🚨 CHANGE 4: Initializing state to only read from localStorage, expecting data to be fetched
  const [products, setProducts] = useState<Product[]>(() => getInitialProducts());

  // 2. Use useEffect to save products to localStorage whenever the state changes (remains the same)
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [products]);


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
        // 🚨 CHANGE 5: Expose the setter function
        setProducts,
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