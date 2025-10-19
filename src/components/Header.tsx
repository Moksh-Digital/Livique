import {
  Search,
  ShoppingCart,
  User,
  Menu,
  Gift,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { getTotalItems } = useCart(); // ✅ corrected
  const totalItems = getTotalItems(); // ✅ get value dynamically
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Top Header */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo and Location */}
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

          {/* Search Bar */}
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

            {user ? (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex flex-col h-auto py-1 px-2"
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
                  className="hidden md:flex flex-col h-auto py-1 px-2"
                >
                  <User className="h-5 w-5" />
                  <span className="text-xs">Sign In</span>
                </Button>
              </Link>
            )}

            <Button variant="ghost" size="sm" className="flex md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-3 border-t text-sm">
          <Link to="/category/festive-gifts" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Festive Gifts ∨
          </Link>
          <Link to="/category/birthday" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Birthday ∨
          </Link>
          <Link to="/category/flowers" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Flowers ∨
          </Link>
          <Link to="/category/cakes" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Cakes ∨
          </Link>
          <Link to="/category/chocolates" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Chocolates ∨
          </Link>
          <Link to="/category/gift-hampers" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Gift Hampers ∨
          </Link>
          <Link to="/category/personalised" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Personalised ∨
          </Link>
          <Link to="/category/plants" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Plants ∨
          </Link>
          <Link to="/category/sweets" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Sweets ∨
          </Link>
          <Link to="/category/home-decor" className="px-3 py-1 hover:text-primary whitespace-nowrap">
            Home Décor ∨
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
