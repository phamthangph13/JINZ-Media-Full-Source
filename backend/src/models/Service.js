const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên dịch vụ'],
    trim: true,
    maxlength: [100, 'Tên dịch vụ không được vượt quá 100 ký tự']
  },
  description: {
    type: String,
    maxlength: [500, 'Mô tả không được vượt quá 500 ký tự']
  },
  image: {
    type: String,
    default: null
  },
  tutorialVideo: {
    type: String,
    default: null
  },
  type: {
    type: String,
    required: [true, 'Vui lòng chọn loại dịch vụ'],
    enum: ['basic', 'premium', 'enterprise']
  },
  category: {
    type: String,
    required: [true, 'Vui lòng chọn danh mục dịch vụ']
  },
  permission: {
    type: String,
    required: [true, 'Vui lòng nhập quyền truy cập']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
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
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 