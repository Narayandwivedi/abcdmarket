const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    redirectUrl: {
      type: String,
      trim: true,
      default: ''
    },
    priority: {
      type: Number,
      default: 1,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

subCategorySchema.index({ category: 1, name: 1 }, { unique: true });
subCategorySchema.index({ category: 1, slug: 1 }, { unique: true, sparse: true });
subCategorySchema.index({ category: 1, isActive: 1, priority: 1, createdAt: 1 });

module.exports = mongoose.model('SubCategory', subCategorySchema);
