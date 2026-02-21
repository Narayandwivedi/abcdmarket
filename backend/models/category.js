const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
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
      required: true,
      trim: true
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

categorySchema.index({ isActive: 1, priority: 1, createdAt: 1 });
categorySchema.index({ slug: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Category', categorySchema);
