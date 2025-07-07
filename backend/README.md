# JINZMedia Backend API

Node.js backend API for JINZMedia application with authentication, MongoDB, and email functionality.

## Features

- **Authentication System**
  - User registration with name, email, and password
  - User login with JWT tokens
  - Password reset via email
  - Protected routes with JWT authentication
  - Password strength validation

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
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI 3.0

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── validation.js       # Input validation
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   └── User.js             # User model/schema
│   ├── routes/
│   │   └── authRoutes.js       # Authentication routes
│   └── services/
│       └── emailService.js     # Email functionality
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

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/health` | Check API status | Public |

## API Usage Examples

### 1. Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Login User

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get Current User (Protected)

```bash
GET /api/auth/me
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Forgot Password

```bash
POST /api/auth/forgotpassword
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": "Email đặt lại mật khẩu đã được gửi"
}
```

### 5. Reset Password

```bash
PUT /api/auth/resetpassword/reset_token_from_email
Content-Type: application/json

{
  "password": "NewPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đặt lại mật khẩu thành công",
  "token": "new_jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message in Vietnamese"
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

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