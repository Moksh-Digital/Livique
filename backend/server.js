import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; // <-- NEW: Import the DB connection function
import userRoutes from './routes/userRoutes.js';
import productRoutes from "./routes/productRoutes.js"; // 👈 Add .js at end when using imports
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from "./routes/addressRoutes.js";

// Load environment variables
dotenv.config();

// -----------------------------------------------------------------
// NEW: CONNECT TO DATABASE
connectDB(); // <-- NEW: Call the function to connect to MongoDB
// -----------------------------------------------------------------

const app = express();

// Middleware to parse JSON in request body
app.use(express.json({ limit: '50mb' })); // Increase limit for large images (base64)
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// -----------------------------------------------------------------
// 1. CONFIGURE CORS MIDDLEWARE
// This allows requests from your frontend (localhost:8080) to the backend.
const allowedOrigins = [
    'http://localhost:8080', // Your React development server
    // Add your production domain here when you deploy!
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true); 
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and authentication headers
}));
// -----------------------------------------------------------------


// Middleware to parse JSON bodies
app.use(express.json());

// Root route (API health check)
app.get('/', (req, res) => {
    // UPDATED MESSAGE to reflect MongoDB usage
    res.send('OTP API is running! (MongoDB Connected)');
});

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Add this line
app.use("/api/address", addressRoutes);


// --- Error Handling Middleware ---

// 1. Not Found (404) Handler
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// 2. Generic Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);