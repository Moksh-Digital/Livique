// backend/routes/productRoutes.js
import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct
} from '../controllers/productController.js';
import { searchProducts } from "../controllers/productController.js";



const router = express.Router();

// for searching products 
router.get("/search", searchProducts);

// Order matters: place ID route before "/"
router.get('/:id', getProductById);

// Delete product
router.delete('/:id', deleteProduct);

// All products
router.get('/', getProducts);

// Create new product
router.post('/', createProduct);



export default router;
