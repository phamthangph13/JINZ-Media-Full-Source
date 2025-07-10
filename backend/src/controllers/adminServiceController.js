const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');

// Helper function to delete old file
const deleteOldFile = (filePath) => {
  if (filePath) {
    const fullPath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private/Admin
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách dịch vụ',
      error: error.message
    });
  }
};

// @desc    Get single service
// @route   GET /api/admin/services/:id
// @access  Private/Admin
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin dịch vụ',
      error: error.message
    });
  }
};

// @desc    Create service
// @route   POST /api/admin/services
// @access  Private/Admin
exports.createService = async (req, res) => {
  try {
    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        req.body.image = req.files.image[0].path.replace(/\\/g, '/');
      }
      if (req.files.tutorialVideo) {
        req.body.tutorialVideo = req.files.tutorialVideo[0].path.replace(/\\/g, '/');
      }
    }

    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    // Delete uploaded files if service creation fails
    if (req.files) {
      if (req.files.image) {
        deleteOldFile(req.files.image[0].path);
      }
      if (req.files.tutorialVideo) {
        deleteOldFile(req.files.tutorialVideo[0].path);
      }
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
      message: 'Không thể tạo dịch vụ mới',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
  try {
    const oldService = await Service.findById(req.params.id);
    if (!oldService) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        // Delete old image if exists
        if (oldService.image) {
          deleteOldFile(oldService.image);
        }
        req.body.image = req.files.image[0].path.replace(/\\/g, '/');
      }
      if (req.files.tutorialVideo) {
        // Delete old video if exists
        if (oldService.tutorialVideo) {
          deleteOldFile(oldService.tutorialVideo);
        }
        req.body.tutorialVideo = req.files.tutorialVideo[0].path.replace(/\\/g, '/');
      }
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    // Delete uploaded files if update fails
    if (req.files) {
      if (req.files.image) {
        deleteOldFile(req.files.image[0].path);
      }
      if (req.files.tutorialVideo) {
        deleteOldFile(req.files.tutorialVideo[0].path);
      }
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
      message: 'Không thể cập nhật dịch vụ',
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    // Delete associated files
    if (service.image) {
      deleteOldFile(service.image);
    }
    if (service.tutorialVideo) {
      deleteOldFile(service.tutorialVideo);
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể xóa dịch vụ',
      error: error.message
    });
  }
};

// @desc    Toggle service status
// @route   PATCH /api/admin/services/:id/toggle-status
// @access  Private/Admin
exports.toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể thay đổi trạng thái dịch vụ',
      error: error.message
    });
  }
};

// @desc    Update service display order
// @route   PATCH /api/admin/services/reorder
// @access  Private/Admin
exports.reorderServices = async (req, res) => {
  try {
    const { services } = req.body; // Array of { id, displayOrder }

    if (!Array.isArray(services)) {
      return res.status(400).json({
        success: false,
        error: 'Danh sách dịch vụ phải là một mảng'
      });
    }

    // Update display order for each service
    const updatePromises = services.map(service => 
      Service.findByIdAndUpdate(service.id, { displayOrder: service.displayOrder })
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

// @desc    Get service usage analytics
// @route   GET /api/admin/services/:id/analytics
// @access  Private/Admin
exports.getServiceAnalytics = async (req, res) => {
  try {
    const serviceId = req.params.id;

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Không tìm thấy dịch vụ'
      });
    }

    // Usage by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usageByDay = await User.aggregate([
      { $unwind: '$usageHistory' },
      {
        $match: {
          'usageHistory.serviceId': service._id,
          'usageHistory.usedAt': { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$usageHistory.usedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Top users by usage
    const topUsers = await User.aggregate([
      { $unwind: '$usageHistory' },
      { $match: { 'usageHistory.serviceId': service._id } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          email: { $first: '$email' },
          usageCount: { $sum: 1 },
          lastUsed: { $max: '$usageHistory.usedAt' }
        }
      },
      { $sort: { usageCount: -1 } },
      { $limit: 10 }
    ]);

    // Total usage stats
    const totalUsage = await User.aggregate([
      { $unwind: '$usageHistory' },
      { $match: { 'usageHistory.serviceId': service._id } },
      {
        $group: {
          _id: null,
          totalUsage: { $sum: 1 },
          uniqueUsers: { $addToSet: '$_id' },
          firstUsed: { $min: '$usageHistory.usedAt' },
          lastUsed: { $max: '$usageHistory.usedAt' }
        }
      },
      {
        $project: {
          totalUsage: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          firstUsed: 1,
          lastUsed: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        service,
        usageByDay,
        topUsers,
        stats: totalUsage[0] || {
          totalUsage: 0,
          uniqueUsers: 0,
          firstUsed: null,
          lastUsed: null
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get services by category
// @route   GET /api/admin/services/categories/:category
// @access  Private/Admin
exports.getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const services = await Service.find({ category }).sort('displayOrder');
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get service statistics
// @route   GET /api/admin/services/stats
// @access  Private/Admin
exports.getServiceStats = async (req, res) => {
  try {
    const totalServices = await Service.countDocuments();
    const activeServices = await Service.countDocuments({ isActive: true });
    const freeServices = await Service.countDocuments({ type: 'free' });
    const premiumServices = await Service.countDocuments({ type: 'premium' });
    const enterpriseServices = await Service.countDocuments({ type: 'enterprise' });

    // Services by category
    const servicesByCategory = await Service.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Most used services (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const mostUsedServices = await User.aggregate([
      { $unwind: '$usageHistory' },
      { $match: { 'usageHistory.usedAt': { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: '$usageHistory.serviceId',
          usageCount: { $sum: 1 },
          uniqueUsers: { $addToSet: '$_id' }
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: '_id',
          foreignField: '_id',
          as: 'service'
        }
      },
      { $unwind: '$service' },
      {
        $project: {
          _id: '$service._id',
          name: '$service.name',
          category: '$service.category',
          usageCount: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { usageCount: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalServices,
        activeServices,
        servicesByType: {
          free: freeServices,
          premium: premiumServices,
          enterprise: enterpriseServices
        },
        servicesByCategory,
        mostUsedServices
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}; 