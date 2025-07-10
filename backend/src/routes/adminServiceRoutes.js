const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus
} = require('../controllers/adminServiceController');

const { adminAuth } = require('../middleware/adminAuth');
const { validateRequest } = require('../middleware/validation');
const { body, param } = require('express-validator');
const upload = require('../middleware/serviceFileUpload');

const router = express.Router();

// All routes require admin authentication
router.use(adminAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - type
 *         - category
 *         - permission
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the service
 *         name:
 *           type: string
 *           description: Service name
 *         description:
 *           type: string
 *           description: Service description
 *         image:
 *           type: string
 *           description: URL path to the service image
 *         tutorialVideo:
 *           type: string
 *           description: URL path to the tutorial video
 *         type:
 *           type: string
 *           enum: [basic, premium, enterprise]
 *           description: Service type
 *         category:
 *           type: string
 *           description: Service category
 *         permission:
 *           type: string
 *           description: Access permission for the service
 *         isActive:
 *           type: boolean
 *           description: Whether the service is active
 *         metadata:
 *           type: object
 *           description: Additional metadata for the service
 *         createdAt:
 *           type: string
 *           format: date
 *         updatedAt:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /api/admin/services:
 *   get:
 *     summary: Get all services
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Services retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/', getServices);

/**
 * @swagger
 * /api/admin/services:
 *   post:
 *     summary: Create a new service
 *     tags: [Admin - Services]
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
 *               - category
 *               - permission
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Service image file (max 5MB, image files only)
 *               tutorialVideo:
 *                 type: string
 *                 format: binary
 *                 description: Tutorial video file (max 100MB, video files only)
 *               type:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *               category:
 *                 type: string
 *               permission:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', [
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'tutorialVideo', maxCount: 1 }
  ]),
  body('name').trim().notEmpty().withMessage('Vui lòng nhập tên dịch vụ'),
  body('description').trim().optional(),
  body('type').isIn(['basic', 'premium', 'enterprise']).withMessage('Loại dịch vụ không hợp lệ'),
  body('category').trim().notEmpty().withMessage('Vui lòng chọn danh mục dịch vụ'),
  body('permission').trim().notEmpty().withMessage('Vui lòng nhập quyền truy cập'),
  validateRequest
], createService);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   get:
 *     summary: Get a single service
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Service not found
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], getService);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   put:
 *     summary: Update a service
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
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
 *                 description: Service image file (max 5MB, image files only)
 *               tutorialVideo:
 *                 type: string
 *                 format: binary
 *                 description: Tutorial video file (max 100MB, video files only)
 *               type:
 *                 type: string
 *                 enum: [basic, premium, enterprise]
 *               category:
 *                 type: string
 *               permission:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Service not found
 */
router.put('/:id', [
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'tutorialVideo', maxCount: 1 }
  ]),
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  body('name').trim().optional(),
  body('description').trim().optional(),
  body('type').optional().isIn(['basic', 'premium', 'enterprise']).withMessage('Loại dịch vụ không hợp lệ'),
  body('category').trim().optional(),
  body('permission').trim().optional(),
  validateRequest
], updateService);

/**
 * @swagger
 * /api/admin/services/{id}:
 *   delete:
 *     summary: Delete a service
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Service not found
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], deleteService);

/**
 * @swagger
 * /api/admin/services/{id}/toggle-status:
 *   patch:
 *     summary: Toggle service status
 *     tags: [Admin - Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service status updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Service not found
 */
router.patch('/:id/toggle-status', [
  param('id').isMongoId().withMessage('ID không hợp lệ'),
  validateRequest
], toggleServiceStatus);

module.exports = router; 