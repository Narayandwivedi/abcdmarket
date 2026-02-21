const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, addressId, customerNotes, paymentMethod = 'cod', userId } = req.body;
    const normalizedPaymentMethod = paymentMethod === 'cod' ? 'cod' : 'cod';

    // For logged-in users, get customer info from user data
    let customerInfo = {};
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      customerInfo = {
        name: user.fullName,
        email: user.email,
        phone: user.phone || '0000000000' // Provide default phone if user doesn't have one
      };
    } else {
      return res.status(401).json({
        success: false,
        message: 'User must be logged in to create an order'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Handle address - get from user's saved addresses
    let finalShippingAddress = shippingAddress;
    
    if (addressId) {
      // User is using a saved address (user is already fetched above)
      const selectedAddress = user.addresses.find(addr => addr._id.toString() === addressId);
      if (!selectedAddress) {
        return res.status(404).json({
          success: false,
          message: 'Selected address not found'
        });
      }
      
      // Convert user address to order format
      finalShippingAddress = {
        fullAddress: `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}`,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.postalCode
      };
      
      // Update phone from address if user doesn't have phone
      if (customerInfo.phone === '0000000000' && selectedAddress.phone) {
        customerInfo.phone = selectedAddress.phone;
      }
    }
    
    if (!finalShippingAddress || !finalShippingAddress.fullAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Validate and process items
    let totalAmount = 0;
    let totalItems = 0;
    const processedItems = [];

    for (const item of items) {
      const productId = String(item?.productId || '').trim();
      const parsedQuantity = Number(item?.quantity);
      const quantity = Number.isFinite(parsedQuantity) && parsedQuantity > 0
        ? Math.floor(parsedQuantity)
        : 0;

      if (!productId || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid productId and quantity'
        });
      }

      const isDemoItem = Boolean(item?.isDemo) || productId.startsWith('demo-');
      const isObjectIdProduct = mongoose.Types.ObjectId.isValid(productId);

      if (!isObjectIdProduct && !isDemoItem) {
        return res.status(400).json({
          success: false,
          message: `Invalid product ID ${productId}`
        });
      }

      // Process real DB product item
      if (isObjectIdProduct && !isDemoItem) {
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${productId} not found`
          });
        }

        // Check stock availability
        if (product.stockQuantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${quantity}`
          });
        }

        const subtotal = product.price * quantity;
        totalAmount += subtotal;
        totalItems += quantity;

        processedItems.push({
          isDemo: false,
          productId: product._id,
          productName: product.name || product.seoTitle,
          productBrand: product.brand || 'Unknown',
          productPrice: product.price,
          quantity,
          subtotal
        });

        continue;
      }

      // Process demo item (no stock check, no DB product required)
      const parsedProductPrice = Number(item?.productPrice);
      const productPrice = Number.isFinite(parsedProductPrice) && parsedProductPrice > 0
        ? parsedProductPrice
        : 0;
      const productName = String(item?.productName || '').trim();
      const productBrand = String(item?.productBrand || 'Demo').trim() || 'Demo';

      if (!productName || productPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: `Demo item ${productId} must include productName and productPrice`
        });
      }

      const subtotal = productPrice * quantity;
      totalAmount += subtotal;
      totalItems += quantity;

      processedItems.push({
        isDemo: true,
        demoProductId: productId,
        productName,
        productBrand,
        productPrice,
        quantity,
        subtotal
      });
    }

    // Create order
    const newOrder = new Order({
      customerInfo,
      items: processedItems,
      totalAmount,
      totalItems,
      shippingAddress: finalShippingAddress,
      customerNotes: customerNotes || '',
      paymentMethod: normalizedPaymentMethod,
      userId: userId || null
    });

    const savedOrder = await newOrder.save();

    // Add order to user's order history if user is logged in
    if (userId) {
      await User.findByIdAndUpdate(
        userId,
        { 
          $push: { orders: savedOrder._id },
          $inc: { totalOrders: 1 }
        }
      );
    }

    // Update product stock quantities
    for (const item of processedItems) {
      if (item.isDemo || !item.productId) continue;
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity } },
        { new: true }
      );
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(savedOrder);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: savedOrder._id,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        estimatedDelivery: savedOrder.estimatedDelivery
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const { identifier, orderId } = req.params; // Order ID - can come from either parameter
    const id = identifier || orderId;

    let order;

    // Check if id is a valid ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id).populate('items.productId');
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Get orders by customer email
const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await Order.find({ 'customerInfo.email': email })
      .populate('items.productId', 'images imageUrl name seoTitle')
      .sort({ orderDate: -1 });

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders by email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const updateData = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    if (status === 'delivered') {
      updateData.deliveryDate = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      startDate, 
      endDate,
      sortBy = 'orderDate',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) {
        query.orderDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.orderDate.$lte = new Date(endDate);
      }
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };

    const orders = await Order.find(query)
      .populate('items.productId', 'images imageUrl name seoTitle')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemsList = order.items.map(item => 
      `• ${item.productName} (${item.productBrand}) - Quantity: ${item.quantity} - ₹${item.subtotal}`
    ).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.customerInfo.email,
      subject: `Order Confirmation - ${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">Order Confirmation</h2>
          <p>Dear ${order.customerInfo.name},</p>
          <p>Thank you for your order! We have received your order and it's being processed.</p>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0891b2;">Order Details</h3>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Order Date:</strong> ${order.orderDate.toLocaleDateString()}</p>
            <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery.toLocaleDateString()}</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Items Ordered:</h3>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
            <hr style="margin: 15px 0;">
            <p><strong>Total Amount: ₹${order.totalAmount}</strong></p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Shipping Address:</h3>
            <p>${order.shippingAddress.fullAddress}</p>
          </div>
          
          <p>We'll send you another email when your order ships with tracking information.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Thank you for shopping with us!</p>
          <p style="color: #6b7280;">Best regards,<br>Computer Store Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully');
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrdersByEmail,
  updateOrderStatus,
  getAllOrders
};
