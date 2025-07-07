import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../data/apps_data.dart';
import '../../widgets/common/top_bar.dart';
import '../../widgets/common/hero_section.dart';
import '../../widgets/common/app_card.dart';

class UtilityAppsPage extends StatelessWidget {
  const UtilityAppsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Top Bar with back button
            Row(
              children: [
                IconButton(
                  onPressed: () => context.pop(),
                  icon: const Icon(Icons.arrow_back),
                ),
                const Expanded(child: TopBar()),
              ],
            ),
            
            // Hero Section
            HeroSection(
              title: 'Utility apps',
              description: 'Check out these top apps to get the most out of your device',
              style: HeroStyle.gradient,
            ),
            
            // Apps Grid Section
            Container(
              transform: Matrix4.translationValues(0, -48, 0),
              child: Container(
                constraints: const BoxConstraints(maxWidth: 1500),
                padding: const EdgeInsets.fromLTRB(28, 0, 28, 36),
                child: Column(
                  children: [
                    _buildAppsGrid(context),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAppsGrid(BuildContext context) {
    final apps = AppsData.utilityApps;
    
    return LayoutBuilder(
      builder: (context, constraints) {
        int crossAxisCount;
        if (constraints.maxWidth > 1350) {
          crossAxisCount = 6;
        } else if (constraints.maxWidth > 900) {
          crossAxisCount = 4;
        } else if (constraints.maxWidth > 600) {
          crossAxisCount = 2;
        } else {
          crossAxisCount = 1;
        }
        
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            childAspectRatio: _getChildAspectRatio(constraints.maxWidth),
            crossAxisSpacing: 26,
            mainAxisSpacing: 30,
          ),
          itemCount: apps.length,
          itemBuilder: (context, index) {
            return AppCard(
              app: apps[index],
              style: CardStyle.compact,
              onTap: () {
                _showAppDetails(context, apps[index]);
              },
            );
          },
        );
      },
    );
  }

  double _getChildAspectRatio(double screenWidth) {
    if (screenWidth > 1350) {
      return 0.8; // 6 columns
    } else if (screenWidth > 900) {
      return 0.75; // 4 columns
    } else if (screenWidth > 600) {
      return 0.7; // 2 columns
    } else {
      return 1.2; // 1 column
    }
  }

  void _showAppDetails(BuildContext context, app) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        title: Row(
          children: [
            Text(
              app.icon,
              style: const TextStyle(fontSize: 32),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                app.title,
                style: AppTextStyles.headingSmall,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              app.description,
              style: AppTextStyles.bodyLarge,
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Text(
                  'Giá: ',
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  app.priceText,
                  style: AppTextStyles.price.copyWith(
                    color: app.isFree ? AppColors.success : AppColors.primary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Text(
                  'Loại: ',
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  app.category,
                  style: AppTextStyles.bodyMedium,
                ),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text(
              'Đóng',
              style: AppTextStyles.buttonMedium,
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(app.isFree ? 'Đang sử dụng ${app.title}' : 'Đã mua ${app.title}'),
                  backgroundColor: app.isFree ? AppColors.primary : AppColors.success,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: app.isFree ? AppColors.primary : AppColors.success,
              foregroundColor: AppColors.textOnDark,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            child: Text(
              app.isFree ? 'Sử dụng' : 'Mua ngay',
              style: AppTextStyles.buttonMedium.copyWith(
                color: AppColors.textOnDark,
              ),
            ),
          ),
        ],
      ),
    );
  }
} 