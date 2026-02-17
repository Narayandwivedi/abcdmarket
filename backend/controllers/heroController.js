const mongoose = require('mongoose');
const Hero = require('../models/Hero');

const toNumberOrDefault = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeHeroPayload = (payload = {}) => {
  const normalized = {};

  if (payload.imageUrl !== undefined) {
    normalized.imageUrl = String(payload.imageUrl).trim();
  }

  if (payload.linkUrl !== undefined) {
    normalized.linkUrl = String(payload.linkUrl).trim();
  }

  if (payload.title !== undefined) {
    normalized.title = String(payload.title).trim();
  }

  if (payload.priority !== undefined) {
    normalized.priority = toNumberOrDefault(payload.priority, 1);
  }

  if (payload.isActive !== undefined) {
    normalized.isActive = Boolean(payload.isActive);
  }

  return normalized;
};

const getPublicHeroes = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(20, toNumberOrDefault(req.query.limit, 4)));

    const heroes = await Hero.find({ isActive: true })
      .sort({ priority: 1, createdAt: 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ priority: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: heroes.length,
      data: heroes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createHero = async (req, res) => {
  try {
    const payload = normalizeHeroPayload(req.body);

    if (!payload.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'imageUrl is required'
      });
    }

    const hero = await Hero.create(payload);

    res.status(201).json({
      success: true,
      message: 'Hero created successfully',
      data: hero
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateHero = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hero id'
      });
    }

    const payload = normalizeHeroPayload(req.body);

    const hero = await Hero.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hero updated successfully',
      data: hero
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteHero = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hero id'
      });
    }

    const hero = await Hero.findByIdAndDelete(id);

    if (!hero) {
      return res.status(404).json({
        success: false,
        message: 'Hero not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hero deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const reorderHeroes = async (req, res) => {
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

    const heroes = await Hero.find({ _id: { $in: uniqueIds } }).select('_id');
    if (heroes.length !== uniqueIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more heroes were not found'
      });
    }

    const operations = uniqueIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { priority: index + 1 }
      }
    }));

    await Hero.bulkWrite(operations);

    const updatedHeroes = await Hero.find().sort({ priority: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      message: 'Hero priority order updated successfully',
      data: updatedHeroes
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPublicHeroes,
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero,
  reorderHeroes
};
