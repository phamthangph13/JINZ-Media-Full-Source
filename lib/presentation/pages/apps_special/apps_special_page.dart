import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../data/apps_data.dart';
import '../../widgets/common/top_bar.dart';
import '../../widgets/common/app_card.dart';

class AppsSpecialPage extends StatelessWidget {
  const AppsSpecialPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // Animated App Bar
          SliverAppBar(
            floating: true,
            snap: true,
            backgroundColor: AppColors.background,
            leading: IconButton(
              onPressed: () => context.pop(),
              icon: Icon(
                Icons.arrow_back_ios_new_rounded,
                color: AppColors.textPrimary,
              ),
            ),
            title: const TopBar(),
            elevation: 0,
          ),

          // Main Content
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            sliver: SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Animated Page Title
                  TweenAnimationBuilder<double>(
                    duration: const Duration(milliseconds: 600),
                    tween: Tween<double>(begin: 0, end: 1),
                    builder: (context, opacity, child) {
                      return Opacity(
                        opacity: opacity,
                        child: Transform.translate(
                          offset: Offset(0, 20 * (1 - opacity)),
                          child: child,
                        ),
                      );
                    },
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Apps Specials',
                          style: AppTextStyles.headingLarge.copyWith(
                            fontSize: 48,
                            fontWeight: FontWeight.w900,
                            letterSpacing: -1.5,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Những ứng dụng đặc sắc, nổi bật và hữu ích nhất',
                          style: AppTextStyles.bodyLarge.copyWith(
                            color: AppColors.textSecondary,
                            fontSize: 18,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),

          // Apps Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            sliver: _buildAnimatedAppsGrid(context),
          ),
        ],
      ),
    );
  }

  Widget _buildAnimatedAppsGrid(BuildContext context) {
    final apps = AppsData.specialApps;
    
    return SliverLayoutBuilder(
      builder: (context, constraints) {
        int crossAxisCount;
        if (constraints.crossAxisExtent > 1400) {
          crossAxisCount = 6;
        } else if (constraints.crossAxisExtent > 1050) {
          crossAxisCount = 4;
        } else if (constraints.crossAxisExtent > 700) {
          crossAxisCount = 2;
        } else {
          crossAxisCount = 1;
        }
        
        return SliverGrid(
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            childAspectRatio: _getChildAspectRatio(constraints.crossAxisExtent),
            crossAxisSpacing: 24,
            mainAxisSpacing: 32,
          ),
          delegate: SliverChildBuilderDelegate(
            (context, index) {
              return TweenAnimationBuilder<double>(
                duration: Duration(milliseconds: 500 + (index * 100)),
                tween: Tween<double>(begin: 0, end: 1),
                builder: (context, opacity, child) {
                  return Opacity(
                    opacity: opacity,
                    child: Transform.translate(
                      offset: Offset(0, 50 * (1 - opacity)),
                      child: child,
                    ),
                  );
                },
                child: AppCard(
                  app: apps[index],
                  style: CardStyle.featured,
                  onTap: () {
                    _showAppActions(context, apps[index]);
                  },
                ),
              );
            },
            childCount: apps.length,
          ),
        );
      },
    );
  }

  double _getChildAspectRatio(double screenWidth) {
    if (screenWidth > 1400) {
      return 0.7; // 6 columns
    } else if (screenWidth > 1050) {
      return 0.75; // 4 columns
    } else if (screenWidth > 700) {
      return 0.8; // 2 columns
    } else {
      return 1.0; // 1 column
    }
  }

  void _showAppActions(BuildContext context, app) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 48,
              offset: const Offset(0, -10),
              spreadRadius: -10,
            ),
          ],
        ),
        padding: const EdgeInsets.fromLTRB(24, 16, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle bar
            Container(
              width: 48,
              height: 6,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(3),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // App info
            Row(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppColors.primary.withOpacity(0.1),
                        AppColors.secondary.withOpacity(0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppColors.primary.withOpacity(0.2),
                      width: 1.5,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      app.icon,
                      style: TextStyle(
                        fontSize: 40,
                        color: AppColors.primary,
                        shadows: [
                          Shadow(
                            color: AppColors.primary.withOpacity(0.2),
                            offset: const Offset(0, 2),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        app.title,
                        style: AppTextStyles.headingSmall.copyWith(
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        app.description,
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.5,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          if (app.isOnSale) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.warning.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                'SALE',
                                style: AppTextStyles.badge.copyWith(
                                  fontSize: 12,
                                  color: AppColors.warning,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            if (app.originalPrice != null)
                              Text(
                                '${app.originalPrice!.toStringAsFixed(0)} đ',
                                style: AppTextStyles.bodySmall.copyWith(
                                  decoration: TextDecoration.lineThrough,
                                  color: AppColors.textLight,
                                ),
                              ),
                          ],
                          const Spacer(),
                          Text(
                            app.priceText,
                            style: AppTextStyles.price.copyWith(
                              color: app.isFree ? AppColors.success : AppColors.primary,
                              fontWeight: FontWeight.w900,
                              fontSize: 18,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            
            const SizedBox(height: 32),
            
            // Action buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      _showAppDetails(context, app);
                    },
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(
                        color: AppColors.border,
                        width: 1.5,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text(
                      'Chi tiết',
                      style: AppTextStyles.buttonMedium.copyWith(
                        color: AppColors.textPrimary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      _purchaseApp(context, app);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 6,
                      shadowColor: AppColors.primary.withOpacity(0.4),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text(
                      app.isFree ? 'Tải về' : 'Mua ngay',
                      style: AppTextStyles.buttonLarge.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _showAppDetails(BuildContext context, app) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(32),
        ),
        contentPadding: const EdgeInsets.all(24),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppColors.primary.withOpacity(0.1),
                        AppColors.secondary.withOpacity(0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppColors.primary.withOpacity(0.2),
                      width: 1.5,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      app.icon,
                      style: TextStyle(
                        fontSize: 40,
                        color: AppColors.primary,
                        shadows: [
                          Shadow(
                            color: AppColors.primary.withOpacity(0.2),
                            offset: const Offset(0, 2),
                            blurRadius: 4,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        app.title,
                        style: AppTextStyles.headingSmall.copyWith(
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        app.category,
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              'Mô tả',
              style: AppTextStyles.headingSmall.copyWith(
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              app.description,
              style: AppTextStyles.bodyLarge.copyWith(
                color: AppColors.textPrimary,
                height: 1.6,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: app.isFree 
                      ? AppColors.success.withOpacity(0.1) 
                      : AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Text(
                    app.priceText,
                    style: AppTextStyles.price.copyWith(
                      color: app.isFree ? AppColors.success : AppColors.primary,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
                if (app.isOnSale)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.warning.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      'SALE',
                      style: AppTextStyles.badge.copyWith(
                        color: AppColors.warning,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
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
              style: AppTextStyles.buttonMedium.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _purchaseApp(context, app);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              elevation: 6,
              shadowColor: AppColors.primary.withOpacity(0.4),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: Text(
              app.isFree ? 'Tải về' : 'Mua ngay',
              style: AppTextStyles.buttonLarge.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _purchaseApp(BuildContext context, app) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'Đã ${app.isFree ? 'tải' : 'mua'} ${app.title}',
          style: AppTextStyles.bodyLarge.copyWith(
            color: Colors.white,
          ),
        ),
        backgroundColor: AppColors.success,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        margin: const EdgeInsets.all(16),
      ),
    );
  }
} 