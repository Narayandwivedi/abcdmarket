import { useState, useRef } from 'react';

const ImageUpload = ({ onImagesChange, initialImages = [] }) => {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000'; // Update with your backend URL

  // Upload single image
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        return `${API_BASE_URL}${result.data.url}`;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  };

  // Handle file selection
  const handleFileSelect = async (files) => {
    if (!files.length) return;

    setUploading(true);
    const newImages = [];

    try {
      // Upload each file
      for (const file of files) {
        if (file.type.startsWith('image/')) {
          const imageUrl = await uploadImage(file);
          newImages.push(imageUrl);
        } else {
          alert(`${file.name} is not an image file`);
        }
      }

      // Update images array
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);

    } catch (error) {
      alert(`Error uploading images: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFileSelect(files);
  };

  // Remove image
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Images
      </label>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors cursor-pointer max-w-md mx-auto ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Uploading...</span>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="mt-4">
              <p className="text-base text-gray-600">
                Click to upload or drag and drop images here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Uploaded Images ({images.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="w-full h-auto object-contain rounded-lg border border-gray-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                  title="Remove image"
                >
                  ×
                </button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image URLs Display (for debugging) */}
      {images.length > 0 && (
        <div className="mt-2">
          <details className="text-sm">
            <summary className="text-gray-600 cursor-pointer">Show image URLs</summary>
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono">
              {images.map((url, index) => (
                <div key={index} className="truncate">
                  {index + 1}: {url}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
