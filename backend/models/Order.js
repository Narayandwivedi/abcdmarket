const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  productName: {
    type: String,
    required: [true, 'Product name is required']
  },
  productBrand: {
    type: String,
    required: [true, 'Product brand is required']
  },
  productPrice: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative']
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullAddress: {
    type: String,
    required: [true, 'Full address is required'],
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  }
});

const orderSchema = new mongoose.Schema({
  // Customer Information
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\+]?[0-9\s\-\(\)]{10,}$/, 'Please provide a valid phone number']
    }
  },

  // Order Items
  items: [orderItemSchema],

  // Order Summary
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },

  totalItems: {
    type: Number,
    required: [true, 'Total items count is required'],
    min: [1, 'Must have at least 1 item']
  },

  // Shipping Information
  shippingAddress: shippingAddressSchema,

  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },

  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },

  paymentMethod: {
    type: String,
    enum: ['cod', 'online', 'card', 'upi'],
    default: 'cod'
  },

  // Timestamps
  orderDate: {
    type: Date,
    default: Date.now
  },

  estimatedDelivery: {
    type: Date
  },

  deliveryDate: {
    type: Date
  },

  // Notes and Comments
  customerNotes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },

  // Reference to user (optional, if user is registered)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Pre-save middleware for estimated delivery date
orderSchema.pre('save', async function(next) {
  // Set estimated delivery date (7 days from order date)
  if (this.isNew && !this.estimatedDelivery) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    this.estimatedDelivery = deliveryDate;
  }
  
  next();
});

// Index for better query performance
// orderSchema.index({ 'customerInfo.email': 1 });
// orderSchema.index({ status: 1 });
// orderSchema.index({ orderDate: -1 });

module.exports = mongoose.model('Order', orderSchema);