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
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { getTotalItems, items } = useCart();
  const totalItems = getTotalItems();
  const { user, signOut } = useAuth();

  const [showSearch, setShowSearch] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${keyword}`);
    setShowSearch(false);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setShowCart(true);
  };

  const handleContinueShopping = () => {
    setShowCart(false);
    navigate('/cart');
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

            {/* Center: Search Bar */}
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
              <Button
                variant="ghost"
                size="icon"
                className="relative text-[#8B4513] hover:bg-[#F5E6D3]"
                onClick={handleCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#D2691E] text-white text-xs rounded-full border-2 border-[#FFF8F0]">
                    {totalItems}
                  </Badge>
                )}
              </Button>

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

          <button
            onClick={() => setShowSearch(true)}
            className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
          >
            <Search className="h-5 w-5" />
            Search
          </button>

          <button
            onClick={handleCartClick}
            className="relative flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#D2691E] text-white text-xs rounded-full">
                {totalItems}
              </Badge>
            )}
          </button>

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

      {/* Search Overlay */}
      {showSearch && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-20"
          onClick={() => setShowSearch(false)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 animate-in fade-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E8D5C4]">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8B7355]" />
                <Input
                  autoFocus
                  placeholder="Search for gifts, flowers, cakes..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
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
            </div>

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
          </div>
        </div>
      )}

      {/* Side Cart Drawer */}
      {showCart && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[100] animate-in fade-in duration-200"
            onClick={() => setShowCart(false)}
          />
          
          <div className="fixed right-0 top-0 h-full w-[75%] max-w-md bg-[#FFF8F0] shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E8D5C4] bg-[#8B4513]">
              <div className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-white" />
                <div>
                  <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
                  <p className="text-xs text-[#F5E6D3]">You selected {totalItems} gifts</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCart(false)}
                className="text-white hover:bg-[#6B3410]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {totalItems === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingCart className="h-16 w-16 text-[#D4AF76] mb-4" />
                  <p className="text-[#5D4037] text-lg font-medium mb-2">Your cart is empty</p>
                  <p className="text-[#8B7355] text-sm">Add some gifts to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items?.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 bg-[#FFF8F0] rounded-lg border border-[#E8D5C4]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-[#5D4037] text-sm">{item.name}</h3>
                        <p className="text-xs text-[#8B7355] mt-1">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-[#8B4513] mt-1">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E8D5C4] bg-white">
              <Button
                onClick={handleContinueShopping}
                className="w-full bg-[#DC143C] hover:bg-[#B01030] text-white py-6 text-base font-semibold rounded-md"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;