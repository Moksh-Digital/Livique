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
    categorySlug: {
      type: String,
      required: false,
    },
    subcategory: {
      type: String,
      required: false,
    },
    subcategorySlug: {
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
    deliveryDate: {
      type: String, // or Date if you want actual Date type
      required: false,
    },
    deliveryCharge: {
      type: Number,
      default: 499,
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
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
