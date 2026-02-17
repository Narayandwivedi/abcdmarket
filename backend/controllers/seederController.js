const Product = require('../models/Product');
const mockProducts = require('../data/mockProducts');

// @desc    Seed database with mock products
// @route   POST /api/seed/products
// @access  Public (you may want to add auth later)
const seedProducts = async (req, res) => {
  try {
    const clearExisting = req.body?.clearExisting || false;

    // Delete all existing products if requested
    if (clearExisting) {
      const deleteResult = await Product.deleteMany({});
      console.log(`Deleted ${deleteResult.deletedCount} existing products`);
    }

    // Convert Map specifications to plain objects for MongoDB
    const productsToInsert = mockProducts.map(product => {
      const productData = { ...product };

      // Convert Map to Object for MongoDB storage
      if (product.specifications instanceof Map) {
        const specsObj = {};
        product.specifications.forEach((value, key) => {
          specsObj[key] = value;
        });
        productData.specifications = specsObj;
      }

      return productData;
    });

    // Insert mock products
    const insertedProducts = await Product.insertMany(productsToInsert);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${insertedProducts.length} products${clearExisting ? ' (after clearing existing products)' : ''}`,
      count: insertedProducts.length,
      products: insertedProducts
    });

  } catch (error) {
    console.error('Seeder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed products',
      error: error.message
    });
  }
};

// @desc    Delete all products from database
// @route   DELETE /api/seed/products
// @access  Public (you may want to add auth later)
const clearProducts = async (req, res) => {
  try {
    const deleteResult = await Product.deleteMany({});

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} products`,
      deletedCount: deleteResult.deletedCount
    });

  } catch (error) {
    console.error('Clear products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete products',
      error: error.message
    });
  }
};

module.exports = {
  seedProducts,
  clearProducts
};
