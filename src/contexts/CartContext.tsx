import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  delivery: string;
  quantity: number;
  deliveryCharge?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to load cart data from local storage on startup
const getInitialCart = (): CartItem[] => {
    try {
        const storedCart = localStorage.getItem('ecomCart');
        if (storedCart) {
            return JSON.parse(storedCart) as CartItem[];
        }
    } catch (error) {
        console.error("Error loading cart from storage:", error);
    }
    // Return a default mock item for easy testing if storage is empty
    return [
        {
            id: "mock-prod-1",
            name: "Default Test Item",
            price: 1500,
            image: "📦",
            delivery: "2 days",
            quantity: 1,
            deliveryCharge: 59,
        }
    ];
};


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from local storage
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  
  // Effect to synchronize cart state with local storage whenever 'cart' changes
  useEffect(() => {
    try {
        localStorage.setItem('ecomCart', JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to storage:", error);
    }
  }, [cart]);


  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
