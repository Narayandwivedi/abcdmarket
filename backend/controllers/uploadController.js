const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { uploadsDir } = require('../config/multer');

// Process and save image
const processImage = async (file, size = { width: 800, height: 800 }) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = `${file.fieldname}-${uniqueSuffix}.webp`;
  const filepath = path.join(uploadsDir, filename);

  await sharp(file.buffer)
    .resize(size.width, size.height, {
      fit: 'inside', // Maintain aspect ratio
      withoutEnlargement: true // Don't upscale small images
    })
    .webp({ quality: 85 }) // Convert to WebP with good quality
    .toFile(filepath);

  return {
    filename,
    filepath,
    originalName: file.originalname,
    size: fs.statSync(filepath).size,
    mimetype: 'image/webp',
    url: `/uploads/${filename}`
  };
};

// Upload single product image
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Process image
    const fileInfo = await processImage(req.file);

    res.status(200).json({
      success: true,
      message: 'Image uploaded and processed successfully',
      data: fileInfo
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
};

// Upload multiple product images
const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Process multiple files
    const filesInfo = await Promise.all(
      req.files.map(file => processImage(file))
    );

    res.status(200).json({
      success: true,
      message: `${req.files.length} images uploaded and processed successfully`,
      data: filesInfo
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
};

// Delete uploaded image
const deleteProductImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message
    });
  }
};

// Get uploaded image
const getProductImage = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    const filePath = path.join(__dirname, '../uploads', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Send file
    res.sendFile(filePath);

  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving image',
      error: error.message
    });
  }
};

// Upload chat file
const uploadChatFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = `chat-${uniqueSuffix}${fileExtension}`;
    const filepath = path.join(uploadsDir, filename);

    // Check if it's an image and process it, otherwise just save the file
    if (file.mimetype.startsWith('image/')) {
      // Process image
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(path.join(uploadsDir, `chat-${uniqueSuffix}.webp`));

      const processedFilename = `chat-${uniqueSuffix}.webp`;

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        file_url: `/uploads/${processedFilename}`,
        file_type: 'image',
        originalName: file.originalname
      });
    } else {
      // Save non-image files directly
      fs.writeFileSync(filepath, file.buffer);

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        file_url: `/uploads/${filename}`,
        file_type: 'file',
        originalName: file.originalname
      });
    }

  } catch (error) {
    console.error('Chat file upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
};

module.exports = {
  uploadProductImage,
  uploadProductImages,
  deleteProductImage,
  getProductImage,
  uploadChatFile
};