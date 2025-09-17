import React, { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useCart } from '../context/CartContext'
import AddressManager from '../components/AddressManager'
import { toast } from 'react-toastify'

const Checkout = () => {
  const { BACKEND_URL, isAuthenticated, user } = useContext(AppContext)
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const navigate = useNavigate()
  
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [customerNotes, setCustomerNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState('address') // 'address' or 'review'

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.info('Your cart is empty')
      navigate('/cart')
      return
    }
  }, [items.length, navigate])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        items: items.map(item => ({
          productId: item._id || item.id,
          quantity: item.quantity
        })),
        customerNotes,
        paymentMethod,
        userId: user._id,
        addressId: selectedAddressId
      }

      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Order placed successfully! Order ID: ${result.data.orderId}`)
        clearCart()
        navigate('/')
      } else {
        throw new Error(result.message || 'Failed to place order')
      }

    } catch (error) {
      console.error('Error placing order:', error)
      toast.error(error.message || 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirecting to cart...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              to="/cart"
              className="text-gray-600 hover:text-gray-800 flex items-center cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              Logged in as <strong>{user?.fullName}</strong> ({user?.email})
            </p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Step Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-center space-x-8">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                    currentStep === 'address' ? 'bg-cyan-600' : 'bg-green-500'
                  }`}>
                    {currentStep === 'review' ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      '1'
                    )}
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep === 'address' ? 'text-cyan-600' : 'text-gray-500'
                  }`}>
                    Select Address
                  </span>
                </div>
                
                <div className={`flex-1 h-1 ${
                  currentStep === 'review' ? 'bg-green-500' : 'bg-gray-200'
                }`} />
                
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                    currentStep === 'review' ? 'bg-cyan-600' : 'bg-gray-300'
                  }`}>
                    2
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep === 'review' ? 'text-cyan-600' : 'text-gray-500'
                  }`}>
                    Review & Payment
                  </span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 'address' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Delivery Address</h2>
                <AddressManager 
                  onAddressSelect={setSelectedAddressId}
                  selectedAddressId={selectedAddressId}
                  showSelection={true}
                />
                
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setCurrentStep('review')}
                    disabled={!selectedAddressId}
                    className="px-8 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items ({getTotalItems()})</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item._id || item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.imageUrl || (item.images && item.images[0]) || '/placeholder-image.jpg'}
                            alt={item.name || item.seoTitle}
                            className="w-full h-full object-center object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.name || item.seoTitle}
                          </h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-cyan-600 focus:ring-cyan-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep('address')}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium cursor-pointer"
                  >
                    Back to Address
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Placing Order...
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                  <span className="text-gray-900">{formatPrice(getTotalPrice())}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="text-gray-900">{formatPrice(getTotalPrice() * 0.18)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-medium">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(getTotalPrice() * 1.18)}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                🔒 Secure checkout with 256-bit SSL encryption
              </div>
              
              {currentStep === 'address' && selectedAddressId && (
                <div className="mt-4">
                  <button
                    onClick={() => setCurrentStep('review')}
                    className="w-full py-2 px-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-medium text-sm cursor-pointer"
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout