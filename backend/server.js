import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import session from "express-session";
import passport from "./config/passport.js";

dotenv.config();
connectDB();

const app = express();

// ================== Parse body ==================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ================== CORS ==================
// Frontend ka base URL .env se (baad me yahan apna actual domain daalna)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:8080";

// Yahan pe sari allowed origins list karo
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  CLIENT_URL,
  "http://64.227.146.210",
  "http://64.227.146.210:5173",
];

// Dynamic CORS – Postman / server-to-server ke liye origin null allowed
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // mobile apps, Postman, curl, etc.
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
  })
);

// ================== Session BEFORE passport ==================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // HTTPS ho jaaye to isko true + proxy set karna
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
    // Frontend domain env se
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

// ================== Logout ==================
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
