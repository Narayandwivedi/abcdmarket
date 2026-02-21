const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

const normalizeText = (value = '') => String(value).trim();

const extractSellerId = (payload) => {
  if (!payload) return '';
  if (typeof payload === 'string') return normalizeText(payload);
  if (typeof payload !== 'object') return '';
  return normalizeText(payload.sellerId || payload.id || payload._id || '');
};

const getSellerIdFromCookie = (req) => {
  try {
    const token = req.cookies?.sellerToken;
    if (!token) return '';

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return normalizeText(decoded?.sellerId || '');
  } catch (error) {
    return '';
  }
};

const addProduct = async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Debug log
    const {
      seoTitle,
      slug,
      description,
      category,
      subCategory,
      brand,
      model,
      sku,
      price,
      originalPrice,
      weight,
      dimensions,
      stockQuantity,
      images,
      specifications,
      features,
      metaTitle,
      metaDescription,
      keywords,
      warranty,
      isActive,
      isFeatured,
      sellerId,
      seller,
      sellerInfo,
      vendor
    } = req.body;

    // Validate required fields
    if (!seoTitle || seoTitle.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Product title (seoTitle) is required'
      });
    }

    console.log('Creating product with seoTitle:', seoTitle); // Debug log

    const requestSellerId =
      extractSellerId(sellerId) ||
      extractSellerId(seller) ||
      extractSellerId(sellerInfo) ||
      extractSellerId(vendor);
    const cookieSellerId = getSellerIdFromCookie(req);
    const resolvedSellerId = requestSellerId || cookieSellerId || undefined;

    const product = new Product({
      seoTitle,
      slug,
      description,
      category,
      subCategory,
      brand,
      model,
      sku,
      price,
      originalPrice,
      weight,
      dimensions,
      stockQuantity,
      images,
      specifications,
      features,
      metaTitle,
      metaDescription,
      keywords,
      warranty: warranty !== undefined ? warranty : 1,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false,
      ...(resolvedSellerId ? { sellerId: resolvedSellerId } : {})
    });

    const savedProduct = await product.save();
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: savedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    const normalizedSellerId =
      extractSellerId(updateData.sellerId) ||
      extractSellerId(updateData.seller) ||
      extractSellerId(updateData.sellerInfo) ||
      extractSellerId(updateData.vendor);

    if (normalizedSellerId) {
      updateData.sellerId = normalizedSellerId;
    }

    delete updateData.seller;
    delete updateData.sellerInfo;
    delete updateData.vendor;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    // First try to find by slug, then by ObjectId
    product = await Product.findOne({ slug: id });
    
    // If not found by slug and the id looks like a valid ObjectId, try findById
    if (!product) {
      // Check if the id is a valid ObjectId format (24 hex characters)
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { subCategory, brand, minPrice, maxPrice, limit = 20, page = 1 } = req.query;
    
    // Build query object
    const query = { category: category, isActive: true };
    
    // Add optional filters
    if (subCategory) query.subCategory = subCategory;
    if (brand) query.brand = new RegExp(brand, 'i'); // Case insensitive
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Fetch products with pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total: total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by category and subcategory (more specific)
const getProductsBySubCategory = async (req, res) => {
  try {
    const { category, subCategory } = req.params;
    const { brand, minPrice, maxPrice, limit = 20, page = 1 } = req.query;
    
    // Build query object
    const query = { 
      category: category, 
      subCategory: subCategory, 
      isActive: true 
    };
    
    // Add optional filters
    if (brand) query.brand = new RegExp(brand, 'i'); // Case insensitive
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Fetch products with pagination
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total: total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: products
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const searchProducts = async (req, res) => {
  try {
    const { 
      q,           // search query
      category,    // filter by category
      subCategory, // filter by subcategory
      brand,       // filter by brand
      minPrice,    // minimum price
      maxPrice,    // maximum price
      sort = 'relevance', // sort by relevance, price_asc, price_desc, newest
      limit = 20,  // results per page
      page = 1     // page number
    } = req.query;

    // Build base query
    let query = { isActive: true };

    // Add search text query if provided
    if (q && q.trim()) {
      const searchTerm = q.trim();
      
      // Create multiple search patterns for flexibility
      const searchPatterns = [];
      
      // Original search term
      searchPatterns.push(new RegExp(searchTerm, 'i'));
      
      // Remove 's' from end (graphics cards -> graphics card)
      if (searchTerm.endsWith('s')) {
        searchPatterns.push(new RegExp(searchTerm.slice(0, -1), 'i'));
      }
      
      // Add 's' to end (graphics card -> graphics cards)
      if (!searchTerm.endsWith('s')) {
        searchPatterns.push(new RegExp(searchTerm + 's', 'i'));
      }
      
      // Split search term into words for partial matching
      const words = searchTerm.split(' ').filter(word => word.length > 2);
      words.forEach(word => {
        searchPatterns.push(new RegExp(word, 'i'));
        // Also add singular/plural versions of each word
        if (word.endsWith('s')) {
          searchPatterns.push(new RegExp(word.slice(0, -1), 'i'));
        } else {
          searchPatterns.push(new RegExp(word + 's', 'i'));
        }
      });

      // Create $or conditions for each field with all search patterns
      const searchConditions = [];
      
      searchPatterns.forEach(pattern => {
        searchConditions.push(
          { seoTitle: pattern },
          { description: pattern },
          { brand: pattern },
          { model: pattern },
          { category: pattern },
          { subCategory: pattern },
          { keywords: { $in: [pattern] } },
          { 'specifications.key': pattern },
          { 'specifications.value': pattern }
        );
      });

      query.$or = searchConditions;
    }

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Add subcategory filter
    if (subCategory && subCategory !== 'all') {
      query.subCategory = subCategory;
    }

    // Add brand filter
    if (brand && brand !== 'all') {
      query.brand = new RegExp(brand, 'i');
    }

    // Add price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj.price = 1;
        break;
      case 'price_desc':
        sortObj.price = -1;
        break;
      case 'newest':
        sortObj.createdAt = -1;
        break;
      case 'name':
        sortObj.seoTitle = 1;
        break;
      case 'relevance':
      default:
        // For relevance, we'll sort by createdAt desc as default
        // In a more advanced implementation, you could use text search scores
        sortObj.createdAt = -1;
        break;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute search
    const products = await Product.find(query)
      .sort(sortObj)
      .limit(Number(limit))
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Get unique brands and categories for filters (if search results exist)
    const facets = {};
    if (total > 0) {
      const aggregationPipeline = [
        { $match: query },
        {
          $group: {
            _id: null,
            brands: { $addToSet: '$brand' },
            categories: { $addToSet: '$category' },
            subCategories: { $addToSet: '$subCategory' }
          }
        }
      ];

      const facetResults = await Product.aggregate(aggregationPipeline);
      if (facetResults.length > 0) {
        facets.brands = facetResults[0].brands.filter(Boolean).sort();
        facets.categories = facetResults[0].categories.filter(Boolean).sort();
        facets.subCategories = facetResults[0].subCategories.filter(Boolean).sort();
      }
    }

    res.status(200).json({
      success: true,
      query: q,
      count: products.length,
      total: total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      facets: facets,
      data: products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addProduct,
  editProduct,
  getProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  searchProducts,
  deleteProduct
};
