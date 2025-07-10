const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      success: false,
      error: errorMessages[0] // Return first error message
    });
  }
  next();
};

// Validation rules for user registration
const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Vui lòng nhập họ và tên')
    .isLength({ min: 2, max: 50 })
    .withMessage('Họ và tên phải có từ 2 đến 50 ký tự')
    .trim(),
  
  body('email')
    .isEmail()
    .withMessage('Vui lòng nhập địa chỉ email hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số'),
  
  handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Vui lòng nhập địa chỉ email hợp lệ')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Vui lòng nhập mật khẩu'),
  
  handleValidationErrors
];

// Validation rules for forgot password
const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Vui lòng nhập địa chỉ email hợp lệ')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Validation rules for reset password
const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số'),
  
  handleValidationErrors
];

// Validation rules for update password
const validateUpdatePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Vui lòng nhập mật khẩu hiện tại'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu mới phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Mật khẩu mới phải chứa ít nhất 1 chữ thường, 1 chữ hoa và 1 số'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword,
  handleValidationErrors,
  validateRequest: handleValidationErrors
}; 