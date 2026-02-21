const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Information (name replaced with seoTitle)
  slug: {
    type: String,
    unique: true,
    sparse: true,  // Allow multiple null values
    required: false,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Product Classification
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  category: {
    type: String,
    required: true,
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    default: null,
    index: true
  },
  // Vendor / Seller Reference
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    index: true
  },
  subCategory: {
    type: String,
  },

  // Brand and Model
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  
  // Inventory Management
  sku: {
    type: String,
    required: false,
    uppercase: true
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },

  // Physical Properties
  weight: {
    type: Number, // in grams
    min: 0
  },
  dimensions: {
    length: { type: Number, min: 0 }, // in cm
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  
  // Inventory
  stockQuantity: {
    type: Number,
    required: false,
    min: 0,
    default: 0
  },
  
  // Media
  images: [{
    type: String // Image URLs
  }],
  
  // FLEXIBLE SPECIFICATIONS - Key Feature!
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  
  // Key Features Array
  features: [{
    type: String,
    trim: true
  }],
  
  // Product Title (replaces old 'name' field)
  seoTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300  // Amazon-style detailed title
  },
  metaTitle: {
    type: String,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  keywords: [{
    type: String,
    lowercase: true
  }],

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Search & Filter Optimization Fields
  searchText: {
    type: String,
    index: 'text' // Full-text search index
  },
  priceRange: {
    type: String,
    enum: ['budget', 'mid-range', 'premium', 'high-end'],
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order'],
    default: 'in-stock',
  }
  
}, {
  timestamps: true
});

productSchema.index({ isActive: 1, categoryId: 1, createdAt: -1 });
productSchema.index({ isActive: 1, categoryId: 1, subCategoryId: 1, createdAt: -1 });


module.exports = mongoose.model('Product', productSchema);
