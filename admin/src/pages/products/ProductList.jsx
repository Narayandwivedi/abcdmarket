import { useState, useEffect } from 'react';
import axios from 'axios';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

const ProductList = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`);
      setProducts(response.data.data);
      setFilteredProducts(response.data.data);
    } catch (error) {
      alert('Error fetching products: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${BACKEND_URL}/api/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
        alert('Product deleted successfully!');
      } catch (error) {
        alert('Error deleting product: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleProductAdded = (newProduct) => {
    fetchProducts(); // Refresh the product list
  };

  const handleProductUpdated = (updatedProduct) => {
    fetchProducts(); // Refresh the product list
  };

  const handleEditProduct = (productId) => {
    setEditProductId(productId);
    setShowEditModal(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => 
      product.seoTitle?.toLowerCase().includes(query.toLowerCase()) ||
      product.name?.toLowerCase().includes(query.toLowerCase()) ||
      product.brand?.toLowerCase().includes(query.toLowerCase()) ||
      product.category?.toLowerCase().includes(query.toLowerCase()) ||
      product.subCategory?.toLowerCase().includes(query.toLowerCase()) ||
      product.sku?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products by name, brand, category, SKU..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => handleSearch(searchQuery)}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-lg text-gray-500">No products found</div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Your First Product
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-lg text-gray-500">No products match your search</div>
          <div className="text-sm text-gray-400 mt-2">Try adjusting your search terms</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Product Image */}
              <div className="h-32 sm:h-40 md:h-48 bg-gray-100 flex items-center justify-center p-2">
                {product.images && product.images[0] ? (
                  <img
                    className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-cover rounded-lg shadow-sm"
                    src={product.images[0]}
                    alt={product.seoTitle || product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/176x176?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                    {product.seoTitle || product.name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 flex-shrink-0 ${
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{product.brand}</span>
                  {product.sku && <span className="ml-2 text-gray-400">SKU: {product.sku}</span>}
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  <span>{product.category}</span>
                  {product.subCategory && <span> • {product.subCategory}</span>}
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Stock: <span className="font-medium">{product.stockQuantity || 0}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditProduct(product._id)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddProductModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductAdded={handleProductAdded}
      />

      <EditProductModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        productId={editProductId}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
};

export default ProductList;