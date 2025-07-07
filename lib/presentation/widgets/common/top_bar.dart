import 'package:flutter/material.dart';
import 'package:mediatool/presentation/widgets/common/user_profile_modal.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';

class TopBar extends StatefulWidget {
  final VoidCallback? onNotificationTap;
  final String? selectedLanguage;
  final Function(String)? onLanguageChanged;

  const TopBar({
    super.key,
    this.onNotificationTap,
    this.selectedLanguage = 'VI',
    this.onLanguageChanged,
  });

  @override
  State<TopBar> createState() => _TopBarState();
}

class _TopBarState extends State<TopBar> {
  bool _isDarkMode = false;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
      child: Row(
        children: [
          // Logo section
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.apps,
                  color: AppColors.textOnDark,
                  size: 24,
                ),
              ),
              const SizedBox(width: 13),
              Text(
                'Media Tool',
                style: AppTextStyles.headingMedium.copyWith(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const Spacer(),
          // Action buttons
          Row(
            children: [
              // Settings button
              _buildSettingsButton(),
              const SizedBox(width: 14),
              // Language selector
              _buildLanguageSelector(),
              const SizedBox(width: 14),
              // Notification button
              _buildNotificationButton(),
              const SizedBox(width: 3),
              // Avatar
              GestureDetector(
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return const UserProfileModal();
                    },
                  );
                },
                child: const Icon(
                  Icons.account_circle,
                  size: 36,
                  color: Color(0xFFBBBBBB),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSettingsButton() {
    return PopupMenuButton<int>(
      offset: const Offset(0, 8),
      position: PopupMenuPosition.under,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 4,
      color: AppColors.surface,
      onSelected: (item) => _handleMenuSelection(item),
      itemBuilder: (context) => [
        PopupMenuItem<int>(
          value: 1,
          padding: EdgeInsets.zero,
          child: Container(
            width: 280,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: StatefulBuilder(
              builder: (BuildContext context, StateSetter setState) {
                return Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.dark_mode_outlined,
                          size: 20,
                          color: AppColors.textPrimary,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'Giao diện tối',
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textPrimary,
                          ),
                        ),
                      ],
                    ),
                    Switch(
                      value: _isDarkMode,
                      activeColor: AppColors.primary,
                      onChanged: (value) {
                        setState(() {
                          _isDarkMode = value;
                          // Logic to change theme will go here
                        });
                      },
                    ),
                  ],
                );
              },
            ),
          ),
        ),
        PopupMenuItem<int>(
          height: 1,
          enabled: false,
          padding: EdgeInsets.zero,
          child: Divider(
            height: 1,
            color: AppColors.border.withOpacity(0.5),
          ),
        ),
        PopupMenuItem<int>(
          value: 2,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: SizedBox(
            width: 280,
            child: Row(
              children: [
                const Icon(
                  Icons.logout_outlined,
                  size: 20,
                  color: Color(0xFFFF4D4F),
                ),
                const SizedBox(width: 12),
                Text(
                  'Đăng xuất',
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: const Color(0xFFFF4D4F),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
      child: _buildActionButton(
        icon: Icons.settings,
        label: 'Cài đặt',
      ),
    );
  }

  void _handleMenuSelection(int item) {
    switch (item) {
      case 1:
        // Handled by StatefulBuilder in PopupMenuItem
        break;
      case 2:
        // Handle logout
        break;
    }
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.fromLTRB(14, 7, 20, 7),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            offset: const Offset(0, 1),
            blurRadius: 2,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 18,
            color: AppColors.textPrimary,
          ),
          const SizedBox(width: 7),
          Text(
            label,
            style: AppTextStyles.buttonMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageSelector() {
    return Container(
      padding: const EdgeInsets.fromLTRB(12, 7, 12, 7),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            offset: const Offset(0, 1),
            blurRadius: 2,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(
            Icons.language,
            size: 18,
            color: AppColors.textPrimary,
          ),
          const SizedBox(width: 6),
          DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: widget.selectedLanguage,
              isDense: true,
              style: AppTextStyles.buttonMedium,
              items: const [
                DropdownMenuItem(value: 'VI', child: Text('VI')),
                DropdownMenuItem(value: 'EN', child: Text('EN')),
              ],
              onChanged: (value) {
                if (value != null && widget.onLanguageChanged != null) {
                  widget.onLanguageChanged!(value);
                }
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationButton() {
    return GestureDetector(
      onTap: widget.onNotificationTap,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: AppColors.surface,
          border: Border.all(color: AppColors.border),
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.notifications_none,
          size: 20,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }
} 