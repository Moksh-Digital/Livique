// backend/controllers/productController.js
import mongoose from "mongoose";
import Product from '../models/productModel.js'; // Note the .js and default import

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
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

        // Validation
        if (!name || !price || !category || !description || !images || images.length === 0) {
            return res.status(400).json({ message: 'Please fill in all required fields (Name, Price, Category, Description, and at least one Image).' });
        }

        // Create product with proper slugs
        const product = await Product.create({
            name,
            price,
            originalPrice,
            category,
            categorySlug: category.toLowerCase().trim().replace(/\s+/g, "-"),
            subcategory,
            subcategorySlug: subcategory?.toLowerCase().trim().replace(/\s+/g, "-"),
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

// @desc    Get products with optional category/subcategory filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        let { category, subcategory } = req.query;
        let filter = {};

        // CATEGORY filter
        if (category) {
            category = category.trim().toLowerCase();
            filter.$or = [
                { categorySlug: { $regex: new RegExp(category, "i") } },
                { category: { $regex: new RegExp(category, "i") } },
            ];
        }

        // SUBCATEGORY filter
        if (subcategory) {
            subcategory = subcategory.trim().toLowerCase();
            // Replace hyphens in query with \s* to match spaces in DB
            const flexibleSub = subcategory.replace(/-/g, "\\s*");
            const subFilter = {
                $or: [
                    { subcategorySlug: { $regex: new RegExp(flexibleSub, "i") } },
                    { subcategory: { $regex: new RegExp(flexibleSub, "i") } },
                ],
            };

            if (filter.$or) {
                // Combine with AND if category filter already exists
                filter = { $and: [filter, subFilter] };
            } else {
                filter = subFilter;
            }
        }

        console.log("🧠 Applied Filter:", JSON.stringify(filter, null, 2));

        const products = await Product.find(filter);
        console.log(`✅ Found ${products.length} products`);
        res.json(products);
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ message: "Server Error fetching products" });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server Error fetching product' });
    }
};
