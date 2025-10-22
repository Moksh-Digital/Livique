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

        // Create product with proper slugs that match frontend categories
        // Map category names to their exact slugs from frontend
        const categorySlugMap = {
            'gifts': 'gifts',
            'food & sweets': 'food-sweets',
            'food and sweets': 'food-sweets',
            'home & decor': 'home-decor',
            'home and decor': 'home-decor',
            'flowers': 'flowers',
            'electronics': 'electronics',
            'fashion': 'fashion',
            'beauty & personal care': 'beauty-personal-care',
            'beauty and personal care': 'beauty-personal-care',
            'books & stationery': 'books-stationery',
            'books and stationery': 'books-stationery',
            'sports & fitness': 'sports-fitness',
            'sports and fitness': 'sports-fitness',
            'toys & baby products': 'toys-baby-products',
            'toys and baby products': 'toys-baby-products',
            'grocery & food': 'grocery-food',
            'grocery and food': 'grocery-food',
            'appliances': 'appliances',
            'automotive': 'automotive'
        };
        
        const categorySlug = categorySlugMap[category.toLowerCase()] || category.toLowerCase().trim().replace(/\s+/g, "-").replace(/&/g, "").replace(/and/g, "");
        
        // Map subcategory names to their exact slugs from frontend
        const subcategorySlugMap = {
            'mobile phones': 'mobile-phones',
            'men clothing': 'men-clothing',
            'women clothing': 'women-clothing',
            'kids clothing': 'kids-clothing',
            'men footwear': 'men-footwear',
            'women footwear': 'women-footwear',
            'bags & luggage': 'bags-luggage',
            'bags and luggage': 'bags-luggage',
            'skin care': 'skin-care',
            'hair care': 'hair-care',
            'bath & body': 'bath-body',
            'bath and body': 'bath-body',
            'men grooming': 'men-grooming',
            'beauty tools': 'beauty-tools',
            'sketch books': 'sketch-books',
            'school supplies': 'school-supplies',
            'art supplies': 'art-supplies',
            'office supplies': 'office-supplies',
            'exercise equipment': 'exercise-equipment',
            'sports shoes': 'sports-shoes',
            'baby care': 'baby-care',
            'baby fashion': 'baby-fashion',
            'baby feeding': 'baby-feeding',
            'baby gear': 'baby-gear',
            'fruits & vegetables': 'fruits-vegetables',
            'fruits and vegetables': 'fruits-vegetables',
            'dairy products': 'dairy-products',
            'cooking essentials': 'cooking-essentials',
            'air conditioners': 'air-conditioners',
            'washing machines': 'washing-machines',
            'microwave ovens': 'microwave-ovens',
            'vacuum cleaners': 'vacuum-cleaners',
            'kitchen appliances': 'kitchen-appliances',
            'car accessories': 'car-accessories',
            'motorcycle parts': 'motorcycle-parts',
            'home decor items': 'home-decor-items',
            'fresh flowers': 'fresh-flowers',
            'flower bouquets': 'flower-bouquets',
            'flower arrangements': 'flower-arrangements',
            'smart watches': 'smart-watches',
            'power banks': 'power-banks',
            'gaming consoles': 'gaming-consoles',
            'same day delivery': 'same-day-delivery',
            'personalized gifts': 'personalized-gifts',
            'gift hampers': 'gift-hampers',
            'hatke gifts': 'hatke-gifts',
            'dry fruits': 'dry-fruits'
        };
        
        const subcategorySlug = subcategory ? (subcategorySlugMap[subcategory.toLowerCase()] || subcategory.toLowerCase().trim().replace(/\s+/g, "-")) : undefined;
        
        console.log("🔄 Creating product with:", {
            category,
            categorySlug,
            subcategory,
            subcategorySlug
        });
        
        const product = await Product.create({
            name,
            price,
            originalPrice,
            category,
            categorySlug,
            subcategory,
            subcategorySlug,
            mainImage,
            images,
            description,
            delivery,
            deliveryCharge: req.body.deliveryCharge || 0,
            discount: req.body.discount || "0% OFF",
            rating: req.body.rating || 4.8,
            reviews: req.body.reviews || 100,
        });

        console.log("🆕 Created product:", {
            name: product.name,
            category: product.category,
            categorySlug: product.categorySlug,
            subcategory: product.subcategory,
            subcategorySlug: product.subcategorySlug
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

            // Define category to subcategory mapping based on new structure
            const categorySubcategoryMap = {
                'gifts': ['diwali-gifts', 'birthday-gifts', 'bhai-dooj', 'anniversary', 'gift-hampers', 'same-day-delivery', 'personalized-gifts', 'experiences', 'hatke-gifts'],
                'food-sweets': ['sweets', 'chocolates', 'dry-fruits', 'cakes'],
                'home-decor': ['home-decor-items', 'diyas', 'furniture', 'lighting'],
                'flowers': ['fresh-flowers', 'flower-bouquets', 'flower-arrangements'],
                'electronics': ['mobile-phones', 'laptops', 'tablets', 'televisions', 'cameras', 'headphones', 'speakers', 'smart-watches', 'power-banks', 'gaming-consoles'],
                'fashion': ['men-clothing', 'women-clothing', 'kids-clothing', 'men-footwear', 'women-footwear', 'watches', 'sunglasses', 'bags-luggage', 'jewellery', 'accessories'],
                'beauty-personal-care': ['makeup', 'skin-care', 'hair-care', 'fragrances', 'bath-body', 'men-grooming', 'beauty-tools'],
                'books-stationery': ['books', 'pens', 'pencils', 'notebooks', 'sketch-books', 'erasers', 'school-supplies', 'art-supplies', 'office-supplies'],
                'sports-fitness': ['exercise-equipment', 'yoga', 'sports-shoes', 'cricket', 'football', 'badminton', 'swimming', 'cycling'],
                'toys-baby-products': ['toys', 'baby-care', 'baby-fashion', 'diapers', 'baby-feeding', 'baby-gear'],
                'grocery-food': ['fruits-vegetables', 'dairy-products', 'beverages', 'snacks', 'cooking-essentials', 'organic'],
                'appliances': ['air-conditioners', 'refrigerators', 'washing-machines', 'microwave-ovens', 'vacuum-cleaners', 'kitchen-appliances'],
                'automotive': ['car-accessories', 'motorcycle-parts', 'tools', 'maintenance']
            };

            // Get subcategories for this category
            const subcategories = categorySubcategoryMap[category] || [];
            
            // Create filter conditions - we want to show products that match either:
            // 1. The main category (direct match)
            // 2. Any of the subcategories under this main category
            const categoryConditions = [];
            
            // Add main category conditions (exact match)
            const flexibleCategory = category.replace(/-/g, "\\s*");
            categoryConditions.push(
                { categorySlug: { $regex: new RegExp(`^${category}$`, "i") } },
                { category: { $regex: new RegExp(`^${flexibleCategory}$`, "i") } },
                // Also match the original category name variations
                { category: { $regex: new RegExp(category.replace(/-/g, "\\s*"), "i") } }
            );
            
            // Add subcategory conditions (products in subcategories should show in main category)
            subcategories.forEach(sub => {
                const flexibleSub = sub.replace(/-/g, "\\s*");
                categoryConditions.push(
                    { subcategorySlug: { $regex: new RegExp(`^${sub}$`, "i") } },
                    { subcategory: { $regex: new RegExp(`^${flexibleSub}$`, "i") } }
                );
            });
            
            console.log("🔍 Category conditions:", JSON.stringify(categoryConditions, null, 2));
            console.log("🔍 Subcategories for", category, ":", subcategories);

            filter.$or = categoryConditions;
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
        console.log("🔍 Category:", category);
        console.log("🔍 Subcategory:", subcategory);

        const products = await Product.find(filter);
        console.log(`✅ Found ${products.length} products`);
        
        // Debug: Log first few products to see their category/subcategory
        if (products.length > 0) {
            console.log("📦 Sample products:");
            products.slice(0, 3).forEach((product, index) => {
                console.log(`  ${index + 1}. ${product.name} - Category: ${product.category} (${product.categorySlug}) - Subcategory: ${product.subcategory} (${product.subcategorySlug})`);
            });
        }
        
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
