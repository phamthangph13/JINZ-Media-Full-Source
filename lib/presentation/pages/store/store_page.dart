import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../data/apps_data.dart';
import '../../widgets/common/top_bar.dart';
import '../../widgets/common/hero_section.dart';
import '../../widgets/common/app_card.dart';

class StorePage extends StatelessWidget {
  const StorePage({super.key});

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
            
            // Content Container
            Container(
              constraints: const BoxConstraints(maxWidth: 1500),
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
              child: Column(
                children: [
                  // Featured Hero Section
                  HeroSection(
                    title: 'Collections',
                    description: 'Khám phá bộ sưu tập ứng dụng được tuyển chọn đặc biệt',
                    style: HeroStyle.dark,
                    actionText: 'Khám phá ngay',
                    onActionTap: () {
                      // Scroll to featured apps
                    },
                    backgroundImage: Container(
                      padding: const EdgeInsets.all(20),
                      child: _buildFeaturedAppsPreview(),
                    ),
                  ),
                  
                  const SizedBox(height: 44),
                  
                  // Categories Section
                  _buildCategoriesSection(context),
                  
                  const SizedBox(height: 44),
                  
                  // All Apps Section
                  _buildAllAppsSection(context),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturedAppsPreview() {
    final featuredApps = AppsData.specialApps.take(3).toList();
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: featuredApps.map((app) {
        return Container(
          width: 80,
          height: 100,
          margin: const EdgeInsets.only(left: 12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                offset: const Offset(0, 2),
                blurRadius: 8,
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                app.icon,
                style: const TextStyle(fontSize: 24),
              ),
              const SizedBox(height: 8),
              Text(
                app.title,
                style: AppTextStyles.bodySmall.copyWith(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCategoriesSection(BuildContext context) {
    final categories = AppsData.categories;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Text(
            'Danh mục',
            style: AppTextStyles.headingMedium,
          ),
        ),
        const SizedBox(height: 20),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final category = categories[index];
              return _buildCategoryCard(context, category);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryCard(BuildContext context, category) {
    final colors = [
      const Color(0xFF667eea),
      const Color(0xFF764ba2),
      const Color(0xFF36d1dc),
      const Color(0xFF5b86e5),
    ];
    
    final color = colors[category.id.hashCode % colors.length];
    
    return GestureDetector(
      onTap: () {
        _showCategoryApps(context, category);
      },
      child: Container(
        width: 280,
        margin: const EdgeInsets.only(right: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [color, color.withOpacity(0.7)],
          ),
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: color.withOpacity(0.3),
              offset: const Offset(0, 4),
              blurRadius: 16,
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                category.icon,
                style: const TextStyle(fontSize: 40),
              ),
              const SizedBox(height: 16),
              Text(
                category.name,
                style: AppTextStyles.headingSmall.copyWith(
                  color: AppColors.textOnDark,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                category.description,
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textOnDark.withOpacity(0.9),
                ),
              ),
              const Spacer(),
              Row(
                children: [
                  Text(
                    '${category.apps.length} ứng dụng',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textOnDark.withOpacity(0.8),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.textOnDark.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      Icons.arrow_forward,
                      color: AppColors.textOnDark,
                      size: 16,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAllAppsSection(BuildContext context) {
    final allApps = [
      ...AppsData.utilityApps,
      ...AppsData.specialApps,
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Tất cả ứng dụng',
                style: AppTextStyles.headingMedium,
              ),
              _buildFilterButton(),
            ],
          ),
        ),
        const SizedBox(height: 20),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: _buildAppsGrid(context, allApps),
        ),
      ],
    );
  }

  Widget _buildFilterButton() {
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 8, 24, 8),
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(22),
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
            Icons.filter_list,
            size: 20,
            color: AppColors.textPrimary,
          ),
          const SizedBox(width: 4),
          Text(
            'Lọc',
            style: AppTextStyles.buttonMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildAppsGrid(BuildContext context, List apps) {
    return LayoutBuilder(
      builder: (context, constraints) {
        int crossAxisCount;
        if (constraints.maxWidth > 1200) {
          crossAxisCount = 5;
        } else if (constraints.maxWidth > 900) {
          crossAxisCount = 4;
        } else if (constraints.maxWidth > 600) {
          crossAxisCount = 3;
        } else {
          crossAxisCount = 2;
        }
        
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            childAspectRatio: 0.75,
            crossAxisSpacing: 16,
            mainAxisSpacing: 20,
          ),
          itemCount: apps.length,
          itemBuilder: (context, index) {
            return AppCard(
              app: apps[index],
              style: CardStyle.detailed,
              onTap: () {
                _showAppStore(context, apps[index]);
              },
            );
          },
        );
      },
    );
  }

  void _showCategoryApps(BuildContext context, category) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.8,
        decoration: const BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            // Handle bar
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 20),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: [
                  Text(
                    category.icon,
                    style: const TextStyle(fontSize: 32),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          category.name,
                          style: AppTextStyles.headingSmall,
                        ),
                        Text(
                          category.description,
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Apps list
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                itemCount: category.apps.length,
                itemBuilder: (context, index) {
                  final app = category.apps[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF6F6FA),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Center(
                            child: Text(
                              app.icon,
                              style: const TextStyle(fontSize: 24),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                app.title,
                                style: AppTextStyles.cardTitle,
                              ),
                              Text(
                                app.description,
                                style: AppTextStyles.bodySmall.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
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
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showAppStore(BuildContext context, app) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Mở store cho ${app.title}'),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }
} 