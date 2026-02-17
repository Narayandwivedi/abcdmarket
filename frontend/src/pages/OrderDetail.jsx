import React, { useState, useContext, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { ArrowLeft, Package, MapPin, Phone, Mail, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { BACKEND_URL, user } = useContext(AppContext)
  const [order, setOrder] = useState(null)
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateOnly = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />
      case 'confirmed': return <CheckCircle className="w-5 h-5" />
      case 'processing': return <Package className="w-5 h-5" />
      case 'shipped': return <Truck className="w-5 h-5" />
      case 'delivered': return <CheckCircle className="w-5 h-5" />
      case 'cancelled': return <XCircle className="w-5 h-5" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  const fetchOrderDetail = async () => {
    try {
      if (!user?.email || !orderId) {
        setLoading(false)
        return
      }

      const response = await fetch(`${BACKEND_URL}/api/orders/detail/${orderId}`, {
        credentials: 'include'
      })

      const result = await response.json()

      if (result.success) {
        // Verify this order belongs to the current user
        if (result.data.customerInfo.email === user.email) {
          setOrder(result.data)
        } else {
          toast.error('Access denied: This order does not belong to you')
          navigate('/my-orders')
        }
      } else {
        throw new Error(result.message || 'Failed to fetch order details')
      }
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to load order details')
      navigate('/my-orders')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => navigate('/my-orders')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-orders')}
            className="flex items-center text-cyan-600 hover:text-cyan-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Orders
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order._id}</h1>
              <p className="text-gray-600 mt-1">Placed on {formatDate(order.orderDate)}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Order Items ({order.totalItems} {order.totalItems === 1 ? 'item' : 'items'})
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200">
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
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{item.productName}</h3>
                        <p className="text-gray-600 mb-2">{item.productBrand}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Quantity:</span> {item.quantity}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 text-lg">{formatPrice(item.subtotal)}</p>
                            <p className="text-sm text-gray-600">{formatPrice(item.productPrice)} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Delivery Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Delivery Address
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900 font-medium">{order.customerInfo.name}</p>
                      <p className="text-gray-700 mt-1">{order.shippingAddress.fullAddress}</p>
                      {order.shippingAddress.city && (
                        <p className="text-gray-700">
                          {order.shippingAddress.city}
                          {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                          {order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
                        </p>
                      )}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-gray-600 text-sm flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {order.customerInfo.phone}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center mt-1">
                          <Mail className="w-4 h-4 mr-2" />
                          {order.customerInfo.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Delivery Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Order Placed</span>
                        <span className="font-medium text-gray-900">{formatDateOnly(order.orderDate)}</span>
                      </div>
                      {order.estimatedDelivery && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">
                            {order.status === 'delivered' ? 'Delivered' : 'Expected Delivery'}
                          </span>
                          <span className="font-medium text-gray-900">
                            {order.status === 'delivered' && order.deliveryDate
                              ? formatDateOnly(order.deliveryDate)
                              : formatDateOnly(order.estimatedDelivery)
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Notes</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{order.customerNotes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({order.totalItems} items)</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium text-gray-900 capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/chat')}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Contact Support
                  </button>
                  {order.status === 'pending' && (
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail