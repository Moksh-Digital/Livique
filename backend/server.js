import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import session from "express-session";
import passport from "./config/passport.js"; 

dotenv.config();
connectDB();

const app = express();

// ================== Parse body ==================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ================== CORS ==================
// Determine frontend URL based on environment
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";

// Yahan pe sari allowed origins list karo
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
  "http://64.227.146.210",
  "http://64.227.146.210:5000",
  "https://livique-psi.vercel.app",
  "https://www.livique.co.in",
  "https://livique.co.in",
  "https://api.livique.co.in",
  CLIENT_URL,
];


// Dynamic CORS – Postman / server-to-server ke liye origin null allowed
// ✅ Simple CORS – sab allowed origins ko reflect karo
app.use(
  cors({
    origin: (origin, callback) => {
      // Postman / mobile ke liye
      if (!origin) return callback(null, true);

      // Agar hamari list me hai to allow
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ⚠️ Agar future me tighten karna ho, yaha error de sakte ho.
      // Abhi ke liye: TESTING mein sab allow karo
      return callback(null, true);
    },
    credentials: true,
  })
);



// ================== Session BEFORE passport ==================
const isProduction = process.env.NODE_ENV === "production" || !!process.env.BACKEND_URL?.includes("api.livique");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      httpOnly: true,
      sameSite: isProduction ? "lax" : false,
      domain: isProduction ? ".livique.co.in" : undefined,
    },
  })
);

// ================== Passport ==================
app.use(passport.initialize());
app.use(passport.session());

// ================== Google Auth Routes ==================
app.get("/api/users/auth/google", (req, res, next) => {
  const options = { scope: ["profile", "email"] };

  // prompt=select_account support
  if (req.query.prompt === "select_account") {
    options.prompt = "select_account";
  }

  passport.authenticate("google", options)(req, res, next);
});

app.get(
  "/api/users/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${CLIENT_URL}/signin`,
  }),
  async (req, res) => {
    const token = req.user.generateToken();
    res.redirect(`${CLIENT_URL}?token=${token}`);
  }
);

// ================== API ROOT ==================
app.get("/", (req, res) => {
  res.send("Server running & MongoDB connected ✅");
});

// ================== API Routes ==================
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/push", pushRoutes);

// ================== Product Meta Tags for Social Sharing ==================
app.get("/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Fetch product from database
    const response = await fetch(`http://localhost:5000/api/products/${id}`);
    if (!response.ok) {
      return res.redirect("https://www.livique.co.in");
    }
    
    const product = await response.json();
    
    // Prepare meta tags
    const productImage = product.mainImage || (product.images && product.images[0]) || product.image;
    const absoluteImageUrl = productImage && !productImage.startsWith('http') 
      ? `https://api.livique.co.in${productImage.startsWith('/') ? '' : '/'}${productImage}`
      : productImage;
    
    const productTitle = `${product.name} - Livique`;
    const productPrice = `₹${product.price.toLocaleString()}`;
    const productDescription = product.description 
      ? `${product.description} | ${productPrice}`
      : `Buy ${product.name} on Livique | ${productPrice}`;
    const productUrl = `https://www.livique.co.in/product/${product._id || product.id}`;
    
    // Build HTML with meta tags
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${escapeHtml(productTitle)}</title>
          <meta name="description" content="${escapeHtml(productDescription)}">
          
          <!-- Open Graph Tags -->
          <meta property="og:title" content="${escapeHtml(productTitle)}">
          <meta property="og:description" content="${escapeHtml(productDescription)}">
          <meta property="og:image" content="${escapeHtml(absoluteImageUrl)}">
          <meta property="og:url" content="${escapeHtml(productUrl)}">
          <meta property="og:type" content="product">
          <meta property="og:site_name" content="Livique">
          
          <!-- Twitter Card Tags -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${escapeHtml(productTitle)}">
          <meta name="twitter:description" content="${escapeHtml(productDescription)}">
          <meta name="twitter:image" content="${escapeHtml(absoluteImageUrl)}">
          <meta name="twitter:site" content="@Livique">
          
          <!-- Redirect to actual app -->
          <script>
            window.location.href = '${productUrl}';
          </script>
        </head>
        <body>
          <p>Redirecting to Livique...</p>
        </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    
  } catch (error) {
    console.error("Error fetching product meta tags:", error);
    res.redirect("https://www.livique.co.in");
  }
});

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.json({ success: true, message: "Logged out" });
    });
  });
});

// ================== 404 Handler ==================
app.use((req, res, next) => {
  res.status(404).json({ message: `Route Not Found: ${req.originalUrl}` });
});

// ================== General Error Handler ==================
app.use((err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

// ================== Start Server ==================
const PORT = process.env.PORT || 5000;

// IMPORTANT: "0.0.0.0" so droplet IP se access ho sake
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
