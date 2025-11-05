import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import session from "express-session";
import passport from "./config/passport.js";

dotenv.config();
connectDB();

const app = express();

// ⛔ Parse body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ✅ Allowed frontends (Vite & CRA)
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Session BEFORE passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());

// ✅ Google Auth Routes - UPDATED to respect prompt parameter
app.get("/api/users/auth/google",
  (req, res, next) => {
    // Check for 'prompt=select_account' in the incoming query string from the client
    const options = { scope: ["profile", "email"] };
    if (req.query.prompt === 'select_account') {
      options.prompt = 'select_account';
    }
    // Pass the options object (which now includes 'prompt' if present) to passport.authenticate
    passport.authenticate("google", options)(req, res, next);
  }
);

app.get(
  "/api/users/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:8080/signin" }),
  async (req, res) => {
    // user has JWT method on schema
    const token = req.user.generateToken();
    res.redirect(`http://localhost:8080?token=${token}`);
  }
);

// ✅ API ROOT
app.get('/', (req, res) => {
  res.send('Server running & MongoDB connected ✅');
});

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/payment", paymentRoutes);

// ✅ 404 Handler (BOTTOM always)
app.use((req, res, next) => {
  res.status(404).json({ message: `Route Not Found: ${req.originalUrl}` });
});

// ✅ General Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.json({ success: true, message: "Logged out" });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);