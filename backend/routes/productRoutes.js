// backend/routes/productRoutes.js
import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById
} from '../controllers/productController.js';

const router = express.Router();

// Order matters: place ID route before "/"
router.get('/:id', getProductById);

// All products
router.get('/', getProducts);

// Create new product
router.post('/', createProduct);

export default router;
