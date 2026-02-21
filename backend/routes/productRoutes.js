const express = require('express');
const router = express.Router();
const {
  addProduct,
  getMyProducts,
  updateMyProductPrice,
  deleteMyProduct,
  editProduct,
  getProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  getProductsByCategorySlug,
  getProductsByCategoryAndSubCategorySlug,
  searchProducts,
  deleteProduct
} = require('../controllers/productController');

router.post('/add', addProduct);
router.get('/seller/my', getMyProducts);
router.patch('/seller/:id/price', updateMyProductPrice);
router.delete('/seller/:id', deleteMyProduct);
router.put('/edit/:id', editProduct);
router.get('/search', searchProducts);
router.get('/category-slug/:categorySlug/subcategory/:subCategorySlug', getProductsByCategoryAndSubCategorySlug);
router.get('/category-slug/:categorySlug', getProductsByCategorySlug);
router.get('/category/:category/subcategory/:subCategory', getProductsBySubCategory);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.get('/', getAllProducts);
router.delete('/:id', deleteProduct);

module.exports = router;
