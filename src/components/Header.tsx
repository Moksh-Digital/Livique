import {
  Search,
  ShoppingCart,
  User,
  Home,
  Menu,
  Gift,
  Truck,
  X,
  LogOut,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePage from "src/pages/ProfilePage";
// import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// for search functionality
// const [keyword, setKeyword] = useState("");
// const navigate = useNavigate();

// const handleSearch = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!keyword.trim()) return;

//   // Redirect user to a search results page (you’ll make this next)
//   navigate(`/search?keyword=${keyword}`);
// };

const Header = () => {

  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const { user, signOut } = useAuth();

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");


  const [keyword, setKeyword] = useState("");
const navigate = useNavigate();

const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!keyword.trim()) return;

  // Redirect user to a search results page (you’ll make this next)
  navigate(`/search?keyword=${keyword}`);
};


  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-background border-b " >
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-1 text-2xl font-bold text-accent"
              >
                {/* <Gift className="h-6 w-6" /> */}
                {/* <span>Livique</span> */}
              </Link>

              <div className="hidden md:flex items-center gap-2 text-sm">
                <img
                  src="Logo.jpg"
                  alt="India"
                  className="h-16 w-16"
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
<form onSubmit={handleSearch} className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    placeholder="Search for gifts, flowers, cakes..."
    className="pl-10 bg-muted/50"
  />
</form>



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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex flex-col h-auto py-1 px-2"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to= "/profile" className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

          {/* Mobile Bottom Nav */}
{user?.role === "admin" && (
  <Link
    to="/admin"
    className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary"
  >
    <Gift className="h-5 w-5" />
    Admin
  </Link>
)}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary">
                  <User className="h-5 w-5" />
                  Account
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/signin"
              className="flex flex-col items-center text-xs text-muted-foreground hover:text-primary"
            >
              <User className="h-5 w-5" />
              Sign In
            </Link>
          )}
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
