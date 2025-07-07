const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger');

// Import routes
const authRoutes = require('./src/routes/authRoutes');

// Import middleware
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau'
  }
});

app.use('/api/', limiter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'JINZMedia API Documentation'
}));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API health check
 *     description: Check if the API is running and get basic information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JINZMedia Backend API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Mount routers
app.use('/api/auth', authRoutes);

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} không tồn tại`
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

module.exports = app; 