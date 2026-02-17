import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { getCategoriesArray, getSubcategoriesForCategory } from '../../constants/categories';
import { getSpecificationTemplate, COMMON_FEATURES } from '../../constants/specificationTemplates';
import { generateSEOTitle } from '../../constants/titleGenerator';
import ImageUpload from '../../components/ImageUpload';

const EditProductModal = ({ isOpen, onClose, productId, onProductUpdated }) => {
  const { BACKEND_URL } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    seoTitle: '',
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

  useEffect(() => {
    if (isOpen && productId) {
      fetchProduct();
    }
  }, [isOpen, productId]);

  const fetchProduct = async () => {
    setInitialLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products/${productId}`);
      const product = response.data.data;
      const productData = {
        seoTitle: product.seoTitle || product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        brand: product.brand || '',
        model: product.model || '',
        sku: product.sku || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        weight: product.weight || '',
        dimensions: {
          length: product.dimensions?.length || '',
          width: product.dimensions?.width || '',
          height: product.dimensions?.height || ''
        },
        stockQuantity: product.stockQuantity || '',
        images: product.images || [],
        specifications: product.specifications || {},
        features: product.features || [],
        metaTitle: product.metaTitle || '',
        metaDescription: product.metaDescription || '',
        keywords: product.keywords || [],
        warranty: product.warranty !== undefined ? product.warranty : 1,
        serviceOptions: {
          freeDelivery: product.serviceOptions?.freeDelivery !== undefined ? product.serviceOptions.freeDelivery : true,
          replacementDays: product.serviceOptions?.replacementDays !== undefined ? product.serviceOptions.replacementDays : 7,
          cashOnDelivery: product.serviceOptions?.cashOnDelivery !== undefined ? product.serviceOptions.cashOnDelivery : true,
          warrantyService: product.serviceOptions?.warrantyService !== undefined ? product.serviceOptions.warrantyService : true,
          freeInstallation: product.serviceOptions?.freeInstallation !== undefined ? product.serviceOptions.freeInstallation : false
        },
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured !== undefined ? product.isFeatured : false
      };

      setFormData(productData);
      setSpecificationFields(product.specifications || {});
      setSelectedFeatures(product.features || []);

      // Separate manual specs from template specs
      if (productData.subCategory) {
        const template = getSpecificationTemplate(productData.subCategory);
        const templateKeys = new Set(template.map(spec => spec.key));
        const manualSpecsOnly = {};
        
        Object.entries(product.specifications || {}).forEach(([key, value]) => {
          if (!templateKeys.has(key)) {
            manualSpecsOnly[key] = value;
          }
        });
        
        setManualSpecs(manualSpecsOnly);
      }

    } catch (error) {
      alert('Error fetching product: ' + (error.response?.data?.message || error.message));
    } finally {
      setInitialLoading(false);
    }
  };

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
        
        if (name === 'seoTitle' && value) {
          newData.slug = generateSlug(value);
        }
        
        if (['brand', 'model', 'subCategory'].includes(name)) {
          const titleData = {
            ...newData,
            specifications: newData.specifications || {},
            features: newData.features || []
          };
          newData.seoTitle = generateSEOTitle(titleData);
        }
        
        if (name === 'subCategory' && value) {
          const template = getSpecificationTemplate(value);
          const newSpecs = {};
          template.forEach(spec => {
            newSpecs[spec.key] = prev.specifications[spec.key] || '';
          });
          setSpecificationFields(newSpecs);
          newData.specifications = { ...newData.specifications, ...newSpecs };
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
      return newData;
    });
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature];
      
      setFormData(prevData => ({
        ...prevData,
        features: newFeatures
      }));
      
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
      
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [key]: value
        }
      }));
      
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
    
    setFormData(prev => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      
      return {
        ...prev,
        specifications: newSpecs
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${BACKEND_URL}/api/products/${productId}`, formData);
      alert('Product updated successfully!');
      onProductUpdated(response.data);
      onClose();
    } catch (error) {
      alert('Error updating product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>
        
        {initialLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <textarea
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (grams)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dynamic Specifications */}
            {formData.subCategory && getSpecificationTemplate(formData.subCategory).length > 0 && (
              <div>
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
            {Object.keys(manualSpecs).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {Object.entries(manualSpecs).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-gray-50 p-3 border border-gray-200 rounded-md">
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
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualSpecKey}
                    onChange={(e) => setManualSpecKey(e.target.value)}
                    placeholder="Specification Name"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={manualSpecValue}
                    onChange={(e) => setManualSpecValue(e.target.value)}
                    placeholder="Specification Value"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualSpec}
                    disabled={!manualSpecKey.trim() || !manualSpecValue.trim()}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Features Selection */}
            {formData.subCategory && COMMON_FEATURES[formData.subCategory] && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
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
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customFeature}
                    onChange={(e) => setCustomFeature(e.target.value)}
                    placeholder="Add custom feature"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            <ImageUpload
              onImagesChange={handleImageChange}
              initialImages={formData.images}
            />

            <div className="flex items-center space-x-6">
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
                <span className="text-sm font-medium text-gray-700">Featured product</span>
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProductModal;
