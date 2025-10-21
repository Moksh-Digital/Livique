import { Gift, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
// import { Link } from "react-router-dom"; // Link component error de raha tha, isliye abhi ke liye 'a' tag use kar rahe hain.

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand and Socials */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-2 text-2xl font-bold">
              <Gift className="h-6 w-6 text-accent" />
              <span>fnp</span>
            </a>
            <p className="text-sm opacity-80">
              Gifting happiness, one surprise at a time. Your one-stop shop for gifts, flowers, and cakes for every occasion.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 hover:text-accent transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Know Us */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Know Us</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">About Us</a></li>
              <li><a href="/contact" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Contact Us</a></li>
              <li><a href="/careers" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Careers</a></li>
              <li><a href="/blog" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Blog</a></li>
            </ul>
          </div>

          {/* Column 3: Our Policies */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Our Policies</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Terms & Conditions</a></li>
              <li><a href="/privacy" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Privacy Policy</a></li>
              <li><a href="/refund" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Refund Policy</a></li>
              <li><a href="/faq" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">FAQs</a></li>
            </ul>
          </div>

          {/* Column 4: Top Categories */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Top Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/category/flowers" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Flowers</a></li>
              <li><a href="/category/cakes" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Cakes</a></li>
              <li><a href="/category/gift-hampers" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Gift Hampers</a></li>
              <li><a href="/category/personalised" className="opacity-80 hover:opacity-100 hover:underline transition-opacity">Personalised Gifts</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm opacity-80">
          <p>&copy; 2025 Livique. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

