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
            const parsed = JSON.parse(storedCart) as CartItem[];
            // sanitize legacy items missing id by upgrading _id → id or dropping
            const cleaned = (parsed || [])
              .map((item) => {
                if (!item) return null;
                const id = (item as any).id || (item as any)._id;
                if (!id) return null;
                return { ...item, id } as CartItem;
              })
              .filter(Boolean) as CartItem[];

            if (cleaned.length > 0) return cleaned;
        }
    } catch (error) {
        console.error("Error loading cart from storage:", error);
    }
    return [];
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
        // Normalize id to avoid collapsing different products into the same entry
        const normalizedId = (item as any).id || (item as any)._id;
        if (!normalizedId) {
            console.warn('addToCart called without an id/_id');
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === normalizedId);
      
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === normalizedId
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }
      
            return [...prevCart, { ...item, id: normalizedId, quantity: 1 }];
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
