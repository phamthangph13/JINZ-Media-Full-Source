import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../data/apps_data.dart';
import '../../widgets/common/top_bar.dart';
import '../../widgets/common/hero_section.dart';
import '../../widgets/common/app_card.dart';
import '../../widgets/common/hero_slider.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Bar
            const TopBar(),
            
            // Main Title
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(
                'Dịch vụ nổi bật',
                style: AppTextStyles.displayMedium.copyWith(
                  fontSize: 40,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Featured Hero Section with Slider
            const HeroSlider(),
            
            const SizedBox(height: 36),
            
            // Quick Actions Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Tiện ích nhanh',
                        style: AppTextStyles.headingMedium,
                      ),
                      TextButton(
                        onPressed: () => context.push('/utility-apps'),
                        child: Text(
                          'Xem tất cả',
                          style: AppTextStyles.buttonMedium.copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  _buildQuickActionsGrid(),
                ],
              ),
            ),
            
            const SizedBox(height: 36),
            
            // Collections Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Bộ sưu tập',
                        style: AppTextStyles.headingMedium,
                      ),
                      TextButton(
                        onPressed: () => context.push('/store'),
                        child: Text(
                          'Xem store',
                          style: AppTextStyles.buttonMedium.copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  _buildCollectionsRow(),
                ],
              ),
            ),
            
            const SizedBox(height: 36),
            
            // Special Apps Section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Apps đặc biệt',
                        style: AppTextStyles.headingMedium,
                      ),
                      TextButton(
                        onPressed: () => context.push('/apps-special'),
                        child: Text(
                          'Xem tất cả',
                          style: AppTextStyles.buttonMedium.copyWith(
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  _buildSpecialAppsGrid(),
                ],
              ),
            ),
            
            const SizedBox(height: 48),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionsGrid() {
    final featuredApps = AppsData.utilityApps.where((app) => app.isFeatured).take(4).toList();
    
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 800 ? 4 : 2;
        final childAspectRatio = constraints.maxWidth > 800 ? 1.0 : 0.85;
        
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: crossAxisCount,
              childAspectRatio: childAspectRatio,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: featuredApps.length,
            itemBuilder: (context, index) {
              return AppCard(
                app: featuredApps[index],
                style: CardStyle.compact,
                onTap: () {
                  // Handle app tap
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Mở ${featuredApps[index].title}'),
                      duration: const Duration(seconds: 1),
                    ),
                  );
                },
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildCollectionsRow() {
    final collections = [
      {
        'title': 'Video Editing',
        'description': 'Bộ công cụ chỉnh sửa video',
        'icon': '🎬',
        'color': const Color(0xFF667eea),
      },
      {
        'title': 'Audio Tools',
        'description': 'Xử lý âm thanh chuyên nghiệp',
        'icon': '🎵',
        'color': const Color(0xFF764ba2),
      },
      {
        'title': 'AI Tools',
        'description': 'Công cụ AI thông minh',
        'icon': '🤖',
        'color': const Color(0xFF36d1dc),
      },
    ];

    return SizedBox(
      height: 160,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: collections.length,
        itemBuilder: (context, index) {
          final collection = collections[index];
          return Container(
            width: 280,
            margin: EdgeInsets.only(right: index < collections.length - 1 ? 16 : 0),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  collection['color'] as Color,
                  (collection['color'] as Color).withOpacity(0.7),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    collection['icon'] as String,
                    style: const TextStyle(fontSize: 32),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    collection['title'] as String,
                    style: AppTextStyles.headingSmall.copyWith(
                      color: AppColors.textOnDark,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    collection['description'] as String,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textOnDark.withOpacity(0.9),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSpecialAppsGrid() {
    final specialApps = AppsData.specialApps.take(3).toList();
    
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 900 ? 3 : 1;
        final childAspectRatio = constraints.maxWidth > 900 ? 0.9 : 1.1;
        
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: crossAxisCount,
              childAspectRatio: childAspectRatio,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: specialApps.length,
            itemBuilder: (context, index) {
              return AppCard(
                app: specialApps[index],
                style: CardStyle.detailed,
                onTap: () {
                  context.push('/apps-special');
                },
              );
            },
          ),
        );
      },
    );
  }
} 