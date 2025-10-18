import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const Home = () => {
  const categories = [
    { id: 1, name: "Diwali Gifts", image: "🪔", date: "20th Oct" },
    { id: 2, name: "Birthday Gifts", image: "🎂" },
    { id: 3, name: "Bhai Dooj", image: "👫", date: "23rd Oct" },
    { id: 4, name: "Flowers", image: "🌹" },
    { id: 5, name: "Same Day...", image: "🛵" },
    { id: 6, name: "FNP Luxe", image: "💎", badge: "SELECT CITIES ONLY" },
    { id: 7, name: "Hatke Gifts", image: "🎁" },
    { id: 8, name: "Home Decor", image: "🕯️" },
    { id: 9, name: "Anniversary", image: "💑" },
  ];

  const diwaliCategories = [
    { name: "Gift Hampers", image: "🎁" },
    { name: "Sweets", image: "🍬" },
    { name: "Dry Fruits", image: "🥜" },
    { name: "Chocolates", image: "🍫" },
    { name: "Home Decor", image: "🪔" },
    { name: "Diyas", image: "🕯️" },
    { name: "Bhai Dooj Gifts", image: "🎀" },
    { name: "Send Gifts", image: "🌍" },
  ];

  const birthdayCategories = [
    { name: "Cakes", image: "🎂" },
    { name: "Flowers", image: "🌸" },
    { name: "Personalised", image: "🖼️" },
    { name: "Experiences", image: "🎸" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Hero Banners */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-blue-50 p-8 rounded-2xl">
            <div className="absolute top-4 left-4 text-4xl">✨</div>
            <div className="absolute bottom-4 left-4 text-4xl">🪔</div>
            <div className="relative z-10">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                20TH - 21ST OCTOBER
              </p>
              <h2 className="text-4xl font-bold mb-2">
                Celebrate<br />Dil Ki Diwali
              </h2>
              <p className="text-muted-foreground mb-4">
                Festive blessings<br />and sweet delights!
              </p>
              <Button className="bg-secondary hover:bg-secondary/90">
                ORDER NOW
              </Button>
            </div>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-pink-50 p-8 rounded-2xl">
            <div className="relative z-10">
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                23RD OCTOBER | BHAI DOOJ
              </p>
              <h2 className="text-4xl font-bold text-secondary mb-2">
                Bhai Jaisa,<br />Dooja Nahi
              </h2>
              <p className="text-muted-foreground mb-4">
                Celebrate your bond<br />with festive delights!
              </p>
              <Button className="bg-secondary hover:bg-secondary/90">
                ORDER NOW
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Categories */}
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4 mb-12">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.name.toLowerCase().replace(/\s/g, "-")}`}>
              <Card className="relative p-4 aspect-square flex flex-col items-center justify-center hover:shadow-lg transition-shadow rounded-2xl bg-gradient-to-br from-orange-100 to-yellow-100">
                {cat.date && (
                  <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {cat.date}
                  </span>
                )}
                {cat.badge && (
                  <span className="absolute bottom-2 left-2 right-2 bg-accent text-xs px-1 py-0.5 rounded text-center font-semibold">
                    {cat.badge}
                  </span>
                )}
                <span className="text-4xl mb-2">{cat.image}</span>
                <span className="text-xs font-medium text-center">{cat.name}</span>
              </Card>
            </Link>
          ))}
        </div>

        {/* Diwali Surprises Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Diwali Surprises</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="relative p-8 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-3xl overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-2 border-t-4 border-dotted border-yellow-300"></div>
                <div className="absolute top-8 left-0 right-0 flex justify-around">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                  DHAMAKEDAAR<br />GIFTS
                </h3>
              </div>
            </Card>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {diwaliCategories.map((cat, idx) => (
                <Link key={idx} to={`/category/diwali-${cat.name.toLowerCase().replace(/\s/g, "-")}`}>
                  <Card className="p-6 h-full flex flex-col items-center justify-center hover:shadow-lg transition-shadow rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-200">
                    <span className="text-5xl mb-3">{cat.image}</span>
                    <span className="text-sm font-semibold text-center">{cat.name}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Birthday Gifts Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Birthday Gifts That Wow</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {birthdayCategories.map((cat, idx) => (
              <Link key={idx} to={`/category/birthday-${cat.name.toLowerCase()}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-2xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl">
                    {cat.image}
                  </div>
                  <div className="p-4 text-center font-semibold">
                    {cat.name}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular in Gifting */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Popular In Gifting</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <Link key={item} to="/products">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-2xl">
                  <div className="aspect-square bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center text-6xl">
                    🎁
                  </div>
                  <div className="p-4 text-center">
                    <p className="font-semibold text-sm">Gift Item {item}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
