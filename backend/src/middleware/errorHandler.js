const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Tài nguyên không tìm thấy';
    error = {
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Email đã được sử dụng';
    error = {
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token không hợp lệ';
    error = {
      message,
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token đã hết hạn';
    error = {
      message,
      statusCode: 401
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Lỗi server'
  });
};

module.exports = errorHandler; 