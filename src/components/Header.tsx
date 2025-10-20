import {
  Search,
  ShoppingCart,
  User,
  Home,
  Menu,
  Gift,
  Truck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const { user, signOut } = useAuth();

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-1 text-2xl font-bold text-accent"
              >
                <Gift className="h-6 w-6" />
                <span>Livique</span>
              </Link>

              <div className="hidden md:flex items-center gap-2 text-sm">
                <img
                  src="https://flagcdn.com/w20/in.png"
                  alt="India"
                  className="h-4"
                />
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Deliver to <strong>Punjab</strong>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Mohali, Punjab, 140507
                  </span>
                </div>
              </div>
            </div>

            {/* Search Bar (Desktop only) */}
            <div className="flex-1 max-w-2xl hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for gifts, flowers, cakes..."
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex flex-col h-auto py-1 px-2"
              >
                <Truck className="h-5 w-5" />
                <span className="text-xs">Same Day</span>
              </Button>

              {user?.role === "admin" && (
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex flex-col h-auto py-1 px-2"
                  >
                    <Gift className="h-5 w-5" />
                    <span className="text-xs">Admin</span>
                  </Button>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col h-auto py-1 px-2 relative"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-xs">Cart</span>
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-badge text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Profile */}
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col h-auto py-1 px-2"
                  onClick={signOut}
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">{user.name}</span>
                </Button>
              ) : (
                <Link to="/signin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-col h-auto py-1 px-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-xs">Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md md:hidden z-50">
        <div className="flex justify-between items-center px-6 py-2">
          <Link
            to="/"
            className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          <Link
            to="/category"
            className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary"
          >
            <Menu className="h-5 w-5" />
            Categories
          </Link>

          {/* Open Search Overlay */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary"
          >
            <Search className="h-5 w-5" />
            Search
          </button>

          <Link
            to="/cart"
            className="relative flex flex-col items-center text-xs text-muted-foreground hover:text-primary"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-badge text-xs">
                {totalItems}
              </Badge>
            )}
          </Link>

          <Link
            to={user ? "/account" : "/signin"}
            className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary"
          >
            <User className="h-5 w-5" />
            {user ? "Account" : "Sign In"}
          </Link>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-[999] flex flex-col"
          >
            <div className="flex items-center gap-2 p-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Search gifts, flowers, cakes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            {/* Optional: Search results / suggestions */}
            <div className="p-4 text-muted-foreground">
              {query ? (
                <p>Showing results for “{query}”</p>
              ) : (
                <p className="text-sm text-center mt-8">
                  Start typing to search 🎁
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
