const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'full name is required'],
    trim: true,
    maxlength: [50, 'name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.facebookId && !this.oauthProvider;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]{10,15}$/, 'Please provide a valid phone number']
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },

  // OAuth Information
  googleId: {
    type: String,
    sparse: true // Allow multiple null values but unique non-null values
  },
  facebookId: {
    type: String,
    sparse: true
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'facebook', 'apple', 'github']
  },
  profilePicture: {
    type: String // URL to profile picture from OAuth provider
  },

  // Address Information
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      default: 'India',
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    }
  }],

  // Account Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },

  cart: [{
    isDemo: {
      type: Boolean,
      default: false
    },
    demoProductId: {
      type: String,
      trim: true,
      required: function() {
        return this.isDemo;
      }
    },
    demoProductName: {
      type: String,
      trim: true,
      required: function() {
        return this.isDemo;
      }
    },
    demoProductBrand: {
      type: String,
      trim: true,
      default: 'Demo'
    },
    demoProductPrice: {
      type: Number,
      min: 0,
      default: 0
    },
    demoImageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: function() {
        return !this.isDemo;
      }
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Order History References
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],

 
  // Analytics
  totalOrders: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true,
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });




// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};



// Method to add item to cart
userSchema.methods.addToCart = function(productInput, quantity = 1) {
  const normalizedQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const isObjectInput = productInput && typeof productInput === 'object' && !Array.isArray(productInput);

  const rawProductId = isObjectInput
    ? (productInput.productId || productInput._id || productInput.id)
    : productInput;
  const normalizedProductId = String(rawProductId || '').trim();

  if (!normalizedProductId) {
    return Promise.resolve(this);
  }

  const isDemo = (isObjectInput && Boolean(productInput.isDemo)) || normalizedProductId.startsWith('demo-');

  if (isDemo) {
    const existingDemoItem = this.cart.find(
      (item) => item.isDemo && String(item.demoProductId || '') === normalizedProductId
    );

    if (existingDemoItem) {
      existingDemoItem.quantity += normalizedQuantity;

      if (isObjectInput) {
        existingDemoItem.demoProductName =
          productInput.productName ||
          productInput.name ||
          existingDemoItem.demoProductName ||
          'Demo Product';
        existingDemoItem.demoProductBrand =
          productInput.productBrand ||
          productInput.brand ||
          productInput.category ||
          existingDemoItem.demoProductBrand ||
          'Demo';
        existingDemoItem.demoProductPrice = Math.max(
          0,
          Number(productInput.productPrice ?? productInput.price ?? existingDemoItem.demoProductPrice ?? 0) || 0
        );
        existingDemoItem.demoImageUrl =
          productInput.imageUrl ||
          productInput.image ||
          (Array.isArray(productInput.images) ? productInput.images[0] : '') ||
          existingDemoItem.demoImageUrl ||
          '';
      }
    } else {
      this.cart.push({
        isDemo: true,
        demoProductId: normalizedProductId,
        demoProductName: isObjectInput
          ? (productInput.productName || productInput.name || 'Demo Product')
          : 'Demo Product',
        demoProductBrand: isObjectInput
          ? (productInput.productBrand || productInput.brand || productInput.category || 'Demo')
          : 'Demo',
        demoProductPrice: isObjectInput
          ? Math.max(0, Number(productInput.productPrice ?? productInput.price ?? 0) || 0)
          : 0,
        demoImageUrl: isObjectInput
          ? (
            productInput.imageUrl ||
            productInput.image ||
            (Array.isArray(productInput.images) ? productInput.images[0] : '') ||
            ''
          )
          : '',
        quantity: normalizedQuantity
      });
    }

    return this.save();
  }

  const existingItem = this.cart.find(
    (item) => !item.isDemo && item.product && item.product.toString() === normalizedProductId
  );

  if (existingItem) {
    existingItem.quantity += normalizedQuantity;
  } else {
    this.cart.push({
      isDemo: false,
      product: normalizedProductId,
      quantity: normalizedQuantity
    });
  }

  return this.save();
};

// Method to remove item from cart
userSchema.methods.removeFromCart = function(productId) {
  const normalizedProductId = String(productId || '').trim();

  if (!normalizedProductId) {
    return Promise.resolve(this);
  }

  const isDemo = normalizedProductId.startsWith('demo-');

  this.cart = this.cart.filter((item) => {
    if (isDemo) {
      return !(item.isDemo && String(item.demoProductId || '') === normalizedProductId);
    }

    if (item.isDemo || !item.product) return true;
    return item.product.toString() !== normalizedProductId;
  });

  return this.save();
};

// Method to clear cart
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Method to add to wishlist
userSchema.methods.addToWishlist = function(productId) {
  const exists = this.wishlist.find(item => 
    item.product.toString() === productId.toString()
  );

  if (!exists) {
    this.wishlist.push({ product: productId });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to remove from wishlist
userSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Method to get default address
userSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(address => address.isDefault) || this.addresses[0];
};

// Method to set default address
userSchema.methods.setDefaultAddress = function(addressId) {
  // Remove default from all addresses
  this.addresses.forEach(address => {
    address.isDefault = address._id.toString() === addressId.toString();
  });
  return this.save();
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

module.exports = mongoose.model('User', userSchema);
