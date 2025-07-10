const express = require('express');
const {
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  reorderPackages,
  getPackageSubscribers,
  getPackageStats
} = require('../controllers/adminPackageController');

const { adminAuth } = require('../middleware/adminAuth');
const { validateRequest } = require('../middleware/validation');
const { body, param } = require('express-validator');
const upload = require('../middleware/fileUpload');

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - type
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the package
 *         name:
 *           type: string
 *           description: Package name
 *         description:
 *           type: string
 *           description: Package description
 *         image:
 *           type: string
 *           description: URL path to the package image
 *         type:
 *           type: string
 *           enum: [monthly, yearly, lifetime]
 *           description: Package type
 *         price:
 *           type: number
 *           description: Package price
 *         originalPrice:
 *           type: number
 *           description: Original price before discount
 *         currency:
 *           type: string
 *           enum: [VND, USD]
 *           description: Currency
 *         duration:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *             unit:
 *               type: string
 *               enum: [days, months, years]
 *         features:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isUnlimited:
 *                 type: boolean
 *               limit:
 *                 type: number
 *         isActive:
 *           type: boolean
 *           description: Whether the package is active
 *         isPopular:
 *           type: boolean
 *           description: Whether the package is marked as popular
 *         displayOrder:
 *           type: number
 *           description: Display order
 *         createdAt:
 *           type: string
 *           format: date
 *         updatedAt:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /api/admin/packages/stats:
 *   get:
 *     summary: Get package statistics
 *     tags: [Admin - Packages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Package statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/stats', getPackageStats);

/**
 * @swagger
 * /api/admin/packages/reorder:
 *   patch:
 *     summary: Reorder packages
 *     tags: [Admin - Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - packages
 *             properties:
 *               packages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     displayOrder:
 *                       type: number
 *     responses:
 *       200:
 *         description: Package order updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch('/reorder', [
  body('packages').isArray().withMessage('Packages phải là một mảng'),
  body('packages.*.id').isMongoId().withMessage('Package ID không hợp lệ'),
  body('packages.*.displayOrder').isNumeric().withMessage('Display order phải là số'),
  validateRequest
], reorderPackages);

/**
 * @swagger
 * /api/admin/packages:
 *   get:
 *     summary: Get all packages with filtering and pagination
 *     tags: [Admin - Packages]
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
 *         description: Number of packages per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [monthly, yearly, lifetime]
 *         description: Filter by type
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/', getPackages);

/**
 * @swagger
 * /api/admin/packages:
 *   post:
 *     summary: Create a new package
 *     tags: [Admin - Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - type
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Package image file (max 5MB, image files only)
 *               type:
 *                 type: string
 *                 enum: [monthly, yearly, lifetime]
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [VND, USD]
 *               duration:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                   unit:
 *                     type: string
 *                     enum: [days, months, years]
 *               features:
 *                 type: array
 *               includedServices:
 *                 type: array
 *               isActive:
 *                 type: boolean
 *               isPopular:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Package created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', [
  upload.single('image'),
  body('name').trim().notEmpty().withMessage('Vui lòng nhập tên gói'),
  body('description').trim().optional(),
  body('type').isIn(['monthly', 'yearly', 'lifetime']).withMessage('Loại gói không hợp lệ'),
  body('price').isNumeric().withMessage('Giá gói phải là số'),
  validateRequest
], createPackage);

/**
 * @swagger
 * /api/admin/packages/{id}:
 *   get:
 *     summary: Get package by ID
 *     tags: [Admin - Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package retrieved successfully
 *       404:
 *         description: Package not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], getPackage);

/**
 * @swagger
 * /api/admin/packages/{id}:
 *   put:
 *     summary: Update a package
 *     tags: [Admin - Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Package image file (max 5MB, image files only)
 *               type:
 *                 type: string
 *                 enum: [monthly, yearly, lifetime]
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               currency:
 *                 type: string
 *                 enum: [VND, USD]
 *               duration:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: number
 *                   unit:
 *                     type: string
 *                     enum: [days, months, years]
 *               features:
 *                 type: array
 *               includedServices:
 *                 type: array
 *               isActive:
 *                 type: boolean
 *               isPopular:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Package updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Package not found
 */
router.put('/:id', [
  upload.single('image'),
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  body('name').trim().optional(),
  body('description').trim().optional(),
  body('type').optional().isIn(['monthly', 'yearly', 'lifetime']).withMessage('Loại gói không hợp lệ'),
  body('price').optional().isNumeric().withMessage('Giá gói phải là số'),
  validateRequest
], updatePackage);

/**
 * @swagger
 * /api/admin/packages/{id}:
 *   delete:
 *     summary: Delete package
 *     tags: [Admin - Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       400:
 *         description: Cannot delete package with active subscribers
 *       404:
 *         description: Package not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], deletePackage);

/**
 * @swagger
 * /api/admin/packages/{id}/toggle-status:
 *   patch:
 *     summary: Toggle package active status
 *     tags: [Admin - Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *     responses:
 *       200:
 *         description: Package status toggled successfully
 *       404:
 *         description: Package not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.patch('/:id/toggle-status', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], togglePackageStatus);

/**
 * @swagger
 * /api/admin/packages/{id}/subscribers:
 *   get:
 *     summary: Get package subscribers
 *     tags: [Admin - Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of subscribers per page
 *     responses:
 *       200:
 *         description: Package subscribers retrieved successfully
 *       404:
 *         description: Package not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/:id/subscribers', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], getPackageSubscribers);

module.exports = router; 