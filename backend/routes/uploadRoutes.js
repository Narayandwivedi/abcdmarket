const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const {
  uploadProductImage,
  uploadProductImages,
  deleteProductImage,
  getProductImage,
  uploadChatFile
} = require('../controllers/uploadController');

// Upload single product image
router.post('/image', upload.single('image'), uploadProductImage);

// Upload multiple product images (max 5)
router.post('/images', upload.array('images', 5), uploadProductImages);

// Delete product image
router.delete('/image/:filename', deleteProductImage);

// Get product image
router.get('/image/:filename', getProductImage);

// Upload chat file
router.post('/chat', upload.single('chatFile'), uploadChatFile);

module.exports = router;