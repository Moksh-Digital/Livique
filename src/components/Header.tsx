import {
  Search,
  ShoppingCart,
  User,
  Home,
  Menu,
  Gift,
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
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const { user, signOut } = useAuth();

  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${keyword}`);
    setShowSearch(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-8 z-50 bg-[#FFF8F0] shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Logo with Brand Name */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="Logo.jpg"
                  alt="Logo"
                  className="h-10 w-10 md:h-12 md:w-12 object-contain"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-lg md:text-xl font-bold text-[#8B4513] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    LIVQUE
                  </span>
                  <span className="text-[9px] md:text-[10px] text-[#8B7355] tracking-widest uppercase">
                    Gifts & More
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar - Click to expand */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B7355] pointer-events-none z-10" />
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  placeholder="Search for gifts, flowers, cakes..."
                  className="pl-10 pr-4 w-full bg-white border-[#D4AF76] focus:border-[#C19A6B] focus:ring-[#C19A6B] rounded-md h-10 text-[#5D4037] placeholder:text-[#8B7355]"
                />
              </div>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search Icon (Mobile) */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#8B4513] hover:bg-[#F5E6D3]"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-[#8B4513] hover:bg-[#F5E6D3]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#D2691E] text-white text-xs rounded-full border-2 border-[#FFF8F0]">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Admin */}
              {user?.role === "admin" && (
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex text-[#8B4513] hover:bg-[#F5E6D3]"
                  >
                    <Gift className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              {/* Profile */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#8B4513] hover:bg-[#F5E6D3]"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-[#FFF8F0] border-[#E8D5C4]"
                  >
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-[#5D4037]">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-[#8B7355]">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-[#E8D5C4]" />
                    <DropdownMenuItem asChild className="hover:bg-[#F5E6D3] text-[#5D4037]">
                      <Link to="/profile" className="flex items-center">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#E8D5C4]" />
                    <DropdownMenuItem onClick={signOut} className="text-red-600 hover:bg-[#F5E6D3]">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/signin">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#8B4513] hover:bg-[#F5E6D3]"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FFF8F0] border-t border-[#E8D5C4] shadow-md md:hidden z-50">
        <div className="flex justify-between items-center px-6 py-2">
          <Link
            to="/"
            className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          <Link
            to="/category"
            className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
          >
            <Menu className="h-5 w-5" />
            Categories
          </Link>

          {/* Open Search Overlay */}
          <button
            onClick={() => setShowSearch(true)}
            className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
          >
            <Search className="h-5 w-5" />
            Search
          </button>

          <Link
            to="/cart"
            className="relative flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#D2691E] text-white text-xs rounded-full">
                {totalItems}
              </Badge>
            )}
          </Link>

          {/* Mobile Bottom Nav Admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
            >
              <Gift className="h-5 w-5" />
              Admin
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]">
                  <User className="h-5 w-5" />
                  Account
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#FFF8F0] border-[#E8D5C4]">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-[#5D4037]">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-[#8B7355]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-[#E8D5C4]" />
                <DropdownMenuItem asChild className="hover:bg-[#F5E6D3] text-[#5D4037]">
                  <Link to="/profile" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#E8D5C4]" />
                <DropdownMenuItem onClick={signOut} className="text-red-600 hover:bg-[#F5E6D3]">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/signin"
              className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
            >
              <User className="h-5 w-5" />
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Search Overlay with Suggestions */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-20"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <form onSubmit={handleSearch} className="p-4 border-b border-[#E8D5C4]">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B7355]" />
                  <Input
                    autoFocus
                    placeholder="Search for gifts, flowers, cakes..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-10 pr-10 bg-[#FFF8F0] border-[#D4AF76] focus:border-[#C19A6B] focus:ring-[#C19A6B] h-12 text-[#5D4037] placeholder:text-[#8B7355]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSearch(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8B7355] hover:bg-[#F5E6D3]"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              {/* Search Suggestions */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {keyword ? (
                  <div>
                    <p className="text-sm text-[#8B7355] mb-3">
                      Press Enter to search for "{keyword}"
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-[#5D4037] mb-3">Popular Searches</p>
                    <div className="space-y-2">
                      {[
                        "Birthday Gifts",
                        "Anniversary Flowers",
                        "Chocolate Cakes",
                        "Personalized Gifts",
                        "Same Day Delivery",
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setKeyword(suggestion);
                            navigate(`/search?keyword=${suggestion}`);
                            setShowSearch(false);
                          }}
                          className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-[#FFF8F0] text-left text-[#5D4037] transition-colors"
                        >
                          <Search className="h-4 w-4 text-[#8B7355]" />
                          <span className="text-sm">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;