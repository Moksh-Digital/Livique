// backend/routes/productRoutes.js
import express from 'express';
import { createProduct } from '../controllers/productController.js'; // Note the .js and named import

const router = express.Router();

// Route to create a new product
router.post('/', createProduct); 


export default router; // Use export default for server.js to import