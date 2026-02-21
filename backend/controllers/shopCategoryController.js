const mongoose = require('mongoose');
const Category = require('../models/category');
const { toSlug, generateUniqueSlug } = require('../utils/slug');

const toNumberOrDefault = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeCategoryPayload = (payload = {}) => {
  const normalized = {};

  if (payload.name !== undefined) {
    normalized.name = String(payload.name).trim();
  }

  if (payload.slug !== undefined) {
    normalized.slug = toSlug(payload.slug);
  }

  if (payload.imageUrl !== undefined) {
    normalized.imageUrl = String(payload.imageUrl).trim();
  }

  if (payload.redirectUrl !== undefined) {
    normalized.redirectUrl = String(payload.redirectUrl).trim();
  }

  if (payload.priority !== undefined) {
    normalized.priority = toNumberOrDefault(payload.priority, 1);
  }

  if (payload.isActive !== undefined) {
    normalized.isActive = Boolean(payload.isActive);
  }

  return normalized;
};

const withResolvedSlug = (category) => {
  const plainCategory = category?.toObject ? category.toObject() : category;
  return {
    ...plainCategory,
    slug: plainCategory?.slug || toSlug(plainCategory?.name || '')
  };
};

const getPublicShopCategories = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, toNumberOrDefault(req.query.limit, 30)));

    const categories = await Category.find({ isActive: true })
      .sort({ priority: 1, createdAt: 1 })
      .limit(limit);

    const normalizedCategories = categories.map(withResolvedSlug);

    res.status(200).json({
      success: true,
      count: normalizedCategories.length,
      data: normalizedCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllShopCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ priority: 1, createdAt: 1 });

    const normalizedCategories = categories.map(withResolvedSlug);

    res.status(200).json({
      success: true,
      count: normalizedCategories.length,
      data: normalizedCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createShopCategory = async (req, res) => {
  try {
    const payload = normalizeCategoryPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({
        success: false,
        message: 'name is required'
      });
    }

    if (!payload.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'imageUrl is required'
      });
    }

    payload.slug = await generateUniqueSlug({
      Model: Category,
      source: payload.name,
      baseSlug: payload.slug
    });

    const category = await Category.create(payload);

    res.status(201).json({
      success: true,
      message: 'Shop category created successfully',
      data: withResolvedSlug(category)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateShopCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category id'
      });
    }

    const payload = normalizeCategoryPayload(req.body);
    const existingCategory = await Category.findById(id).select('_id name slug');

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Shop category not found'
      });
    }

    if (payload.name !== undefined || payload.slug !== undefined) {
      payload.slug = await generateUniqueSlug({
        Model: Category,
        source: payload.name || existingCategory.name,
        baseSlug: payload.slug || payload.name || existingCategory.slug || existingCategory.name,
        excludeId: existingCategory._id
      });
    }

    const category = await Category.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Shop category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop category updated successfully',
      data: withResolvedSlug(category)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteShopCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category id'
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Shop category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Shop category deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const reorderShopCategories = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds must be a non-empty array'
      });
    }

    const validIds = orderedIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => String(id));

    if (validIds.length !== orderedIds.length) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds contains invalid id values'
      });
    }

    const uniqueIds = [...new Set(validIds)];
    if (uniqueIds.length !== validIds.length) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds contains duplicate ids'
      });
    }

    const categories = await Category.find({ _id: { $in: uniqueIds } }).select('_id');
    if (categories.length !== uniqueIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more categories were not found'
      });
    }

    const operations = uniqueIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { priority: index + 1 }
      }
    }));

    await Category.bulkWrite(operations);

    const updatedCategories = await Category.find().sort({ priority: 1, createdAt: 1 });

    const normalizedCategories = updatedCategories.map(withResolvedSlug);

    res.status(200).json({
      success: true,
      message: 'Shop category priority order updated successfully',
      data: normalizedCategories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPublicShopCategories,
  getAllShopCategories,
  createShopCategory,
  updateShopCategory,
  deleteShopCategory,
  reorderShopCategories
};
