const express = require('express');

// Import admin route modules
const adminUserRoutes = require('./adminUserRoutes');
const adminPackageRoutes = require('./adminPackageRoutes');
const adminServiceRoutes = require('./adminServiceRoutes');

// Import controllers for dashboard and general admin functions
const User = require('../models/User');
const Package = require('../models/Package');
const Service = require('../models/Service');
const { adminAuth } = require('../middleware/adminAuth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AdminDashboard:
 *       type: object
 *       properties:
 *         totalUsers:
 *           type: number
 *         totalPackages:
 *           type: number
 *         totalServices:
 *           type: number
 *         activeSubscriptions:
 *           type: number
 *         recentUsers:
 *           type: array
 *         popularServices:
 *           type: array
 *         revenue:
 *           type: object
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AdminDashboard'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get basic counts
    const [totalUsers, totalPackages, totalServices, activeSubscriptions] = await Promise.all([
      User.countDocuments(),
      Package.countDocuments(),
      Service.countDocuments(),
      User.countDocuments({ 'subscription.isActive': true })
    ]);

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentUsers = await User.find({
      createdAt: { $gte: sevenDaysAgo }
    })
    .select('name email createdAt')
    .sort('-createdAt')
    .limit(5);

    // Get popular services (most used in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const popularServices = await User.aggregate([
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
      { $limit: 5 }
    ]);

    // Calculate revenue from active subscriptions
    const revenueData = await User.aggregate([
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
          _id: null,
          totalRevenue: { $sum: '$package.price' },
          monthlyRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$package.type', 'monthly'] },
                '$package.price',
                0
              ]
            }
          },
          yearlyRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$package.type', 'yearly'] },
                '$package.price',
                0
              ]
            }
          },
          lifetimeRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$package.type', 'lifetime'] },
                '$package.price',
                0
              ]
            }
          }
        }
      }
    ]);

    const revenue = revenueData[0] || {
      totalRevenue: 0,
      monthlyRevenue: 0,
      yearlyRevenue: 0,
      lifetimeRevenue: 0
    };

    // Get user growth data (last 12 months)
    const userGrowth = await User.aggregate([
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
        overview: {
          totalUsers,
          totalPackages,
          totalServices,
          activeSubscriptions
        },
        recentUsers,
        popularServices,
        revenue,
        userGrowth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/admin/overview:
 *   get:
 *     summary: Get admin overview statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalPackages,
      activePackages,
      totalServices,
      activeServices,
      totalSubscriptions,
      activeSubscriptions
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Package.countDocuments(),
      Package.countDocuments({ isActive: true }),
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      User.countDocuments({ 'subscription.packageId': { $ne: null } }),
      User.countDocuments({ 'subscription.isActive': true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers
        },
        packages: {
          total: totalPackages,
          active: activePackages,
          inactive: totalPackages - activePackages
        },
        services: {
          total: totalServices,
          active: activeServices,
          inactive: totalServices - activeServices
        },
        subscriptions: {
          total: totalSubscriptions,
          active: activeSubscriptions,
          inactive: totalSubscriptions - activeSubscriptions
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mount admin route modules
router.use('/users', adminUserRoutes);
router.use('/packages', adminPackageRoutes);
router.use('/services', adminServiceRoutes);

module.exports = router; 