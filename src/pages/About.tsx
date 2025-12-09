import { Heart, Truck, Award, Users, Gift, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#FFF8F0] to-white py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1
              className="text-4xl md:text-5xl font-bold text-[#5D4037]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              About Livique
            </h1>
            <p className="text-lg text-[#8B7355] leading-relaxed">
              Crafting joy through thoughtful gifting. We believe every moment deserves a perfect gift.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#5D4037] mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Our Story
                </h2>
                <div className="w-16 h-1 bg-[#D4AF76] rounded-full"></div>
              </div>
              <p className="text-[#8B7355] leading-relaxed text-justify">
                Founded with a simple yet powerful vision, Livique emerged from a passion for creating meaningful
                connections through thoughtful gifting. We started this journey believing that every gift tells a story,
                and every occasion deserves to be celebrated in a special way.
              </p>
              <p className="text-[#8B7355] leading-relaxed text-justify">
                What began as a small idea has blossomed into a comprehensive gifting platform offering curated
                collections ranging from personalized gifts to home décor, fashion accessories, and much more. Today,
                Livique stands as your trusted partner in gifting, serving customers who share our belief in the power
                of thoughtful giving.
              </p>
              <p className="text-[#8B7355] leading-relaxed text-justify">
                Our founder, <span className="font-semibold text-[#5D4037]">Parth Chawla</span>, envisioned a platform
                where quality meets affordability, and where every customer finds exactly what they're looking for to
                express their emotions.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F3ECE5] rounded-2xl p-8 border-2 border-[#D4AF76]">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Gift className="h-8 w-8 text-[#D4AF76] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#5D4037] text-lg">Our Mission</h3>
                      <p className="text-sm text-[#8B7355] mt-1">
                        To make gifting accessible, affordable, and joyful for everyone.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Heart className="h-8 w-8 text-[#D4AF76] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#5D4037] text-lg">Our Vision</h3>
                      <p className="text-sm text-[#8B7355] mt-1">
                        To be the most trusted and loved gifting platform in India.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Lightbulb className="h-8 w-8 text-[#D4AF76] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-[#5D4037] text-lg">Our Promise</h3>
                      <p className="text-sm text-[#8B7355] mt-1">
                        Quality products, exceptional service, and guaranteed happiness.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-[#FFF8F0]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-[#5D4037] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Why Choose Livique?
            </h2>
            <div className="w-16 h-1 bg-[#D4AF76] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-xl p-8 border border-[#D4AF76] hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-6">
                <Truck className="h-12 w-12 text-[#D4AF76]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5D4037] text-center mb-4">
                Fast & Reliable Delivery
              </h3>
              <p className="text-[#8B7355] text-center text-sm leading-relaxed">
                We ensure your gifts reach on time, every time. Quick processing and reliable shipping across India.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl p-8 border border-[#D4AF76] hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-6">
                <Award className="h-12 w-12 text-[#D4AF76]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5D4037] text-center mb-4">
                Premium Quality
              </h3>
              <p className="text-[#8B7355] text-center text-sm leading-relaxed">
                Handpicked products that meet our stringent quality standards. Only the best for your loved ones.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl p-8 border border-[#D4AF76] hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-[#D4AF76]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5D4037] text-center mb-4">
                Customer First
              </h3>
              <p className="text-[#8B7355] text-center text-sm leading-relaxed">
                Your satisfaction is our priority. Exceptional customer support available 24/7 to help you.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-xl p-8 border border-[#D4AF76] hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-6">
                <Gift className="h-12 w-12 text-[#D4AF76]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5D4037] text-center mb-4">
                Curated Collections
              </h3>
              <p className="text-[#8B7355] text-center text-sm leading-relaxed">
                From personalized gifts to premium collections, find the perfect present for every occasion.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-xl p-8 border border-[#D4AF76] hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-6">
                <Lightbulb className="h-12 w-12 text-[#D4AF76]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5D4037] text-center mb-4">
                Affordable Pricing
              </h3>
              <p className="text-[#8B7355] text-center text-sm leading-relaxed">
                Premium quality doesn't have to be expensive. We offer the best value for your money.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-xl p-8 border border-[#D4AF76] hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mb-6">
                <Users className="h-12 w-12 text-[#D4AF76]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5D4037] text-center mb-4">
                Community Driven
              </h3>
              <p className="text-[#8B7355] text-center text-sm leading-relaxed">
                Built by a passionate team dedicated to making gifting a delightful experience for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-[#5D4037] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Core Values
            </h2>
            <div className="w-16 h-1 bg-[#D4AF76] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F3ECE5] rounded-xl p-8 border border-[#D4AF76]">
              <h3 className="text-xl font-semibold text-[#5D4037] mb-3">Integrity</h3>
              <p className="text-[#8B7355] leading-relaxed">
                We believe in honest dealings and transparent practices with every customer and partner.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F3ECE5] rounded-xl p-8 border border-[#D4AF76]">
              <h3 className="text-xl font-semibold text-[#5D4037] mb-3">Innovation</h3>
              <p className="text-[#8B7355] leading-relaxed">
                Constantly evolving to bring you new and unique gifting solutions that delight and inspire.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F3ECE5] rounded-xl p-8 border border-[#D4AF76]">
              <h3 className="text-xl font-semibold text-[#5D4037] mb-3">Quality</h3>
              <p className="text-[#8B7355] leading-relaxed">
                No compromise on quality. Every product is carefully selected to ensure excellence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#FFF8F0] to-[#F3ECE5] rounded-xl p-8 border border-[#D4AF76]">
              <h3 className="text-xl font-semibold text-[#5D4037] mb-3">Care</h3>
              <p className="text-[#8B7355] leading-relaxed">
                Every gift tells a story. We care deeply about making your gifting experience special.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-16 md:py-20 bg-[#FFF8F0]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-[#5D4037] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Meet the Founder
            </h2>
            <div className="w-16 h-1 bg-[#D4AF76] rounded-full mx-auto"></div>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#D4AF76] shadow-lg">
              <div className="bg-gradient-to-r from-[#D4AF76] to-[#C9A076] h-32"></div>
              <div className="px-8 pb-8 -mt-16 relative">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-[#FFF8F0] border-4 border-[#D4AF76] flex items-center justify-center">
                    <Users className="h-16 w-16 text-[#D4AF76]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#5D4037] mt-6">Parth Chawla</h3>
                  <p className="text-[#D4AF76] font-semibold text-lg">Founder & Visionary</p>
                  <p className="text-[#8B7355] text-center mt-4 leading-relaxed max-w-md">
                    With a passion for gifting and a vision to revolutionize the way people express their emotions,
                    Parth founded Livique to create a platform where quality meets affordability. His dedication to
                    customer satisfaction drives everything we do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="bg-gradient-to-r from-[#5D4037] to-[#6B4C41] rounded-2xl p-12 text-center text-white space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Gift with Joy?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Explore our curated collections and find the perfect gift for your loved ones. Every gift is an
              opportunity to spread happiness.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/">
                <Button className="bg-[#D4AF76] hover:bg-[#C9A076] text-[#5D4037] font-semibold px-8 py-3">
                  Start Shopping
                </Button>
              </Link>
              <a href="mailto:liviqueofficial@gmail.com">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#5D4037] font-semibold px-8 py-3"
                >
                  Get in Touch
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 md:py-20 bg-[#FFF8F0]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-[#5D4037] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Get in Touch
            </h2>
            <div className="w-16 h-1 bg-[#D4AF76] rounded-full mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="inline-block bg-[#D4AF76] text-white rounded-full p-4 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#5D4037] mb-2">Support</h3>
              <p className="text-[#8B7355] text-sm">
                Have questions? Reach out to us anytime. We're here to help!
              </p>
            </div>

            <div className="text-center">
              <div className="inline-block bg-[#D4AF76] text-white rounded-full p-4 mb-4">
                <Gift className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-[#5D4037] mb-2">Email</h3>
              <a href="mailto:liviqueofficial@gmail.com" className="text-[#8B7355] text-sm hover:text-[#D4AF76] transition-colors">
                liviqueofficial@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
