# JINZMedia Backend API

Node.js backend API for JINZMedia application with authentication, MongoDB, and email functionality.

## Features

- **Authentication System**
  - User registration with name, email, and password
  - User login with JWT tokens
  - Password reset via email
  - Protected routes with JWT authentication
  - Password strength validation

- **File Upload System**
  - Package image uploads (5MB limit)
  - Service image uploads (5MB limit)
  - Service tutorial video uploads (100MB limit)
  - Automatic file cleanup
  - File type validation
  - Secure file storage

- **Security**
  - Bcrypt password hashing
  - JWT token authentication
  - Rate limiting
  - Helmet security headers
  - CORS protection
  - Input validation with express-validator

- **Email Integration**
  - SMTP email service
  - Welcome emails on registration
  - Password reset emails
  - Password reset confirmation emails

- **Database**
  - MongoDB with Mongoose ODM
  - User schema with validation
  - Password reset token handling

- **API Documentation**
  - Swagger/OpenAPI 3.0 documentation
  - Interactive API explorer
  - Complete endpoint documentation
  - Request/response schemas

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer (SMTP)
- **File Upload**: Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI 3.0

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── swagger.js           # Swagger configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── adminPackageController.js  # Package management
│   │   └── adminServiceController.js   # Service management
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── validation.js       # Input validation
│   │   ├── errorHandler.js     # Error handling
│   │   ├── fileUpload.js      # Package image upload
│   │   └── serviceFileUpload.js # Service file upload
│   ├── models/
│   │   ├── User.js             # User model/schema
│   │   ├── Package.js          # Package model/schema
│   │   └── Service.js          # Service model/schema
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication routes
│   │   ├── adminPackageRoutes.js # Package management routes
│   │   └── adminServiceRoutes.js  # Service management routes
│   └── services/
│       └── emailService.js     # Email functionality
├── uploads/                    # File upload directory
│   ├── packages/              # Package images
│   └── services/              # Service files
│       ├── images/           # Service images
│       └── videos/           # Service tutorial videos
├── app.js                      # Express app configuration
├── server.js                   # Server startup
├── package.json               # Dependencies
├── .env                       # Environment variables
└── .gitignore                # Git ignore rules
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Update the `.env` file with your configurations:

```env
# Environment
NODE_ENV=development

# Server
PORT=5000
BASE_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/jinzmedia
# For production: mongodb+srv://username:password@cluster.mongodb.net/jinzmedia

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email (SMTP)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_FROM=noreply@jinzmedia.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Email Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `EMAIL_PASS`

### 4. Database Setup

**Option A: Local MongoDB**
```bash
# Install and start MongoDB locally
# Update MONGODB_URI in .env to: mongodb://localhost:27017/jinzmedia
```

**Option B: MongoDB Atlas (Cloud)**
```bash
# Create account at mongodb.com
# Create cluster and get connection string
# Update MONGODB_URI in .env with your connection string
```

### 5. Start Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Swagger UI

Access the interactive API documentation at: **http://localhost:5000/api-docs**

The Swagger UI provides:
- Complete API endpoint documentation
- Interactive request/response testing
- Schema definitions and examples
- Authentication testing with JWT tokens
- Real-time API exploration

### Using Swagger for Testing

1. **Open Swagger UI**: Navigate to `http://localhost:5000/api-docs`
2. **Test Public Endpoints**: Try registration, login, forgot password without authentication
3. **Test Protected Endpoints**: 
   - First, use the `/api/auth/login` endpoint to get a JWT token
   - Click the "Authorize" button at the top of Swagger UI
   - Enter: `Bearer your_jwt_token_here`
   - Now you can test protected endpoints like `/api/auth/me`

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| POST | `/api/auth/forgotpassword` | Send password reset email | Public |
| PUT | `/api/auth/resetpassword/:resettoken` | Reset password | Public |
| PUT | `/api/auth/updatepassword` | Update password | Private |

### Admin Dashboard Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/dashboard` | Get admin dashboard overview | Admin |

### Admin User Management Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/users` | Get all users | Admin |
| GET | `/api/admin/users/:id` | Get user by ID | Admin |
| POST | `/api/admin/users` | Create new user | Admin |
| PUT | `/api/admin/users/:id` | Update user | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| PUT | `/api/admin/users/:id/status` | Update user status | Admin |
| PUT | `/api/admin/users/:id/role` | Update user role | Admin |

### Admin Package Management Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/packages` | Get all packages | Admin |
| GET | `/api/admin/packages/:id` | Get package by ID | Admin |
| POST | `/api/admin/packages` | Create new package | Admin |
| PUT | `/api/admin/packages/:id` | Update package | Admin |
| DELETE | `/api/admin/packages/:id` | Delete package | Admin |
| PATCH | `/api/admin/packages/:id/toggle-status` | Toggle package status | Admin |

#### Create Package with Image
```http
POST /api/admin/packages
Content-Type: multipart/form-data

name: "Package Name"
description: "Package Description"
type: "monthly"
price: 99.99
image: [file] // Optional, max 5MB, image files only
```

### Admin Service Management Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/services` | Get all services | Admin |
| GET | `/api/admin/services/:id` | Get service by ID | Admin |
| POST | `/api/admin/services` | Create new service | Admin |
| PUT | `/api/admin/services/:id` | Update service | Admin |
| DELETE | `/api/admin/services/:id` | Delete service | Admin |
| PATCH | `/api/admin/services/:id/toggle-status` | Toggle service status | Admin |

#### Create Service with Files
```http
POST /api/admin/services
Content-Type: multipart/form-data

name: "Service Name"
description: "Service Description"
type: "basic"
category: "category"
permission: "permission"
image: [file] // Optional, max 5MB, image files only
tutorialVideo: [file] // Optional, max 100MB, video files only
```

#### Update Service with Files
```http
PUT /api/admin/services/:id
Content-Type: multipart/form-data

name: "Updated Service Name"
image: [file] // Optional, will replace existing image
tutorialVideo: [file] // Optional, will replace existing video
```

## API Request & Response Examples

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d3b41f7c213e3c50507d9d",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Admin Dashboard

#### Get Dashboard Overview
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalPackages": 5,
    "totalServices": 10,
    "activeSubscriptions": 75,
    "recentUsers": [...],
    "popularServices": [...],
    "revenue": {
      "totalRevenue": 15000,
      "monthlyRevenue": 5000,
      "yearlyRevenue": 8000,
      "lifetimeRevenue": 2000
    }
  }
}
```

### Package Management

#### Create Package
```http
POST /api/admin/packages
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Package",
  "description": "Advanced features for power users",
  "price": 99.99,
  "type": "monthly",
  "features": ["feature1", "feature2", "feature3"],
  "status": "active"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "60d3b41f7c213e3c50507d9e",
    "name": "Premium Package",
    "description": "Advanced features for power users",
    "price": 99.99,
    "type": "monthly",
    "features": ["feature1", "feature2", "feature3"],
    "status": "active"
  }
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Validation Rules

### Registration
- **Name**: Required, 2-50 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 6 characters, must contain uppercase, lowercase, and number

### Login
- **Email**: Required, valid email format
- **Password**: Required

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **CORS**: Cross-origin request protection
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation with express-validator

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
BASE_URL=https://your-domain.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jinzmedia
JWT_SECRET=your_very_secure_secret_key
CORS_ORIGIN=https://your-frontend-domain.com
```

### VPS Deployment Steps

1. **Server Setup**
   ```bash
   # Install Node.js and MongoDB
   # Clone your repository
   # Install dependencies: npm install
   ```

2. **Environment Configuration**
   ```bash
   # Create .env file with production values
   # Set up MongoDB (local or Atlas)
   # Configure email SMTP
   ```

3. **Process Management**
   ```bash
   # Install PM2: npm install -g pm2
   # Start app: pm2 start server.js --name "jinzmedia-api"
   # Save PM2 config: pm2 save
   # Setup startup: pm2 startup
   ```

4. **Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /api {
           proxy_pass http://localhost:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## Support

For questions or issues, please create an issue in the project repository or contact the development team.

## License

This project is licensed under the ISC License. 

## File Upload Guidelines

### Supported File Types

**Images (Packages & Services)**
- JPEG/JPG
- PNG
- GIF
- WebP

**Videos (Service Tutorials)**
- MP4
- WebM
- MKV
- MOV

### File Size Limits

- Package Images: 5MB
- Service Images: 5MB
- Service Tutorial Videos: 100MB

### File Storage

All uploaded files are stored in the `uploads` directory:
- Package images: `uploads/packages/`
- Service images: `uploads/services/images/`
- Service videos: `uploads/services/videos/`

Files are automatically cleaned up when:
- A package/service is deleted
- An image/video is replaced with a new one
- Upload fails during creation/update

### File Access

Uploaded files are served statically and can be accessed via:
- Package images: `/uploads/packages/package-[timestamp].ext`
- Service images: `/uploads/services/images/service-image-[timestamp].ext`
- Service videos: `/uploads/services/videos/service-tutorialVideo-[timestamp].ext` 