import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCart } from '../../context/CartContext'

const formatPrice = (price) => `Rs ${price}`

const getProductDisplayName = (product) => {
  if (!product?.unit) return product?.name || 'Product'
  return `${product.name} (${product.unit})`
}

const buildCartProduct = (product, categoryName) => ({
  id: product.id,
  _id: product.id,
  name: getProductDisplayName(product),
  price: product.price,
  category: categoryName,
  imageUrl: product.image,
  images: [product.image],
  isDemo: true,
})

const CategoryProductGrid = ({ categoryName, subtitle, bannerText, products = [] }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const handleAddToCart = async (product) => {
    await addToCart(buildCartProduct(product, categoryName))
    toast.success(`${getProductDisplayName(product)} added to cart`)
  }

  const handleOrderNow = async (product) => {
    await addToCart(buildCartProduct(product, categoryName))
    navigate('/cart')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 sm:p-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-slate-900">
                {categoryName}
              </h1>
              <p className="text-xs sm:text-base text-slate-600 mt-1 sm:mt-2">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back to Home
            </button>
          </div>

          {bannerText ? (
            <div className="mt-4 inline-flex items-center rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 px-4 py-1.5 text-sm font-semibold text-white">
              {bannerText}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-amber-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="h-28 sm:h-32 md:h-36 bg-amber-50 flex items-center justify-center p-2 sm:p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.src = '/fruits.avif'
                  }}
                />
              </div>

              <div className="p-2.5 sm:p-3">
                <h2 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight">{product.name}</h2>
                <p className="text-xs text-slate-600 mt-0.5">{product.unit}</p>
                <p className="text-sm sm:text-base font-bold text-orange-600 mt-1.5">{formatPrice(product.price)}</p>

                <div className="mt-2.5 flex gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 rounded-lg bg-cyan-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700 transition-colors sm:px-3 sm:py-2 sm:text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOrderNow(product)}
                    className="flex-1 rounded-lg bg-orange-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors sm:px-3 sm:py-2 sm:text-sm"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryProductGrid
