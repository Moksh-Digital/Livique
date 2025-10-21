// backend/controllers/productController.js
import Product from '../models/productModel.js'; // Note the .js and default import

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => { // Use export const for named export
    try {
        const { 
            name, 
            price, 
            originalPrice, 
            category, 
            subcategory, 
            mainImage, 
            images, 
            description, 
            delivery 
        } = req.body;

        // Simple validation
        if (!name || !price || !category || !description || !images || images.length === 0) {
            return res.status(400).json({ message: 'Please fill in all required fields (Name, Price, Category, Description, and at least one Image).' });
        }

        // Create the product in MongoDB
        const product = await Product.create({
            name,
            price,
            originalPrice,
            category,
            subcategory,
            mainImage,
            images,
            description,
            delivery,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during product creation' });
    }
};

// You can add getProducts, updateProduct, deleteProduct here later using export const

