import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const Cart = () => {
  const { items, loading, error, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart()
  const { isAuthenticated, user } = useContext(AppContext)
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L8 13m0 0L5.6 5M8 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M8 13H6m6 8a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-lg text-gray-600 mb-8">Add some products to get started!</p>
            <Link 
              to="/" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 py-6 sm:px-6">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {items.map((item) => {
                      const itemId = item._id || item.id
                      return (
                        <li key={itemId} className="py-4 sm:py-6">
                          {/* Mobile Layout */}
                          <div className="flex flex-col sm:hidden space-y-4">
                            {/* Product Image and Basic Info */}
                            <div className="flex space-x-4">
                              <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 border border-gray-200 rounded-md overflow-hidden">
                                <img
                                  src={item.imageUrl || (item.images && item.images[0]) || '/placeholder-image.jpg'}
                                  alt={item.name || item.seoTitle || 'Product'}
                                  className="w-full h-full object-center object-cover"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg'
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base font-medium text-gray-900 truncate">
                                  <Link to={`/product/${itemId}`} className="hover:text-cyan-600">
                                    {item.name || item.seoTitle || 'Product'}
                                  </Link>
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                <p className="mt-1 text-sm font-medium text-gray-900">{formatPrice(item.price)}</p>
                              </div>
                            </div>
                            
                            {/* Quantity and Price Row */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600">Qty:</span>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                  <button
                                    onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                    className="px-2 py-1 hover:bg-gray-100 transition-colors text-sm cursor-pointer"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 border-l border-r border-gray-300 text-sm">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                    className="px-2 py-1 hover:bg-gray-100 transition-colors text-sm cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-base font-semibold text-gray-900">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                <button
                                  onClick={() => removeFromCart(itemId)}
                                  className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors cursor-pointer mt-1"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden sm:flex">
                            <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                              <img
                                src={item.imageUrl || (item.images && item.images[0]) || '/placeholder-image.jpg'}
                                alt={item.name || item.seoTitle || 'Product'}
                                className="w-full h-full object-center object-cover"
                                onError={(e) => {
                                  e.target.src = '/placeholder-image.jpg'
                                }}
                              />
                            </div>

                            <div className="ml-4 flex-1 flex flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    <Link to={`/product/${itemId}`} className="hover:text-cyan-600">
                                      {item.name || item.seoTitle || 'Product'}
                                    </Link>
                                  </h3>
                                  <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                <p className="mt-1 text-sm text-gray-600">Price: {formatPrice(item.price)}</p>
                              </div>
                              <div className="flex-1 flex items-end justify-between text-sm">
                                <div className="flex items-center space-x-3">
                                  <label htmlFor={`quantity-${itemId}`} className="text-gray-500">
                                    Qty:
                                  </label>
                                  <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                      onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                      className="px-3 py-1 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1 border-l border-r border-gray-300">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                      className="px-3 py-1 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="flex">
                                  <button
                                    onClick={() => removeFromCart(itemId)}
                                    className="font-medium text-red-600 hover:text-red-500 transition-colors cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/"
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-lg transition-colors text-center inline-block cursor-pointer"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="text-gray-900">{formatPrice(getTotalPrice())}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(getTotalPrice() * 0.18)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(getTotalPrice() * 1.18)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 cursor-pointer"
              >
                {!isAuthenticated ? 'Login to Checkout' : 'Proceed to Checkout'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Cart
