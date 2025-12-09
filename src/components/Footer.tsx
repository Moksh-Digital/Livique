import { Gift, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#FFF8F0] border-t-2 border-[#D4AF76]">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand and Socials */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-2">
              <img
                src="Logo.jpg"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-bold text-[#8B4513] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                  LIVQUE
                </span>
                <span className="text-[9px] text-[#8B7355] tracking-widest uppercase">
                  Gifts & More
                </span>
              </div>
            </a>
            <p className="text-sm text-[#8B7355] leading-relaxed">
              Gifting happiness, one surprise at a time. Your one-stop shop for gifts, flowers for every occasion.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-[#8B4513] hover:text-[#D2691E] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#8B4513] hover:text-[#D2691E] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#8B4513] hover:text-[#D2691E] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#8B4513] hover:text-[#D2691E] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Know Us */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-[#8B4513]">Know Us</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Contact Us</a></li>
              <li><a href="/careers" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Careers</a></li>
              <li><a href="/blog" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Column 3: Our Policies */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-[#8B4513]">Our Policies</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Privacy Policy</a></li>
              <li><a href="/refund" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Refund Policy</a></li>
              <li><a href="/faq" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: Top Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-[#8B4513]">Top Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/flowers" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Flowers</a></li>
              <li><a href="/category/gift-hampers" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Gift Hampers</a></li>
              <li><a href="/category/personalised" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Personalised Gifts</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#D4AF76] text-center text-sm text-[#8B7355]">
          <p>&copy; 2025 Livique. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;