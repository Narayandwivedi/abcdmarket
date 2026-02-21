const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const toSafeQuantity = (value, fallback = 1) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
};

const normalizeProductId = (value) => String(value || '').trim();
const isDemoProductId = (value) => normalizeProductId(value).startsWith('demo-');

const buildDemoCartPayload = (payload = {}) => {
  const normalizedId = normalizeProductId(payload.productId || payload._id || payload.id);
  const normalizedPrice = Number(payload.productPrice ?? payload.price);

  return {
    isDemo: true,
    productId: normalizedId,
    productName: String(payload.productName || payload.name || 'Demo Product').trim() || 'Demo Product',
    productBrand: String(payload.productBrand || payload.brand || payload.category || 'Demo').trim() || 'Demo',
    productPrice: Number.isFinite(normalizedPrice) && normalizedPrice > 0 ? normalizedPrice : 0,
    imageUrl:
      String(
        payload.imageUrl ||
        payload.image ||
        (Array.isArray(payload.images) ? payload.images[0] : '') ||
        ''
      ).trim(),
  };
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.product');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, isDemo = false } = req.body;
    const normalizedProductId = normalizeProductId(productId);

    if (!normalizedProductId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const demoProductRequested = Boolean(isDemo) || isDemoProductId(normalizedProductId);

    if (demoProductRequested) {
      const demoPayload = buildDemoCartPayload({ ...req.body, productId: normalizedProductId });

      if (!demoPayload.productName || demoPayload.productPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Demo product must include valid productName and productPrice'
        });
      }

      await user.addToCart(demoPayload, toSafeQuantity(quantity));
    } else {
      if (!mongoose.Types.ObjectId.isValid(normalizedProductId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

      const product = await Product.findById(normalizedProductId).select('_id');
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      await user.addToCart(normalizedProductId, toSafeQuantity(quantity));
    }

    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding to cart'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const normalizedProductId = normalizeProductId(productId);

    if (!normalizedProductId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.removeFromCart(normalizedProductId);
    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing from cart'
    });
  }
};

// Update item quantity in cart
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const normalizedProductId = normalizeProductId(productId);

    if (!normalizedProductId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    if (quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity cannot be negative'
      });
    }

    const isDemo = isDemoProductId(normalizedProductId);
    if (!isDemo && !mongoose.Types.ObjectId.isValid(normalizedProductId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (quantity === 0) {
      await user.removeFromCart(normalizedProductId);
    } else {
      const existingItem = user.cart.find((item) => {
        if (isDemo) {
          return item.isDemo && String(item.demoProductId || '') === normalizedProductId;
        }
        return !item.isDemo && item.product && item.product.toString() === normalizedProductId;
      });

      if (existingItem) {
        existingItem.quantity = toSafeQuantity(quantity);
        await user.save();
      } else {
        if (isDemo) {
          const demoPayload = buildDemoCartPayload({
            productId: normalizedProductId,
            productName: req.body.productName,
            productBrand: req.body.productBrand,
            productPrice: req.body.productPrice,
            imageUrl: req.body.imageUrl,
          });
          await user.addToCart(demoPayload, toSafeQuantity(quantity));
        } else {
          const product = await Product.findById(normalizedProductId).select('_id');
          if (!product) {
            return res.status(404).json({
              success: false,
              message: 'Product not found'
            });
          }
          await user.addToCart(normalizedProductId, toSafeQuantity(quantity));
        }
      }
    }

    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      cart: user.cart
    });
  } catch (error) {
    console.error('Update cart quantity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.clearCart();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: []
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
};

// Sync localStorage cart with database cart (for when user logs in)
const syncCart = async (req, res) => {
  try {
    const { localCart } = req.body;

    if (!Array.isArray(localCart)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart data'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const incomingProductIds = localCart
      .map((item) => normalizeProductId(item?.productId || item?._id || item?.id))
      .filter((id) => id && !isDemoProductId(id) && mongoose.Types.ObjectId.isValid(id));

    const uniqueIncomingIds = [...new Set(incomingProductIds)];

    const existingProducts = uniqueIncomingIds.length
      ? await Product.find({ _id: { $in: uniqueIncomingIds } }).select('_id').lean()
      : [];
    const existingProductIds = new Set(existingProducts.map((product) => String(product._id)));

    let mergedItems = 0;

    // Merge only valid, existing products from localStorage cart.
    for (const item of localCart) {
      const productId = normalizeProductId(item?.productId || item?._id || item?.id);
      if (!productId) continue;

      const quantity = toSafeQuantity(item?.quantity, 1);
      const isDemo = Boolean(item?.isDemo) || isDemoProductId(productId);

      if (isDemo) {
        const demoPayload = buildDemoCartPayload({ ...item, productId });
        if (!demoPayload.productName || demoPayload.productPrice <= 0) continue;
        await user.addToCart(demoPayload, quantity);
        mergedItems += 1;
        continue;
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) continue;
      if (!existingProductIds.has(productId)) continue;

      await user.addToCart(productId, quantity);
      mergedItems += 1;
    }

    await user.populate('cart.product');

    res.status(200).json({
      success: true,
      message: 'Cart synced successfully',
      mergedItems,
      cart: user.cart
    });
  } catch (error) {
    console.error('Sync cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while syncing cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  syncCart
};
