import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const MyOrders = () => {
  const navigate = useNavigate()
  const { BACKEND_URL, user } = useContext(AppContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      if (!user?.email) {
        setLoading(false)
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/orders/customer/${user.email}`, {
        credentials: 'include'
      })

      const result = await response.json()

      if (result.success) {
        setOrders(result.data || [])
      } else {
        throw new Error(result.message || 'Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-lg text-gray-600 mb-8">When you place orders, they will appear here.</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order._id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          {item.productId?.images && item.productId.images.length > 0 ? (
                            <img
                              src={item.productId.images[0]}
                              alt={item.productName}
                              className="w-full h-full object-center object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'
                              }}
                            />
                          ) : item.productId?.imageUrl ? (
                            <img
                              src={item.productId.imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-center object-cover"
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">{item.productBrand}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(item.subtotal)}</p>
                          <p className="text-sm text-gray-600">{formatPrice(item.productPrice)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.estimatedDelivery && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-4v9a1 1 0 01-1 1H9a1 1 0 01-1-1v-9H4a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
                        </svg>
                        <span>
                          {order.status === 'delivered'
                            ? `Delivered on ${formatDate(order.deliveryDate)}`
                            : `Expected delivery: ${formatDate(order.estimatedDelivery)}`
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleOrderClick(order._id)}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>View Order Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders