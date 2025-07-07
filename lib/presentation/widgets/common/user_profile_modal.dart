import 'package:flutter/material.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';

enum ProfileMenu { information, subscription, changePassword }

class UserProfileModal extends StatefulWidget {
  const UserProfileModal({super.key});

  @override
  State<UserProfileModal> createState() => _UserProfileModalState();
}

class _UserProfileModalState extends State<UserProfileModal> {
  ProfileMenu _selectedMenu = ProfileMenu.information;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(16),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 800, maxHeight: 600),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: Scaffold(
                body: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSideBar(),
                    Expanded(child: _buildContent()),
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            top: -5,
            right: -5,
            child: Material(
              color: Colors.transparent,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.08),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: InkWell(
                  onTap: () => Navigator.of(context).pop(),
                  customBorder: const CircleBorder(),
                  hoverColor: const Color(0xFFFF4D4F).withOpacity(0.08),
                  child: Padding(
                    padding: const EdgeInsets.all(4),
                    child: Icon(
                      Icons.close,
                      size: 16,
                      color: const Color(0xFFFF4D4F),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSideBar() {
    return Container(
      width: 250,
      padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
      color: AppColors.surface,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 16.0, bottom: 24),
            child: Text(
              'Tài khoản',
              style: AppTextStyles.headingMedium.copyWith(fontSize: 20),
            ),
          ),
          _buildMenuButton(
            icon: Icons.person_outline,
            label: 'Thông tin',
            menu: ProfileMenu.information,
          ),
          const SizedBox(height: 8),
          _buildMenuButton(
            icon: Icons.card_membership_outlined,
            label: 'Gói sử dụng',
            menu: ProfileMenu.subscription,
          ),
          const SizedBox(height: 8),
          _buildMenuButton(
            icon: Icons.lock_outline,
            label: 'Đổi mật khẩu',
            menu: ProfileMenu.changePassword,
          ),
        ],
      ),
    );
  }

  Widget _buildMenuButton({
    required IconData icon,
    required String label,
    required ProfileMenu menu,
  }) {
    final isSelected = _selectedMenu == menu;
    return Material(
      color: isSelected ? AppColors.primary.withOpacity(0.1) : Colors.transparent,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: () => setState(() => _selectedMenu = menu),
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              Icon(
                icon,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
                size: 22,
              ),
              const SizedBox(width: 16),
              Text(
                label,
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: isSelected ? AppColors.primary : AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    return Container(
      color: AppColors.background,
      padding: const EdgeInsets.all(32),
      child: _getContentWidget(),
    );
  }

  Widget _getContentWidget() {
    switch (_selectedMenu) {
      case ProfileMenu.information:
        return const _InformationContent();
      case ProfileMenu.subscription:
        return const _SubscriptionContent();
      case ProfileMenu.changePassword:
        return const _ChangePasswordContent();
    }
  }
}

class _InformationContent extends StatelessWidget {
  const _InformationContent();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Thông tin cá nhân',
          style: AppTextStyles.headingMedium.copyWith(fontSize: 24),
        ),
        const SizedBox(height: 32),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            children: [
              _buildInfoRow(
                'Họ và tên',
                'Nguyễn Văn A',
                Icons.person_outline,
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Divider(),
              ),
              _buildInfoRow(
                'Email',
                'nguyenvana@example.com',
                Icons.email_outlined,
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Divider(),
              ),
              _buildInfoRow(
                'Số điện thoại',
                '+84 123 456 789',
                Icons.phone_outlined,
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Divider(),
              ),
              _buildInfoRow(
                'Chức vụ',
                'Quản lý',
                Icons.work_outline,
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Divider(),
              ),
              _buildInfoRow(
                'Công ty',
                'JINZ Media',
                Icons.business_outlined,
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            elevation: 0,
          ),
          child: Text(
            'Cập nhật thông tin',
            style: AppTextStyles.buttonMedium.copyWith(color: Colors.white),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: AppColors.primary,
            size: 20,
          ),
        ),
        const SizedBox(width: 16),
        SizedBox(
          width: 120,
          child: Text(
            label,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Text(
            value,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}

class _SubscriptionContent extends StatelessWidget {
  const _SubscriptionContent();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Gói sử dụng',
          style: AppTextStyles.headingMedium.copyWith(fontSize: 24),
        ),
        const SizedBox(height: 32),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.star,
                          color: Colors.white,
                          size: 16,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Premium',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFF52C41A).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.check_circle,
                          color: Color(0xFF52C41A),
                          size: 16,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Đang hoạt động',
                          style: AppTextStyles.bodySmall.copyWith(
                            color: const Color(0xFF52C41A),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              _buildSubscriptionDetail(
                'Ngày bắt đầu',
                '01/01/2024',
                Icons.calendar_today_outlined,
              ),
              const SizedBox(height: 16),
              _buildSubscriptionDetail(
                'Ngày kết thúc',
                '31/12/2024',
                Icons.event_outlined,
              ),
              const SizedBox(height: 16),
              _buildSubscriptionDetail(
                'Số người dùng',
                '10 người',
                Icons.group_outlined,
              ),
              const SizedBox(height: 16),
              _buildSubscriptionDetail(
                'Dung lượng',
                '100GB',
                Icons.storage_outlined,
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
            ),
            elevation: 0,
          ),
          child: Text(
            'Nâng cấp gói',
            style: AppTextStyles.buttonMedium.copyWith(color: Colors.white),
          ),
        ),
      ],
    );
  }

  Widget _buildSubscriptionDetail(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.border.withOpacity(0.5),
        ),
      ),
      child: Row(
        children: [
          Icon(
            icon,
            color: AppColors.primary,
            size: 20,
          ),
          const SizedBox(width: 16),
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Text(
            value,
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _ChangePasswordContent extends StatelessWidget {
  const _ChangePasswordContent();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Đổi mật khẩu',
          style: AppTextStyles.headingMedium.copyWith(fontSize: 24),
        ),
        const SizedBox(height: 32),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildPasswordField(
                'Mật khẩu hiện tại',
                'Nhập mật khẩu hiện tại',
                Icons.lock_outline,
              ),
              const SizedBox(height: 24),
              _buildPasswordField(
                'Mật khẩu mới',
                'Nhập mật khẩu mới',
                Icons.lock_outline,
              ),
              const SizedBox(height: 24),
              _buildPasswordField(
                'Xác nhận mật khẩu',
                'Nhập lại mật khẩu mới',
                Icons.lock_outline,
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        Row(
          children: [
            ElevatedButton(
              onPressed: () {},
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                elevation: 0,
              ),
              child: Text(
                'Cập nhật mật khẩu',
                style: AppTextStyles.buttonMedium.copyWith(color: Colors.white),
              ),
            ),
            const SizedBox(width: 16),
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              style: TextButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
              child: Text(
                'Hủy',
                style: AppTextStyles.buttonMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPasswordField(String label, String hint, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          obscureText: true,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSecondary,
            ),
            prefixIcon: Icon(
              icon,
              color: AppColors.textSecondary,
              size: 20,
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: AppColors.primary),
            ),
            filled: true,
            fillColor: AppColors.surface,
          ),
        ),
      ],
    );
  }
} 