import { Gift, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#FFF8F0] border-t-2 border-[#D4AF76]">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        {/* Grid with 5 columns now */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Column 1: Brand and Socials */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-2">
              <img
                src="Logo.jpg"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-xl font-bold text-[#8B4513] tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
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
          <div className="space-y-3 border-l border-[#D4AF76] pl-4">
            <h3 className="font-semibold text-lg text-[#8B4513]">Know Us</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">About Us</a></li>
              <li><a href="https://merchant.razorpay.com/policy/Roepb8DQiTw12t/contact_us" target="_blank" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Contact Us</a></li>
              {/* <li><a href="/careers" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Careers</a></li>
              <li><a href="/blog" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Blog</a></li> */}
            </ul>
          </div>

          {/* Column 3: Our Policies */}
          <div className="space-y-3 border-l border-[#D4AF76] pl-4">
            <h3 className="font-semibold text-lg text-[#8B4513]">Our Policies</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://merchant.razorpay.com/policy/Roepb8DQiTw12t/terms" target="_blank" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Terms & Conditions</a></li>
              <li><a href="https://merchant.razorpay.com/policy/Roepb8DQiTw12t/privacy" target="_blank" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Privacy Policy</a></li>
              <li><a href="https://merchant.razorpay.com/policy/Roepb8DQiTw12t/refund" target="_blank" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Refund Policy</a></li>
              <li><a href="https://merchant.razorpay.com/policy/Roepb8DQiTw12t/shipping" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Shipping & Delivery Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Top Categories */}
          <div className="space-y-3 border-l border-[#D4AF76] pl-4">
            <h3 className="font-semibold text-lg text-[#8B4513]">Top Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/flowers" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Flowers</a></li>
              <li><a href="/category/gift-hampers" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Gift Hampers</a></li>
              <li><a href="/category/personalised" className="text-[#8B7355] hover:text-[#8B4513] hover:underline transition-colors">Personalised Gifts</a></li>
            </ul>
          </div>

          {/* Column 5: Company Owner Info */}
          <div className="space-y-3 border-l border-[#D4AF76] pl-4">
            <h3 className="font-semibold text-lg text-[#8B4513]">Company Info</h3>
            <ul className="space-y-2 text-sm text-[#8B7355]">
              <li><span className="font-medium">Owner:</span> Parth Chawla</li>
              <li><span className="font-medium">Email:</span> liviqueofficial@gmail.com</li>
              {/* <li><span className="font-medium">Phone:</span> +91 98765 43210</li>
              <li><span className="font-medium">Address:</span> 123, Main Street, City, India</li> */}
            </ul>
          </div>
        </div>


                {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-[#D4AF76] text-sm text-[#8B7355] flex flex-col items-center md:flex-row md:items-center md:justify-between">
          {/* Left on desktop / top on mobile */}
          <p className="mb-2 md:mb-0 md:text-left">
            Powered By <a href="https://mokshdigital.app" target="_blank" className="underline hover:text-blue-500">Moksh Digital</a>
          </p>

          {/* Centered always */}
          <p className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            &copy; 2025 Livique. All Rights Reserved.
          </p>
        </div>


      </div>
    </footer>
  );
};


export default Footer;
