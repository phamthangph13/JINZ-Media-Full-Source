const Package = require('../models/Package');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

// Helper function to delete old image
const deleteOldImage = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, '../../', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// @desc    Get all packages with filtering, sorting, and pagination
// @route   GET /api/admin/packages
// @access  Private/Admin
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách gói',
      error: error.message
    });
  }
};

// @desc    Get single package
// @route   GET /api/admin/packages/:id
// @access  Private/Admin
exports.getPackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy gói'
      });
    }

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin gói',
      error: error.message
    });
  }
};

// @desc    Create package
// @route   POST /api/admin/packages
// @access  Private/Admin
exports.createPackage = async (req, res) => {
  try {
    // Validate features
    if (!req.body.features || !Array.isArray(req.body.features) || req.body.features.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng thêm ít nhất một tính năng cho gói'
      });
    }

    // Set limit to 0 for unlimited features
    req.body.features = req.body.features.map(feature => ({
      ...feature,
      limit: feature.isUnlimited ? 0 : feature.limit
    }));

    // Handle image upload
    if (req.file) {
      req.body.image = req.file.path.replace(/\\/g, '/');
    }

    const package = await Package.create(req.body);

    res.status(201).json({
      success: true,
      data: package
    });
  } catch (error) {
    // Delete uploaded image if package creation fails
    if (req.file) {
      deleteOldImage(req.file.path);
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể tạo gói mới',
      error: error.message
    });
  }
};

// @desc    Update package
// @route   PUT /api/admin/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res) => {
  try {
    const oldPackage = await Package.findById(req.params.id);
    if (!oldPackage) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy gói'
      });
    }

    // Validate features if provided
    if (req.body.features) {
      if (!Array.isArray(req.body.features) || req.body.features.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng thêm ít nhất một tính năng cho gói'
        });
      }

      // Set limit to 0 for unlimited features
      req.body.features = req.body.features.map(feature => ({
        ...feature,
        limit: feature.isUnlimited ? 0 : feature.limit
      }));
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (oldPackage.image) {
        deleteOldImage(oldPackage.image);
      }
      req.body.image = req.file.path.replace(/\\/g, '/');
    }

    const package = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    // Delete uploaded image if update fails
    if (req.file) {
      deleteOldImage(req.file.path);
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0]
      });
    }

    res.status(500).json({
      success: false,
      message: 'Không thể cập nhật gói',
      error: error.message
    });
  }
};

// @desc    Delete package
// @route   DELETE /api/admin/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy gói'
      });
    }

    // Check if any users are subscribed to this package
    const subscriberCount = await User.countDocuments({ 'subscription.packageId': package._id });
    
    if (subscriberCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa gói vì có ${subscriberCount} người dùng đang sử dụng`
      });
    }

    // Delete package image if exists
    if (package.image) {
      deleteOldImage(package.image);
    }

    await package.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa gói',
      error: error.message
    });
  }
};

// @desc    Toggle package status
// @route   PATCH /api/admin/packages/:id/toggle-status
// @access  Private/Admin
exports.togglePackageStatus = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy gói'
      });
    }

    package.isActive = !package.isActive;
    await package.save();

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể thay đổi trạng thái gói',
      error: error.message
    });
  }
};

// @desc    Update package display order
// @route   PATCH /api/admin/packages/reorder
// @access  Private/Admin
exports.reorderPackages = async (req, res) => {
  try {
    const { packages } = req.body; // Array of { id, displayOrder }

    if (!Array.isArray(packages)) {
      return res.status(400).json({
        success: false,
        error: 'Danh sách gói dịch vụ phải là một mảng'
      });
    }

    // Update display order for each package
    const updatePromises = packages.map(pkg => 
      Package.findByIdAndUpdate(pkg.id, { displayOrder: pkg.displayOrder })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'Cập nhật thứ tự hiển thị thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get package subscribers
// @route   GET /api/admin/packages/:id/subscribers
// @access  Private/Admin
exports.getPackageSubscribers = async (req, res) => {
  try {
    const packageId = req.params.id;
    
    // Check if package exists
    const package = await Package.findById(packageId);
    if (!package) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy gói dịch vụ'
      });
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;

    // Get subscribers
    const subscribers = await User.find({ 'subscription.packageId': packageId })
      .select('name email subscription createdAt lastLogin')
      .skip(startIndex)
      .limit(limit)
      .sort('-subscription.startDate');

    const total = await User.countDocuments({ 'subscription.packageId': packageId });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      total,
      data: {
        package,
        subscribers
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get package statistics
// @route   GET /api/admin/packages/stats
// @access  Private/Admin
exports.getPackageStats = async (req, res) => {
  try {
    const totalPackages = await Package.countDocuments();
    const activePackages = await Package.countDocuments({ isActive: true });
    const monthlyPackages = await Package.countDocuments({ type: 'monthly' });
    const yearlyPackages = await Package.countDocuments({ type: 'yearly' });
    const lifetimePackages = await Package.countDocuments({ type: 'lifetime' });

    // Revenue by package type
    const revenueByType = await User.aggregate([
      {
        $match: {
          'subscription.isActive': true,
          'subscription.packageId': { $ne: null }
        }
      },
      {
        $lookup: {
          from: 'packages',
          localField: 'subscription.packageId',
          foreignField: '_id',
          as: 'package'
        }
      },
      {
        $unwind: '$package'
      },
      {
        $group: {
          _id: '$package.type',
          revenue: { $sum: '$package.price' },
          subscribers: { $sum: 1 }
        }
      }
    ]);

    // Popular packages
    const popularPackages = await User.aggregate([
      {
        $match: {
          'subscription.packageId': { $ne: null }
        }
      },
      {
        $group: {
          _id: '$subscription.packageId',
          subscribers: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: '_id',
          as: 'package'
        }
      },
      {
        $unwind: '$package'
      },
      {
        $project: {
          _id: '$package._id',
          name: '$package.name',
          type: '$package.type',
          price: '$package.price',
          subscribers: 1
        }
      },
      { $sort: { subscribers: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalPackages,
        activePackages,
        packagesByType: {
          monthly: monthlyPackages,
          yearly: yearlyPackages,
          lifetime: lifetimePackages
        },
        revenueByType,
        popularPackages
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 