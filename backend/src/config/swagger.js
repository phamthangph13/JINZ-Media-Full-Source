const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JINZMedia Backend API',
      version: '1.0.0',
      description: 'API documentation for JINZMedia backend application with authentication, MongoDB, and email functionality.',
      contact: {
        name: 'JINZMedia Team',
        email: 'contact@jinzmedia.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.jinzmedia.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email'],
          properties: {
            _id: {
              type: 'string',
              description: 'Unique identifier for the user',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'Full name of the user',
              example: 'Nguyễn Văn A'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the user',
              example: 'user@example.com'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-01-01T00:00:00.000Z'
            }
          }
        },
        UserRegister: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'Full name (2-50 characters)',
              example: 'Nguyễn Văn A',
              minLength: 2,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Valid email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              description: 'Password (minimum 6 characters, must contain uppercase, lowercase, and number)',
              example: 'Password123',
              minLength: 6
            }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'Password123'
            }
          }
        },
        ForgotPassword: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address for password reset',
              example: 'user@example.com'
            }
          }
        },
        ResetPassword: {
          type: 'object',
          required: ['password'],
          properties: {
            password: {
              type: 'string',
              description: 'New password (minimum 6 characters, must contain uppercase, lowercase, and number)',
              example: 'NewPassword123',
              minLength: 6
            }
          }
        },
        UpdatePassword: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: {
              type: 'string',
              description: 'Current password',
              example: 'OldPassword123'
            },
            newPassword: {
              type: 'string',
              description: 'New password (minimum 6 characters, must contain uppercase, lowercase, and number)',
              example: 'NewPassword123',
              minLength: 6
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            token: {
              type: 'string',
              description: 'JWT token (for authentication endpoints)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message in Vietnamese',
              example: 'Email đã được sử dụng'
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'JINZMedia Backend API is running'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z'
            },
            environment: {
              type: 'string',
              example: 'development'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and account management endpoints'
      },
      {
        name: 'Health',
        description: 'API health check endpoints'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './app.js'
  ]
};

const specs = swaggerJSDoc(options);

module.exports = specs; 