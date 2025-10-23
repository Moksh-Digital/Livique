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
        // Map category names to their exact slugs from frontend (new taxonomy)
        const categorySlugMap = {
            'accessories': 'accessories',
            'home & lifestyle': 'home-lifestyle',
            'home and lifestyle': 'home-lifestyle',
            'sale & offers': 'sale-offers',
            'sale and offers': 'sale-offers',
            'home decor': 'home-decor-gifting',
            'home decor & gifting': 'home-decor-gifting',
            'home decor and gifting': 'home-decor-gifting',
            'aesthetic gifts': 'aesthetic-gifts',
            'beauty & self care': 'beauty-self-care',
            'beauty and self care': 'beauty-self-care',
            'toys': 'toys',
            'customized gifts': 'customized-gifts',
            'customised gifts': 'customized-gifts',
            'flowers': 'flowers',
            'sweets & chocolates': 'sweets-chocolates',
            'sweets and chocolates': 'sweets-chocolates',
            'jewelry & accessories': 'jewelry-accessories',
            'jewelry and accessories': 'jewelry-accessories'
        };
        
        const categorySlug = categorySlugMap[category.toLowerCase()] || category.toLowerCase().trim().replace(/\s+/g, "-").replace(/&/g, "").replace(/and/g, "");
        
        // Map subcategory names to their exact slugs from frontend (new taxonomy)
        const subcategorySlugMap = {
            // Accessories
            'bags & clutches': 'bags-clutches',
            'bags and clutches': 'bags-clutches',
            'scarves & stoles': 'scarves-stoles',
            'scarves and stoles': 'scarves-stoles',

            // Home & Lifestyle
            'cushions': 'cushions',
            'candles & home fragrances': 'candles-home-fragrances',
            'candles and home fragrances': 'candles-home-fragrances',

            // Sale & Offers
            'clearance stock': 'clearance-stock',
            'limited time offers': 'limited-time-offers',

            // Home Decor
            'clocks': 'clocks',
            'show pieces': 'show-pieces',
            'scented candles': 'scented-candles',
            'indoor plants': 'indoor-plants',
            'table lamps': 'table-lamps',
            'wall art': 'wall-art',
            'posters': 'posters',

            // Aesthetic Gifts
            'candles': 'candles',
            'diffusers': 'diffusers',
            'crystals': 'crystals',
            'trays': 'trays',

            // Beauty & Self Care
            'perfumes': 'perfumes',
            'skincare kits': 'skincare-kits',
            'bath & body gift sets': 'bath-body-gift-sets',
            'shaving kits': 'shaving-kits',
            'makeup hampers': 'makeup-hampers',
            'haircare sets': 'haircare-sets',
            'spa hampers': 'spa-hampers',
            'fragrance candles': 'fragrance-candles',
            'essential oil sets': 'essential-oil-sets',
            'relaxation boxes': 'relaxation-boxes',

            // Toys
            'teddy bears': 'teddy-bears',
            'barbie dolls': 'barbie-dolls',
            'mini toys': 'mini-toys',
            'toys by age': 'toys-by-age',
            'desk toys': 'desk-toys',

            // Customized Gifts
            'customized mugs': 'customized-mugs',
            'customised mugs': 'customized-mugs',
            'customized shirts': 'customized-shirts',
            'customised shirts': 'customized-shirts',
            'engraved pens': 'engraved-pens',

            // Flowers
            'flower bouquets': 'flower-bouquets',
            'flower baskets': 'flower-baskets',

            // Sweets & Chocolates
            'chocolates': 'chocolates',
            'sweets': 'sweets',

            // Jewelry & Accessories
            'bracelets': 'bracelets',
            'pendants': 'pendants',
            'earrings': 'earrings',
            'wallets & belts': 'wallets-belts',
            'wallets and belts': 'wallets-belts',
            'handbags & clutches': 'handbags-clutches',
            'handbags and clutches': 'handbags-clutches'
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

            // Define category to subcategory mapping based on new gift shop structure
            const categorySubcategoryMap = {
                'accessories': ['bags-clutches', 'scarves-stoles'],
                'home-lifestyle': ['cushions', 'candles-home-fragrances'],
                'sale-offers': ['clearance-stock', 'limited-time-offers'],
                'home-decor-gifting': ['clocks', 'show-pieces', 'scented-candles', 'indoor-plants', 'table-lamps', 'wall-art', 'posters'],
                'aesthetic-gifts': ['candles', 'diffusers', 'crystals', 'trays'],
                'beauty-self-care': ['perfumes', 'skincare-kits', 'bath-body-gift-sets', 'shaving-kits', 'makeup-hampers', 'haircare-sets', 'spa-hampers', 'fragrance-candles', 'essential-oil-sets', 'relaxation-boxes'],
                'toys': ['teddy-bears', 'barbie-dolls', 'mini-toys', 'toys-by-age', 'desk-toys'],
                'customized-gifts': ['customized-mugs', 'customized-shirts', 'engraved-pens'],
                'flowers': ['flower-bouquets', 'flower-baskets'],
                'sweets-chocolates': ['chocolates', 'sweets'],
                'jewelry-accessories': ['bracelets', 'pendants', 'earrings', 'wallets-belts', 'handbags-clutches']
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
