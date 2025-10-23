import React, { createContext, useContext, useState, useEffect } from "react";

// LocalStorage key for caching
const LOCAL_STORAGE_KEY = "livique_admin_orders";

// ✅ User interface
export interface User {
  _id?: string;
  name?: string;
  email?: string;
}

// ✅ Product inside an order
export interface OrderProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

// ✅ Order interface
// frontend/contexts/OrdersContext.tsx

export interface Order {
  _id: string;
  user?: {           // User info from populate
    _id?: string;
    name?: string;
    email?: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    delivery?: string;
    deliveryCharge?: number;
  }[];
  address: {
    fullName: string;
    mobile: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    addressType: string;
  };
  paymentMethod: string;
  subtotal: number;
  deliveryCharges: number;
  total: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}




// ✅ Context interface
interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  fetchOrdersFromAPI: () => Promise<void>;
}

// Create context
const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

// ✅ Provider
export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to parse orders from localStorage:", err);
      return [];
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.error("Failed to save orders to localStorage:", err);
    }
  }, [orders]);

  // Fetch from API
  const fetchOrdersFromAPI = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");

      if (Array.isArray(data)) {
        const formattedOrders: Order[] = data.map((order: any) => ({
          ...order,
          _id: order._id,
          user: order.user || undefined,
          products: order.products || [],
        }));

        setOrders(formattedOrders);
      } else {
        throw new Error("Invalid data format from server");
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Core context functions
  const addOrder = (order: Order) => setOrders(prev => [...prev, order]);
  const updateOrder = (id: string, data: Partial<Order>) =>
    setOrders(prev => prev.map(o => (o._id === id ? { ...o, ...data } : o)));
  const deleteOrder = (id: string) => setOrders(prev => prev.filter(o => o._id !== id));
  const getOrderById = (id: string) => orders.find(o => o._id === id);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        setOrders,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrderById,
        fetchOrdersFromAPI,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

// ✅ Hook
export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within an OrdersProvider");
  return context;
};
