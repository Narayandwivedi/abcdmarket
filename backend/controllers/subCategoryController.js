const mongoose = require('mongoose');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const { toSlug, generateUniqueSlug } = require('../utils/slug');

const toNumberOrDefault = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeSubCategoryPayload = (payload = {}) => {
  const normalized = {};

  if (payload.category !== undefined) {
    normalized.category = String(payload.category).trim();
  }

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

const validateCategoryIdParam = (categoryId) => {
  if (!categoryId) {
    return { ok: true };
  }

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return { ok: false, message: 'Invalid category id' };
  }

  return { ok: true };
};

const ensureCategoryExists = async (categoryId) => {
  const category = await Category.findById(categoryId).select('_id');
  return Boolean(category);
};

const withResolvedSlug = (subCategory) => {
  const plainSubCategory = subCategory?.toObject ? subCategory.toObject() : subCategory;
  return {
    ...plainSubCategory,
    slug: plainSubCategory?.slug || toSlug(plainSubCategory?.name || '')
  };
};

const getPublicSubCategories = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(200, toNumberOrDefault(req.query.limit, 100)));
    const categoryValidation = validateCategoryIdParam(req.query.categoryId);

    if (!categoryValidation.ok) {
      return res.status(400).json({
        success: false,
        message: categoryValidation.message
      });
    }

    const query = { isActive: true };
    if (req.query.categoryId) {
      query.category = req.query.categoryId;
    }

    const subCategories = await SubCategory.find(query)
      .populate('category', '_id name')
      .sort({ priority: 1, createdAt: 1 })
      .limit(limit);

    const normalizedSubCategories = subCategories.map(withResolvedSlug);

    res.status(200).json({
      success: true,
      count: normalizedSubCategories.length,
      data: normalizedSubCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const categoryValidation = validateCategoryIdParam(req.query.categoryId);

    if (!categoryValidation.ok) {
      return res.status(400).json({
        success: false,
        message: categoryValidation.message
      });
    }

    const query = {};
    if (req.query.categoryId) {
      query.category = req.query.categoryId;
    }

    const subCategories = await SubCategory.find(query)
      .populate('category', '_id name priority')
      .sort({ priority: 1, createdAt: 1 });

    const normalizedSubCategories = subCategories.map(withResolvedSlug);

    res.status(200).json({
      success: true,
      count: normalizedSubCategories.length,
      data: normalizedSubCategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createSubCategory = async (req, res) => {
  try {
    const payload = normalizeSubCategoryPayload(req.body);

    if (!payload.category) {
      return res.status(400).json({
        success: false,
        message: 'category is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(payload.category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category id'
      });
    }

    const categoryExists = await ensureCategoryExists(payload.category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

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
      Model: SubCategory,
      source: payload.name,
      baseSlug: payload.slug,
      extraFilter: { category: payload.category }
    });

    const subCategory = await SubCategory.create(payload);
    const populated = await SubCategory.findById(subCategory._id).populate('category', '_id name');

    res.status(201).json({
      success: true,
      message: 'Sub category created successfully',
      data: withResolvedSlug(populated)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sub category id'
      });
    }

    const payload = normalizeSubCategoryPayload(req.body);
    const existingSubCategory = await SubCategory.findById(id).select('_id name slug category');

    if (!existingSubCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }

    const resolvedCategoryId = payload.category || String(existingSubCategory.category);

    if (payload.category !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(resolvedCategoryId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category id'
        });
      }

      const categoryExists = await ensureCategoryExists(resolvedCategoryId);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    if (payload.name !== undefined || payload.slug !== undefined || payload.category !== undefined) {
      payload.slug = await generateUniqueSlug({
        Model: SubCategory,
        source: payload.name || existingSubCategory.name,
        baseSlug:
          payload.slug ||
          payload.name ||
          existingSubCategory.slug ||
          existingSubCategory.name,
        excludeId: existingSubCategory._id,
        extraFilter: { category: resolvedCategoryId }
      });
    }

    const subCategory = await SubCategory.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    }).populate('category', '_id name');

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sub category updated successfully',
      data: withResolvedSlug(subCategory)
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sub category id'
      });
    }

    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: 'Sub category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sub category deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const reorderSubCategories = async (req, res) => {
  try {
    const { orderedIds, categoryId } = req.body;

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

    const categoryValidation = validateCategoryIdParam(categoryId);
    if (!categoryValidation.ok) {
      return res.status(400).json({
        success: false,
        message: categoryValidation.message
      });
    }

    if (categoryId) {
      const categoryExists = await ensureCategoryExists(categoryId);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const subCategories = await SubCategory.find({ _id: { $in: uniqueIds } }).select('_id category');
    if (subCategories.length !== uniqueIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more sub categories were not found'
      });
    }

    if (categoryId) {
      const allWithinCategory = subCategories.every(
        (item) => String(item.category) === String(categoryId)
      );

      if (!allWithinCategory) {
        return res.status(400).json({
          success: false,
          message: 'orderedIds must belong to the provided category'
        });
      }
    }

    const operations = uniqueIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { priority: index + 1 }
      }
    }));

    await SubCategory.bulkWrite(operations);

    const updatedQuery = {};
    if (categoryId) {
      updatedQuery.category = categoryId;
    }

    const updatedSubCategories = await SubCategory.find(updatedQuery)
      .populate('category', '_id name priority')
      .sort({ priority: 1, createdAt: 1 });

    const normalizedSubCategories = updatedSubCategories.map(withResolvedSlug);

    res.status(200).json({
      success: true,
      message: 'Sub category priority order updated successfully',
      data: normalizedSubCategories
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPublicSubCategories,
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  reorderSubCategories
};
