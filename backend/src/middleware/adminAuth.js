const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - check if user is authenticated
exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check if token exists in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Không có quyền truy cập, vui lòng đăng nhập'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Không tìm thấy người dùng với token này'
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Tài khoản đã bị vô hiệu hóa'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token không hợp lệ'
    });
  }
};

// Check if user has admin role
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Chỉ admin mới có quyền truy cập'
    });
  }
};

// Combine protect and adminOnly middlewares
exports.adminAuth = [exports.protect, exports.adminOnly];

// Role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Vui lòng đăng nhập trước'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Vai trò ${req.user.role} không có quyền truy cập`
      });
    }

    next();
  };
}; 