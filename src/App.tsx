import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";  // ✅ import auth context
import PromoBanner from "./components/Banner";

import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import OrderConfirmation from "./pages/OrderConfirmation";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import About from "./pages/About";

const AppRoutes = () => {
  const { signIn, fetchGoogleUser } = useAuth();
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    const googleLogin = params.get("googleLogin");

    if (token) {
      // ✅ Google login with JWT
      signIn(token);
      window.history.replaceState({}, "", "/");
    } 
    else if (googleLogin) {
      // ✅ Google session login (passport cookie)
      fetchGoogleUser();
      window.history.replaceState({}, "", "/");
    }
  }, [params]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path="/category" element={<Category />} />
      <Route path="/category/:category" element={<Category />} />
      <Route path="/category/:category/:subcategory" element={<Category />} />

      <Route path="/cart" element={<Cart />} />
      <Route path="/address" element={<Address />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />

      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/search" element={<SearchResultsPage />} />

      <Route path="/gifts" element={<ProductList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <TooltipProvider>
    <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none">
      <Toaster />
      <Sonner />
    </div>
    
    <PromoBanner />

    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
