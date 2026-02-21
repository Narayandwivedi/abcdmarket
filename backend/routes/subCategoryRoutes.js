const express = require('express');
const router = express.Router();
const {
  getPublicSubCategories,
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  reorderSubCategories
} = require('../controllers/subCategoryController');

router.get('/', getPublicSubCategories);
router.get('/admin', getAllSubCategories);
router.post('/', createSubCategory);
router.patch('/reorder', reorderSubCategories);
router.put('/:id', updateSubCategory);
router.delete('/:id', deleteSubCategory);

module.exports = router;
