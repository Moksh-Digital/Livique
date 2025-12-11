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
import { Link, useNavigate } from "react-router-dom";
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
// Corrected import paths to match your file structure (assuming pages is a sibling to components)
import SignIn from "../pages/SignIn"; 
import SignUp from "../pages/SignUp"; 

const Header = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const { user, signOut } = useAuth();

  const [showSearch, setShowSearch] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false); 
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/search?keyword=${keyword}`);
    setShowSearch(false);
  };

  // Handlers for switching and closing modals
  const handleOpenSignIn = () => {
    setShowSignUpModal(false); // Close Sign Up if open
    setShowSignInModal(true); // Open Sign In
  };

  const handleOpenSignUp = () => {
    setShowSignInModal(false); // Close Sign In if open
    setShowSignUpModal(true); // Open Sign Up
  };

  const handleAuthSuccess = () => {
    // This closes both modals after a successful sign in or sign up, 
    // relying on the individual components to handle navigation.
    setShowSignInModal(false);
    setShowSignUpModal(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-[40px] md:top-[40px] z-[70] bg-[#FFF8F0] shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4">
      <div className="flex items-center justify-between h-16 md:h-16 gap-3">
            {/* Left: Logo with Brand Name */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2">
                <img
                  src="/Logo.jpg"
                  alt="Logo"
                  className="h-14 w-14 md:h-16 md:w-16 object-contain"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-xl md:text-3xl font-bold text-[#8B4513] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    LIVIQUE
                  </span>
                  <span className="text-[10px] md:text-[14px] text-[#8B7355] tracking-widest uppercase">
                    Gifts & More
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Search Bar */}

            {/* Right: Icons */}
            <div className="flex items-center gap-2 md:gap-3 pr-2 md:pr-4">
              {/* Admin - Desktop Only */}
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

              {/* Search - Desktop Only */}
              <button
                onClick={() => setShowSearch(true)}
                className="hidden md:flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
              >
                <Search className="h-5 w-4" />
              </button>

              {/* Cart - Desktop Only */}
              <Link
                to="/cart"
                className="hidden md:flex relative flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
              >
                <ShoppingCart className="h-5 w-4" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#D2691E] text-white text-xs rounded-full">
                    {totalItems}
                  </Badge>
                )}
              </Link>

              {/* Profile/Auth */}
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#8B4513] hover:bg-[#F5E6D3]"
                  onClick={handleOpenSignIn} // Opens Sign In modal
                >
                  <User className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#FFF8F0] border-t border-[#E8D5C4] shadow-md md:hidden z-50">
        <div className="flex justify-between items-center px-10 py-2">
          <Link
            to="/"
            className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

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
            <button
              onClick={handleOpenSignIn} // Opens Sign In modal
              className="flex flex-col items-center text-xs text-[#8B7355] hover:text-[#8B4513]"
            >
              <User className="h-5 w-5" />
              Sign In
            </button>
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
                  placeholder="Search for gifts, flowers.."
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

      {/* AUTH MODAL OVERLAY (Sign In or Sign Up) */}
      {(showSignInModal || showSignUpModal) && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[101] flex items-center justify-center p-4"
          onClick={() => { setShowSignInModal(false); setShowSignUpModal(false); }} // Click outside to close both
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 animate-in fade-in slide-in-from-bottom-2 duration-300 relative"
            onClick={(e) => e.stopPropagation()} // Stop click from propagating to the overlay
          >
            {/* Render Sign In */}
            {showSignInModal && (
              <SignIn 
                isModal={true} 
                onSignInSuccess={handleAuthSuccess} 
                onSwitchToSignUp={handleOpenSignUp} // Prop to switch to Sign Up
              />
            )}

            {/* Render Sign Up */}
            {showSignUpModal && (
              <SignUp 
                isModal={true} 
                onSignUpSuccess={handleAuthSuccess} 
                onSwitchToSignIn={handleOpenSignIn} // Prop to switch to Sign In
              />
            )}

            {/* Global Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setShowSignInModal(false); setShowSignUpModal(false); }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;