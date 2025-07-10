const User = require('../models/User');
const Package = require('../models/Package');

// @desc    Get all users with filtering, sorting, and pagination
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from query
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resources
    let query = User.find(JSON.parse(queryStr)).populate('subscription.packageId');

    // Select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await User.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const users = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination,
      data: users
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('subscription.packageId')
      .populate('usageHistory.serviceId');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Assign package to user
// @route   POST /api/admin/users/:id/assign-package
// @access  Private/Admin
exports.assignPackage = async (req, res) => {
  try {
    const { packageId, startDate, customEndDate } = req.body;

    const user = await User.findById(req.params.id);
    const package = await Package.findById(packageId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng'
      });
    }

    if (!package) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy gói dịch vụ'
      });
    }

    let endDate;
    let isLifetime = false;

    if (package.type === 'lifetime') {
      isLifetime = true;
      endDate = null;
    } else if (customEndDate) {
      endDate = new Date(customEndDate);
    } else {
      const start = startDate ? new Date(startDate) : new Date();
      endDate = new Date(start);
      
      if (package.duration.unit === 'days') {
        endDate.setDate(endDate.getDate() + package.duration.value);
      } else if (package.duration.unit === 'months') {
        endDate.setMonth(endDate.getMonth() + package.duration.value);
      } else if (package.duration.unit === 'years') {
        endDate.setFullYear(endDate.getFullYear() + package.duration.value);
      }
    }

    user.subscription = {
      packageId,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate,
      isActive: true,
      isLifetime
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Gán gói dịch vụ thành công',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Remove package from user
// @route   DELETE /api/admin/users/:id/remove-package
// @access  Private/Admin
exports.removePackage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy người dùng'
      });
    }

    user.subscription = {
      packageId: null,
      startDate: null,
      endDate: null,
      isActive: false,
      isLifetime: false
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Xóa gói dịch vụ thành công',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get user statistics
// @route   GET /api/admin/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const subscribedUsers = await User.countDocuments({ 'subscription.isActive': true });

    // Users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Users by subscription status
    const usersBySubscription = await User.aggregate([
      {
        $group: {
          _id: '$subscription.isActive',
          count: { $sum: 1 }
        }
      }
    ]);

    // Users by month (last 12 months)
    const usersByMonth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        subscribedUsers,
        newUsers,
        usersBySubscription,
        usersByMonth
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 