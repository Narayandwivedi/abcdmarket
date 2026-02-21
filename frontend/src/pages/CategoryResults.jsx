import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const decodeCategorySlug = (slug = '') =>
  decodeURIComponent(String(slug)).replace(/-/g, ' ').trim()

const CategoryResults = () => {
  const { categorySlug = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [facets, setFacets] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const categoryNameParam = (searchParams.get('name') || '').trim()
  const categoryQueryParam = (searchParams.get('query') || '').trim()
  const categoryFromSlug = decodeCategorySlug(categorySlug)

  const categoryName = categoryNameParam || categoryFromSlug
  const categoryQuery = categoryQueryParam || categoryName
  const brand = searchParams.get('brand') || 'all'
  const sort = searchParams.get('sort') || 'relevance'
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1

  const performCategorySearch = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('q', categoryQuery)
      if (brand && brand !== 'all') params.append('brand', brand)
      if (sort) params.append('sort', sort)
      params.append('page', page.toString())
      params.append('limit', '16')

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/search?${params}`,
      )

      if (!response.ok) {
        throw new Error('Failed to load category products')
      }

      const data = await response.json()

      if (data.success) {
        setProducts(Array.isArray(data.data) ? data.data : [])
        setFacets(data.facets || {})
        setTotalResults(Number(data.total) || 0)
        setTotalPages(Number(data.totalPages) || 0)
        setCurrentPage(Number(data.page) || 1)
      } else {
        throw new Error(data.message || 'Failed to load category products')
      }
    } catch (fetchError) {
      console.error('Category products error:', fetchError)
      setError(fetchError.message || 'Failed to load category products')
      setProducts([])
      setFacets({})
      setTotalResults(0)
      setTotalPages(0)
      setCurrentPage(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!categoryQuery) {
      setLoading(false)
      setProducts([])
      setError(null)
      return
    }
    performCategorySearch()
  }, [categoryQuery, brand, sort, page])

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    if (Object.prototype.hasOwnProperty.call(newParams, 'brand') || Object.prototype.hasOwnProperty.call(newParams, 'sort')) {
      params.set('page', '1')
    }

    if (categoryName) params.set('name', categoryName)
    if (categoryQuery) params.set('query', categoryQuery)

    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage.toString() })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleProductClick = (product) => {
    navigate(`/product/${product.slug || product._id}`)
  }

  if (!categoryQuery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Category Not Found</h2>
            <p className="text-gray-600 mb-6">Please choose a category from the homepage</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors font-medium"
            >
              Go Back to Homepage
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Category: <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{categoryName}</span>
              </h1>
              {!loading && (
                <p className="text-gray-600 mt-1">
                  {totalResults} products found
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-cyan-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!loading && products.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {facets.brands && facets.brands.length > 1 && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => updateSearchParams({ brand: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="all">All Brands</option>
                      {facets.brands.map((brandName) => (
                        <option key={brandName} value={brandName}>{brandName}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => updateSearchParams({ sort: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  >
                    <option value="relevance">Most Relevant</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading category products...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Category Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={performCategorySearch}
              className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <svg className="w-20 h-20 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-1 1v1H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2h-3V3a1 1 0 00-1-1H9zm1 3V3h2v2h-2zM5 6h10v8H5V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              We could not find products in "{categoryName}"
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors font-medium"
            >
              Browse More Categories
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group cursor-pointer transition-all duration-300 bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="h-40 sm:h-48 bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.seoTitle || product.name}
                        className="max-h-full max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Product'
                        }}
                      />
                    ) : (
                      <div className="text-gray-400 relative z-10">
                        <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-2">
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full font-medium">
                        {product.brand}
                      </span>
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-3 group-hover:text-cyan-700 transition-colors text-sm sm:text-lg line-clamp-2 leading-tight">
                      {product.seoTitle || product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col">
                        <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-1.5 sm:p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-shadow">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        {product.stockQuantity > 0 ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                            <span className="hidden sm:inline">In Stock</span>
                            <span className="sm:hidden">Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></div>
                            <span className="text-[10px] sm:text-xs">Out of Stock</span>
                          </span>
                        )}
                      </div>

                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-green-600 font-bold text-xs sm:text-sm">
                          <span className="hidden sm:inline">Save </span>
                          {formatPrice(product.originalPrice - product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pageNumber === currentPage
                          ? 'bg-cyan-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CategoryResults
