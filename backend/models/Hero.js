const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    linkUrl: {
      type: String,
      trim: true,
      default: ''
    },
    title: {
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

heroSchema.index({ isActive: 1, priority: 1, createdAt: 1 });

module.exports = mongoose.model('Hero', heroSchema);
