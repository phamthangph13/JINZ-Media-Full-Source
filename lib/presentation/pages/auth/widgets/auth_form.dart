import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mediatool/core/constants/app_colors.dart';
import 'package:mediatool/core/constants/app_text_styles.dart';

enum AuthFormType { login, register, forgotPassword }

class AuthForm extends StatefulWidget {
  const AuthForm({super.key});

  @override
  State<AuthForm> createState() => _AuthFormState();
}

class _AuthFormState extends State<AuthForm> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _nameController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  AuthFormType _formType = AuthFormType.login;
  String? _errorMessage;

  // Tài khoản đăng nhập mặc định
  static const String _defaultEmail = 'admin@jinz.com';
  static const String _defaultPassword = 'admin123';

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  void _switchForm(AuthFormType type) {
    setState(() {
      _formType = type;
      // Clear form when switching
      _formKey.currentState?.reset();
      _emailController.clear();
      _passwordController.clear();
      _confirmPasswordController.clear();
      _nameController.clear();
      _errorMessage = null;
    });
  }

  void _handleSubmit() {
    if (_formKey.currentState!.validate()) {
      switch (_formType) {
        case AuthFormType.login:
          final email = _emailController.text.trim();
          final password = _passwordController.text;

          if (email == _defaultEmail && password == _defaultPassword) {
            // Xóa thông báo lỗi nếu có
            setState(() {
              _errorMessage = null;
            });
            // Chuyển đến trang home khi đăng nhập thành công
            context.go('/home');
          } else {
            // Hiển thị thông báo lỗi
            setState(() {
              _errorMessage = 'Email hoặc mật khẩu không đúng';
            });
          }
          break;
        case AuthFormType.register:
          // TODO: Implement register logic
          break;
        case AuthFormType.forgotPassword:
          // TODO: Implement forgot password logic
          break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Title
          Text(
            _formType == AuthFormType.login
                ? 'Đăng nhập'
                : _formType == AuthFormType.register
                    ? 'Đăng ký'
                    : 'Quên mật khẩu',
            style: AppTextStyles.displayMedium.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),

          if (_errorMessage != null)
            Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: Text(
                _errorMessage!,
                style: const TextStyle(
                  color: Colors.red,
                  fontSize: 14,
                ),
                textAlign: TextAlign.center,
              ),
            ),

          // Form fields based on type
          ..._buildFormFields(),

          const SizedBox(height: 24),

          // Submit button
          ElevatedButton(
            onPressed: _handleSubmit,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0,
            ),
            child: Text(
              _formType == AuthFormType.login
                  ? 'Đăng nhập'
                  : _formType == AuthFormType.register
                      ? 'Đăng ký'
                      : 'Gửi yêu cầu',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Bottom links
          if (_formType == AuthFormType.login) ...[
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'Chưa có tài khoản? ',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: Colors.grey[600],
                  ),
                ),
                TextButton(
                  onPressed: () => _switchForm(AuthFormType.register),
                  style: TextButton.styleFrom(
                    foregroundColor: AppColors.primary,
                    padding: EdgeInsets.zero,
                  ),
                  child: Text(
                    'Đăng ký',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            TextButton(
              onPressed: () => _switchForm(AuthFormType.forgotPassword),
              style: TextButton.styleFrom(
                foregroundColor: AppColors.primary,
                padding: EdgeInsets.zero,
              ),
              child: Text(
                'Quên mật khẩu?',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.primary,
                ),
              ),
            ),
          ] else
            TextButton(
              onPressed: () => _switchForm(AuthFormType.login),
              style: TextButton.styleFrom(
                foregroundColor: AppColors.primary,
                padding: EdgeInsets.zero,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.arrow_back, size: 16),
                  const SizedBox(width: 8),
                  Text(
                    'Quay lại đăng nhập',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  List<Widget> _buildFormFields() {
    final defaultInputDecoration = (String label, String hint, IconData icon) => InputDecoration(
          labelText: label,
          hintText: hint,
          prefixIcon: Icon(icon),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey[300]!),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: Colors.grey[300]!),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: AppColors.primary),
          ),
          filled: true,
          fillColor: Colors.grey[50],
          contentPadding: const EdgeInsets.all(16),
        );

    switch (_formType) {
      case AuthFormType.login:
        return [
          TextFormField(
            controller: _emailController,
            decoration: defaultInputDecoration(
              'Email',
              'Nhập email của bạn',
              Icons.email_outlined,
            ),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Vui lòng nhập email';
              }
              if (!value.contains('@')) {
                return 'Vui lòng nhập email hợp lệ';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _passwordController,
            decoration: InputDecoration(
              labelText: 'Mật khẩu',
              hintText: 'Nhập mật khẩu của bạn',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility_off : Icons.visibility,
                ),
                onPressed: () {
                  setState(() {
                    _obscurePassword = !_obscurePassword;
                  });
                },
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: AppColors.primary),
              ),
              filled: true,
              fillColor: Colors.grey[50],
              contentPadding: const EdgeInsets.all(16),
            ),
            obscureText: _obscurePassword,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Vui lòng nhập mật khẩu';
              }
              if (value.length < 6) {
                return 'Mật khẩu phải có ít nhất 6 ký tự';
              }
              return null;
            },
          ),
        ];

      case AuthFormType.register:
        return [
          TextFormField(
            controller: _nameController,
            decoration: defaultInputDecoration(
              'Họ và tên',
              'Nhập họ và tên của bạn',
              Icons.person_outline,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Vui lòng nhập họ và tên';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _emailController,
            decoration: defaultInputDecoration(
              'Email',
              'Nhập email của bạn',
              Icons.email_outlined,
            ),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Vui lòng nhập email';
              }
              if (!value.contains('@')) {
                return 'Vui lòng nhập email hợp lệ';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _passwordController,
            decoration: InputDecoration(
              labelText: 'Mật khẩu',
              hintText: 'Nhập mật khẩu của bạn',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility_off : Icons.visibility,
                ),
                onPressed: () {
                  setState(() {
                    _obscurePassword = !_obscurePassword;
                  });
                },
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: AppColors.primary),
              ),
              filled: true,
              fillColor: Colors.grey[50],
              contentPadding: const EdgeInsets.all(16),
            ),
            obscureText: _obscurePassword,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Vui lòng nhập mật khẩu';
              }
              if (value.length < 6) {
                return 'Mật khẩu phải có ít nhất 6 ký tự';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _confirmPasswordController,
            decoration: InputDecoration(
              labelText: 'Xác nhận mật khẩu',
              hintText: 'Nhập lại mật khẩu của bạn',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscureConfirmPassword ? Icons.visibility_off : Icons.visibility,
                ),
                onPressed: () {
                  setState(() {
                    _obscureConfirmPassword = !_obscureConfirmPassword;
                  });
                },
              ),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: Colors.grey[300]!),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: AppColors.primary),
              ),
              filled: true,
              fillColor: Colors.grey[50],
              contentPadding: const EdgeInsets.all(16),
            ),
            obscureText: _obscureConfirmPassword,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Vui lòng xác nhận mật khẩu';
              }
              if (value != _passwordController.text) {
                return 'Mật khẩu xác nhận không khớp';
              }
              return null;
            },
          ),
        ];

      case AuthFormType.forgotPassword:
        return [
          TextFormField(
            controller: _emailController,
            decoration: defaultInputDecoration(
              'Email',
              'Nhập email của bạn',
              Icons.email_outlined,
            ),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Vui lòng nhập email';
              }
              if (!value.contains('@')) {
                return 'Vui lòng nhập email hợp lệ';
              }
              return null;
            },
          ),
        ];
    }
  }
} 