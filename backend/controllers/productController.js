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
            delivery,
            quantity
        } = req.body;

        // Validation
        if (!name || !price || !category || !description || !images || images.length === 0) {
            return res.status(400).json({ message: 'Please fill in all required fields (Name, Price, Category, Description, and at least one Image).' });
        }

        // Create product with proper slugs that match frontend categories
        // Map category names to their exact slugs from frontend (new taxonomy)
        const categorySlugMap = {
            'home decor': 'home-decor',
            'gift items': 'gift-items',
            'toys': 'toys',
            'jewelry': 'jewelry',
            'hair accessories': 'hair-accessories',
            'bags & wallets': 'bags-wallets',
            'bags and wallets': 'bags-wallets',
            'sunglasses & eyewear': 'sunglasses-eyewear',
            'sunglasses and eyewear': 'sunglasses-eyewear',
            'watches': 'watches',
            'belts & scarves': 'belts-scarves',
            'belts and scarves': 'belts-scarves',
            'footwear accessories': 'footwear-accessories',
            'other fashion accessories': 'other-fashion-accessories'
        };
        
        const categorySlug = categorySlugMap[category.toLowerCase()] || category.toLowerCase().trim().replace(/\s+/g, "-").replace(/&/g, "and");
        
        // Map subcategory names to their exact slugs from frontend (new taxonomy)
        const subcategorySlugMap = {
            // Home Decor
            'wall clock': 'wall-clock',
            'candle stand': 'candle-stand',
            'flower vase': 'flower-vase',
            'table lamp': 'table-lamp',
            'photo frame': 'photo-frame',
            'decorative mirror': 'decorative-mirror',
            'wall art': 'wall-art',

            // Gift Items
            'perfume set': 'perfume-set',
            'greeting card': 'greeting-card',
            'mini plant pot': 'mini-plant-pot',
            'gift box': 'gift-box',
            'jewelry organizer': 'jewelry-organizer',
            'customized mug': 'customized-mug',
            'scented candle': 'scented-candle',

            // Toys
            'teddy bear': 'teddy-bear',
            'remote car': 'remote-car',
            'building blocks': 'building-blocks',
            'doll set': 'doll-set',
            'puzzle game': 'puzzle-game',
            'soft toy bunny': 'soft-toy-bunny',
            'action figure': 'action-figure',

            // Jewelry
            'earrings': 'earrings',
            'necklaces': 'necklaces',
            'bracelets & bangles': 'bracelets-bangles',
            'bracelets and bangles': 'bracelets-bangles',
            'rings': 'rings',
            'anklets': 'anklets',
            'nose pins': 'nose-pins',

            // Hair Accessories
            'hairbands': 'hairbands',
            'scrunchies': 'scrunchies',
            'claw clips': 'claw-clips',
            'hair pins & barrettes': 'hair-pins-barrettes',
            'hair pins and barrettes': 'hair-pins-barrettes',
            'head wraps & scarves': 'head-wraps-scarves',
            'head wraps and scarves': 'head-wraps-scarves',

            // Bags & Wallets
            'handbags': 'handbags',
            'sling bags': 'sling-bags',
            'tote bags': 'tote-bags',
            'mini purses': 'mini-purses',
            'clutches': 'clutches',
            'wallets': 'wallets',

            // Sunglasses & Eyewear
            'oversized sunglasses': 'oversized-sunglasses',
            'cat-eye sunglasses': 'cat-eye-sunglasses',
            'round frames': 'round-frames',
            'transparent frames': 'transparent-frames',
            'fashion specs': 'fashion-specs',

            // Watches
            'metal strap watches': 'metal-strap-watches',
            'leather strap watches': 'leather-strap-watches',
            'bracelet watches': 'bracelet-watches',
            'smart analog styles': 'smart-analog-styles',

            // Belts & Scarves
            'leather belts': 'leather-belts',
            'chain belts': 'chain-belts',
            'fabric belts': 'fabric-belts',
            'printed scarves': 'printed-scarves',
            'solid color scarves': 'solid-color-scarves',

            // Footwear Accessories
            'toe rings': 'toe-rings',
            'anklets beaded metal': 'anklets-beaded-metal',
            'shoe clips charms': 'shoe-clips-charms',

            // Other Fashion Accessories
            'brooches': 'brooches',
            'caps & hats': 'caps-hats',
            'caps and hats': 'caps-hats',
            'gloves': 'gloves',
            'keychains bag charms': 'keychains-bag-charms'
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
            quantity: quantity || 0,
            inStock: (quantity && quantity > 0) ? true : false,
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

            // Define category to subcategory mapping based on new fashion shop structure
            const categorySubcategoryMap = {
                'home-decor': ['wall-clock', 'candle-stand', 'flower-vase', 'table-lamp', 'photo-frame', 'decorative-mirror', 'wall-art'],
                'gift-items': ['perfume-set', 'greeting-card', 'mini-plant-pot', 'gift-box', 'jewelry-organizer', 'customized-mug', 'scented-candle'],
                'toys': ['teddy-bear', 'remote-car', 'building-blocks', 'doll-set', 'puzzle-game', 'soft-toy-bunny', 'action-figure'],
                'jewelry': ['earrings', 'necklaces', 'bracelets-bangles', 'rings', 'anklets', 'nose-pins'],
                'hair-accessories': ['hairbands', 'scrunchies', 'claw-clips', 'hair-pins-barrettes', 'head-wraps-scarves'],
                'bags-wallets': ['handbags', 'sling-bags', 'tote-bags', 'mini-purses', 'clutches', 'wallets'],
                'sunglasses-eyewear': ['oversized-sunglasses', 'cat-eye-sunglasses', 'round-frames', 'transparent-frames', 'fashion-specs'],
                'watches': ['metal-strap-watches', 'leather-strap-watches', 'bracelet-watches', 'smart-analog-styles'],
                'belts-scarves': ['leather-belts', 'chain-belts', 'fabric-belts', 'printed-scarves', 'solid-color-scarves'],
                'footwear-accessories': ['toe-rings', 'anklets-beaded-metal', 'shoe-clips-charms'],
                'other-fashion-accessories': ['brooches', 'caps-hats', 'gloves', 'keychains-bag-charms']
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


//for searching product i have i used this  searchbar functionality
export const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: { $regex: req.query.keyword, $options: "i" }, // case-insensitive
        }
      : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server error while searching" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully", productId: id });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
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
      deliveryCharge,
      discount,
      rating,
      reviews,
      inStock,
      quantity
    } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validation
    if (!name || !price || !category || !description || !images || images.length === 0) {
      return res.status(400).json({ message: 'Please fill in all required fields (Name, Price, Category, Description, and at least one Image).' });
    }

    // Update product with new data
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
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
        deliveryCharge,
        discount,
        rating,
        reviews,
        inStock,
        quantity
      },
      { new: true } // Return the updated document
    );

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

// @desc    Migrate existing products - Add inStock field to products that don't have it
// @route   POST /api/products/migrate/add-stock-field
// @access  Private/Admin
export const migrateProductsAddStockField = async (req, res) => {
  try {
    // Update all products that don't have inStock field
    const result = await Product.updateMany(
      { inStock: { $exists: false } },
      { $set: { inStock: true } }
    );

    res.json({ 
      message: "Migration completed", 
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount
    });
  } catch (error) {
    console.error("Error during migration:", error);
    res.status(500).json({ message: "Server error during migration" });
  }
};

// @desc    Decrease product quantity (when order is placed)
// @route   PUT /api/products/:id/decrease-quantity
// @access  Private
export const decreaseProductQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if enough quantity available
    if (product.quantity < quantity) {
      return res.status(400).json({ 
        message: "Insufficient stock", 
        available: product.quantity,
        requested: quantity
      });
    }

    // Decrease quantity
    const newQuantity = product.quantity - quantity;
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        quantity: newQuantity,
        inStock: newQuantity > 0 ? true : false
      },
      { new: true }
    );

    res.json({ 
      message: "Product quantity decreased successfully", 
      product: updatedProduct,
      previousQuantity: product.quantity,
      newQuantity: newQuantity
    });
  } catch (error) {
    console.error("Error decreasing product quantity:", error);
    res.status(500).json({ message: "Server error while decreasing quantity" });
  }
};

// @desc    Delete all products (for admin - clearing old inventory)
// @route   DELETE /api/products/admin/clear-all
// @access  Private (Admin only)
export const deleteAllProducts = async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.json({ 
      message: "All products deleted successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error("Error deleting all products:", error);
    res.status(500).json({ message: "Server error while deleting products" });
  }
};
