import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCategoriesArray, getSubcategoriesForCategory } from '../constants/categories';
import { getSpecificationTemplate, COMMON_FEATURES } from '../constants/specificationTemplates';
import { generateSEOTitle, generateTitlePreview } from '../constants/titleGenerator';
import ImageUpload from '../components/ImageUpload';

const AddProduct = () => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    seoTitle: '', // Main product title (auto-generated)
    slug: '',
    description: '',
    category: '',
    subCategory: '',
    brand: '',
    model: '',
    sku: '',
    price: '',
    originalPrice: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    stockQuantity: '',
    images: [],
    specifications: {},
    features: [],
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    warranty: 1,
    serviceOptions: {
      freeDelivery: true,
      replacementDays: 7,
      cashOnDelivery: true,
      warrantyService: true,
      freeInstallation: false
    },
    isActive: true,
    isFeatured: false
  });

  const [specificationFields, setSpecificationFields] = useState({});
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [customFeature, setCustomFeature] = useState('');
  const [manualSpecs, setManualSpecs] = useState({});
  const [manualSpecKey, setManualSpecKey] = useState('');
  const [manualSpecValue, setManualSpecValue] = useState('');

  const categories = getCategoriesArray();

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleServiceOptionChange = (optionName, value) => {
    setFormData(prev => ({
      ...prev,
      serviceOptions: {
        ...prev.serviceOptions,
        [optionName]: value
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        };
        
        // Auto-generate slug when seoTitle changes
        if (name === 'seoTitle' && value) {
          newData.slug = generateSlug(value);
        }
        
        // Auto-generate SEO title when relevant fields change
        if (['brand', 'model', 'subCategory'].includes(name) || name.includes('specifications')) {
          const titleData = {
            ...newData,
            specifications: newData.specifications || {},
            features: newData.features || []
          };
          newData.seoTitle = generateSEOTitle(titleData);
        }
        
        // Load specification template when subcategory changes
        if (name === 'subCategory' && value) {
          const template = getSpecificationTemplate(value);
          const newSpecs = {};
          template.forEach(spec => {
            if (spec.required) {
              newSpecs[spec.key] = '';
            }
          });
          setSpecificationFields(newSpecs);
          newData.specifications = newSpecs;
          
          // Load common features for this subcategory
          const commonFeatures = COMMON_FEATURES[value] || [];
          setSelectedFeatures([]);
        }
        
        return newData;
      });
    }
  };

  const handleSpecificationChange = (key, value) => {
    setSpecificationFields(prev => ({
      ...prev,
      [key]: value
    }));
    
    setFormData(prev => {
      const newData = {
        ...prev,
        specifications: {
          ...prev.specifications,
          [key]: value
        }
      };
      
      // Auto-update SEO title when specifications change
      newData.seoTitle = generateSEOTitle(newData);
      
      return newData;
    });
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature];
      
      setFormData(prevData => {
        const newData = {
          ...prevData,
          features: newFeatures
        };
        
        // Auto-update SEO title when features change
        newData.seoTitle = generateSEOTitle(newData);
        
        return newData;
      });
      
      return newFeatures;
    });
  };

  const handleImageChange = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleAddCustomFeature = () => {
    if (customFeature.trim()) {
      const newFeature = customFeature.trim();
      
      // Check if feature already exists
      if (!selectedFeatures.includes(newFeature)) {
        setSelectedFeatures(prev => {
          const newFeatures = [...prev, newFeature];
          
          setFormData(prevData => ({
            ...prevData,
            features: newFeatures
          }));
          
          return newFeatures;
        });
      }
      
      // Clear the input
      setCustomFeature('');
    }
  };

  const handleAddManualSpec = () => {
    if (manualSpecKey.trim() && manualSpecValue.trim()) {
      const key = manualSpecKey.trim();
      const value = manualSpecValue.trim();
      
      setManualSpecs(prev => ({
        ...prev,
        [key]: value
      }));
      
      // Also add to formData specifications
      setFormData(prev => {
        const newData = {
          ...prev,
          specifications: {
            ...prev.specifications,
            [key]: value
          }
        };
        
        // Auto-update SEO title when manual specs change
        newData.seoTitle = generateSEOTitle(newData);
        
        return newData;
      });
      
      // Clear inputs
      setManualSpecKey('');
      setManualSpecValue('');
    }
  };

  const handleRemoveManualSpec = (key) => {
    setManualSpecs(prev => {
      const newSpecs = { ...prev };
      delete newSpecs[key];
      return newSpecs;
    });
    
    // Also remove from formData specifications
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      
      const newData = {
        ...prev,
        specifications: newSpecs
      };
      
      // Auto-update SEO title when manual specs change
      newData.seoTitle = generateSEOTitle(newData);
      
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/products/add`, formData);
      alert('Product added successfully!');
      navigate('/');
    } catch (error) {
      alert('Error adding product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Title * (Auto-Generated - You can edit)
          </label>
          <textarea
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
            required
            rows={3}
            placeholder="Auto-generated professional title will appear here as you fill in brand, model, and specifications..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-xs text-gray-500 mt-1">
            Professional Amazon-style title generated automatically. You can edit it manually.
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sub Category
            </label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Sub Category</option>
              {getSubcategoriesForCategory(formData.category).map(subcat => (
                <option key={subcat.value} value={subcat.value}>{subcat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., RTX 4080 Gaming OC"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g., GPU-RTX4080-001"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="auto-generated-from-name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (grams)
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dimensions (cm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              name="dimensions.length"
              value={formData.dimensions.length}
              onChange={handleChange}
              placeholder="Length"
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="dimensions.width"
              value={formData.dimensions.width}
              onChange={handleChange}
              placeholder="Width"
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="dimensions.height"
              value={formData.dimensions.height}
              onChange={handleChange}
              placeholder="Height"
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dynamic Specifications */}
        {formData.subCategory && getSpecificationTemplate(formData.subCategory).length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getSpecificationTemplate(formData.subCategory).map((spec) => (
                <div key={spec.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {spec.label} {spec.required && '*'}
                  </label>
                  <input
                    type="text"
                    value={specificationFields[spec.key] || ''}
                    onChange={(e) => handleSpecificationChange(spec.key, e.target.value)}
                    placeholder={spec.placeholder}
                    required={spec.required}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Specifications */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Specifications</h3>
          <p className="text-sm text-gray-600 mb-4">Add any custom specifications not covered above</p>
          
          {/* Manual Spec Input */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={manualSpecKey}
                onChange={(e) => setManualSpecKey(e.target.value)}
                placeholder="Specification Name (e.g., Operating System)"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={manualSpecValue}
                onChange={(e) => setManualSpecValue(e.target.value)}
                placeholder="Specification Value (e.g., Windows 11 Home)"
                className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddManualSpec}
                disabled={!manualSpecKey.trim() || !manualSpecValue.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Spec
              </button>
            </div>
          </div>

          {/* Display Added Manual Specs */}
          {Object.keys(manualSpecs).length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Added Manual Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(manualSpecs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-white p-3 border border-gray-200 rounded-md">
                    <div className="flex-1">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="ml-2 text-gray-600">{value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveManualSpec(key)}
                      className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Features Selection */}
        {formData.subCategory && COMMON_FEATURES[formData.subCategory] && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COMMON_FEATURES[formData.subCategory].map((feature) => (
                <label key={feature} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
            
            {/* Custom Feature Input */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Add Custom Feature</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  placeholder="Enter custom feature (e.g., Water Cooling Compatible)"
                  className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomFeature();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomFeature}
                  disabled={!customFeature.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Add custom features that are not in the preset list above
              </div>
            </div>

            {/* Display Selected Features */}
            {selectedFeatures.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Selected Features ({selectedFeatures.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleFeatureToggle(feature)}
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SEO Fields */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title (60 characters max)
              </label>
              <textarea
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                maxLength={60}
                rows={3}
                placeholder="SEO optimized title for search results"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.metaTitle.length}/60 characters
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description (160 characters max)
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                maxLength={160}
                rows={3}
                placeholder="Brief description for search results"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.metaDescription.length}/160 characters
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Warranty Information</h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Period (Years)
              </label>
              <input
                type="number"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.5"
                placeholder="1"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Enter warranty period in years (e.g., 1, 2, 3 or 0.5 for 6 months)
              </div>
            </div>
          </div>
        </div>

        {/* Service Options */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Options</h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Free Delivery */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.serviceOptions.freeDelivery}
                  onChange={(e) => handleServiceOptionChange('freeDelivery', e.target.checked)}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">🚚</span>
                  <span className="text-sm font-medium text-gray-900">Free Delivery</span>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.serviceOptions.cashOnDelivery}
                  onChange={(e) => handleServiceOptionChange('cashOnDelivery', e.target.checked)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">💵</span>
                  <span className="text-sm font-medium text-gray-900">Cash on Delivery</span>
                </div>
              </label>

              {/* Warranty Service */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.serviceOptions.warrantyService}
                  onChange={(e) => handleServiceOptionChange('warrantyService', e.target.checked)}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-purple-600">🛡️</span>
                  <span className="text-sm font-medium text-gray-900">Warranty Service</span>
                </div>
              </label>

              {/* Free Installation */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.serviceOptions.freeInstallation}
                  onChange={(e) => handleServiceOptionChange('freeInstallation', e.target.checked)}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600">🔧</span>
                  <span className="text-sm font-medium text-gray-900">Free Installation</span>
                </div>
              </label>

              {/* Replacement Days */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-600">🔄</span> Replacement Period
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.serviceOptions.replacementDays}
                    onChange={(e) => handleServiceOptionChange('replacementDays', parseInt(e.target.value) || 0)}
                    min="0"
                    max="90"
                    className="w-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">days replacement policy</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Common: 7, 10, 15, or 30 days
                </div>
              </div>
            </div>
          </div>
        </div>

        <ImageUpload
          onImagesChange={handleImageChange}
          initialImages={formData.images}
        />

        <div className="mb-6 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Product is active</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Featured product (show on homepage)</span>
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;