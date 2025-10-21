// backend/models/productModel.js
import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        originalPrice: {
            type: Number,
            required: false,
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
        },
        subcategory: {
            type: String,
            required: false,
        },
        images: {
            type: [String], 
            required: [true, 'Please upload at least one image'],
        },
        mainImage: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: [true, 'Please add a product description'],
        },
        delivery: {
            type: String,
            required: false,
        },
        discount: {
            type: String,
            required: false,
        },
        rating: {
            type: Number,
            default: 4.5,
        },
        reviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Use default export here
const Product = mongoose.model('Product', productSchema);
export default Product;