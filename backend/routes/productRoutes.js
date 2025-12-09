// backend/routes/productRoutes.js
import express from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  migrateProductsAddStockField,
  decreaseProductQuantity,
  deleteAllProducts
} from '../controllers/productController.js';
import { searchProducts } from "../controllers/productController.js";



const router = express.Router();

// Migration route - Add inStock field to existing products
router.post("/migrate/add-stock-field", migrateProductsAddStockField);

// Admin: Clear all products (for inventory reset)
router.delete('/admin/clear-all', deleteAllProducts);

// for searching products 
router.get("/search", searchProducts);

// Order matters: place ID route before "/"
router.get('/:id', getProductById);

// Decrease quantity (when order is placed)
router.put('/:id/decrease-quantity', decreaseProductQuantity);

// Update product
router.put('/:id', updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

// All products
router.get('/', getProducts);

// Create new product
router.post('/', createProduct);



export default router;
