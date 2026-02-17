import React from 'react'

const demoDealProducts = [
  {
    _id: 'demo-onion-1',
    name: 'Fresh Onion (1 kg)',
    shortName: 'ONION',
    price: 42,
    originalPrice: 65,
    brand: 'Farm Fresh',
    category: 'Vegetables'
  },
  {
    _id: 'demo-garlic-1',
    name: 'Premium Garlic (500 g)',
    shortName: 'GARLIC',
    price: 68,
    originalPrice: 95,
    brand: 'Farm Fresh',
    category: 'Vegetables'
  },
  {
    _id: 'demo-banana-1',
    name: 'Banana Robusta (1 Dozen)',
    shortName: 'BANANA',
    price: 55,
    originalPrice: 80,
    brand: 'Daily Harvest',
    category: 'Fruits'
  },
  {
    _id: 'demo-potato-1',
    name: 'Farm Potato (1 kg)',
    shortName: 'POTATO',
    price: 30,
    originalPrice: 45,
    brand: 'Daily Harvest',
    category: 'Vegetables'
  },
]

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

const calculateDiscount = (original, current) => {
  if (!original || original <= current) return 0
  return Math.round(((original - current) / original) * 100)
}

const TopDealsSection = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full mb-4">
            <span className="text-white text-sm font-medium">Limited Time Offer</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-3">
            Top <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Deals</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Demo products with discount pricing.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {demoDealProducts.map((product) => {
            const discountPercent = calculateDiscount(product.originalPrice, product.price)

            return (
              <div
                key={product._id}
                className="group transition-all duration-300 bg-white rounded-2xl border-2 border-cyan-100 overflow-hidden hover:border-cyan-300 hover:shadow-xl hover:shadow-cyan-500/20"
              >
                {discountPercent > 0 && (
                  <div className="absolute mt-3 ml-3 z-10">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      -{discountPercent}%
                    </div>
                  </div>
                )}

                <div className="h-36 bg-gradient-to-br from-gray-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5"></div>
                  <div className="relative z-10 text-center">
                    <p className="text-[10px] tracking-wider text-gray-500 uppercase">Demo Product</p>
                    <p className="text-lg font-black text-gray-800 mt-1">{product.shortName}</p>
                  </div>
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

                  <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base leading-tight line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>

                    <span className="text-green-600 font-bold text-xs sm:text-sm">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TopDealsSection
