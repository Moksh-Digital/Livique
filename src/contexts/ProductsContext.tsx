import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  delivery: string;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Diwali Jade N Fridge Magnet Gift",
    price: 1199,
    originalPrice: 1299,
    discount: "8% OFF",
    delivery: "Today",
    image: "🌿",
    category: "Gift Hampers",
    description: "Beautiful jade plant with decorative fridge magnet combo perfect for Diwali gifting",
    rating: 4.8,
    reviews: 234
  },
  {
    id: 2,
    name: "Diwali Dazzle Delight",
    price: 1449,
    originalPrice: 1799,
    discount: "19% OFF",
    delivery: "Today",
    image: "🥜",
    category: "Dryfruits",
    description: "Premium dry fruits hamper with cashews, almonds, and pistachios",
    rating: 4.9,
    reviews: 456
  },
  {
    id: 3,
    name: "Festive Treats Chocolate n Nuts",
    price: 1449,
    originalPrice: 1799,
    discount: "19% OFF",
    delivery: "Today",
    image: "🍫",
    category: "Chocolates",
    description: "Delicious assortment of premium chocolates and roasted nuts",
    rating: 4.7,
    reviews: 321
  },
  {
    id: 4,
    name: "Sacred Saffron Kaju Katli",
    price: 1299,
    originalPrice: 1449,
    discount: "10% OFF",
    delivery: "Today",
    image: "🪔",
    category: "Sweets",
    description: "Traditional kaju katli infused with premium saffron",
    rating: 4.8,
    reviews: 189
  },
  {
    id: 5,
    name: "Diwali Yellow and Orange Bloom Pots",
    price: 799,
    originalPrice: 999,
    discount: "20% OFF",
    delivery: "Today",
    image: "🌼",
    category: "Home Décor",
    description: "Vibrant flowering plants in decorative pots",
    rating: 4.6,
    reviews: 145
  }
];

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts(prev => [...prev, { ...product, id: newId }]);
  };

  const updateProduct = (id: number, updatedProduct: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id: number) => products.find(p => p.id === id);

  const getProductsByCategory = (category: string) =>
    products.filter(p => p.category.toLowerCase() === category.toLowerCase());

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById, getProductsByCategory }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
};
