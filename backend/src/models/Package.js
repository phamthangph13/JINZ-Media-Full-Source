const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên gói'],
    trim: true,
    maxlength: [100, 'Tên gói không được vượt quá 100 ký tự']
  },
  description: {
    type: String,
    maxlength: [500, 'Mô tả không được vượt quá 500 ký tự']
  },
  image: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['monthly', 'yearly', 'lifetime'],
    required: [true, 'Vui lòng chọn loại gói']
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá gói'],
    min: [0, 'Giá không thể âm']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Giá gốc không thể âm']
  },
  currency: {
    type: String,
    default: 'VND',
    enum: ['VND', 'USD']
  },
  duration: {
    value: {
      type: Number,
      required: function() {
        return this.type !== 'lifetime';
      }
    },
    unit: {
      type: String,
      enum: ['days', 'months', 'years'],
      required: function() {
        return this.type !== 'lifetime';
      }
    }
  },
  features: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Vui lòng chọn tính năng']
    },
    isUnlimited: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 0,
      min: [0, 'Giới hạn không thể âm']
    }
  }],
  includedServices: [{
    serviceId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Service',
      required: true
    },
    isUnlimited: {
      type: Boolean,
      default: false
    },
    usageLimit: {
      type: Number,
      default: null
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  metadata: {
    color: String,
    icon: String,
    badge: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
packageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Populate services when getting package
packageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'features.serviceId',
    select: '_id name description permission type category'
  });
  next();
});

// Virtual for package subscribers count
packageSchema.virtual('subscribersCount', {
  ref: 'User',
  localField: '_id',
  foreignField: 'subscription.packageId',
  count: true
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package; 