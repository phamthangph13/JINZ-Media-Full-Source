const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  assignPackage,
  removePackage,
  getUserStats
} = require('../controllers/adminUserController');

const { adminAuth } = require('../middleware/adminAuth');
const { validateRequest } = require('../middleware/validation');
const { body, param } = require('express-validator');

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user's full name
 *         email:
 *           type: string
 *           description: The user's email address
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: The user's role
 *         isActive:
 *           type: boolean
 *           description: Whether the user is active
 *         subscription:
 *           type: object
 *           properties:
 *             packageId:
 *               type: string
 *               description: ID of subscribed package
 *             startDate:
 *               type: string
 *               format: date
 *             endDate:
 *               type: string
 *               format: date
 *             isActive:
 *               type: boolean
 *             isLifetime:
 *               type: boolean
 *         createdAt:
 *           type: string
 *           format: date
 *         updatedAt:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /api/admin/users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/stats', getUserStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with filtering and pagination
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of users per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: Filter by role
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/', getUsers);

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tên phải có từ 1-50 ký tự'),
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role phải là user hoặc admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive phải là boolean'),
  validateRequest
], createUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], getUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.put('/:id', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tên phải có từ 1-50 ký tự'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role phải là user hoặc admin'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive phải là boolean'),
  validateRequest
], updateUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], deleteUser);

/**
 * @swagger
 * /api/admin/users/{id}/assign-package:
 *   post:
 *     summary: Assign package to user
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packageId
 *             properties:
 *               packageId:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               customEndDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Package assigned successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User or package not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/:id/assign-package', [
  param('id').isMongoId().withMessage('User ID không hợp lệ'),
  body('packageId').isMongoId().withMessage('Package ID không hợp lệ'),
  body('startDate').optional().isISO8601().withMessage('Ngày bắt đầu không hợp lệ'),
  body('customEndDate').optional().isISO8601().withMessage('Ngày kết thúc không hợp lệ'),
  validateRequest
], assignPackage);

/**
 * @swagger
 * /api/admin/users/{id}/remove-package:
 *   delete:
 *     summary: Remove package from user
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Package removed successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/:id/remove-package', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], removePackage);

module.exports = router; 