const express = require('express');
const router = express.Router();
const { seedProducts, clearProducts } = require('../controllers/seederController');

// Seed products (with optional clear)
router.post('/products', seedProducts);

// Clear all products
router.delete('/products', clearProducts);

module.exports = router;
