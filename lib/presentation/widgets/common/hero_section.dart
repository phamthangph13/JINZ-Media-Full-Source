import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';

class HeroSection extends StatelessWidget {
  final String title;
  final String description;
  final Widget? backgroundImage;
  final VoidCallback? onActionTap;
  final String? actionText;
  final HeroStyle style;

  const HeroSection({
    super.key,
    required this.title,
    required this.description,
    this.backgroundImage,
    this.onActionTap,
    this.actionText,
    this.style = HeroStyle.gradient,
  });

  @override
  Widget build(BuildContext context) {
    switch (style) {
      case HeroStyle.gradient:
        return _buildGradientHero();
      case HeroStyle.dark:
        return _buildDarkHero();
      case HeroStyle.featured:
        return _buildFeaturedHero();
    }
  }

  Widget _buildGradientHero() {
    return Container(
      height: 320,
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment(0, 0.4),
          radius: 1.2,
          colors: [Color(0xFFDEC4BE), Color(0xFFFFFFFF)],
          stops: [0.44, 0.95],
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            left: 32,
            top: 0,
            bottom: 0,
            child: Container(
              constraints: const BoxConstraints(maxWidth: 620),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTextStyles.displayLarge.copyWith(
                      color: AppColors.textOnDark,
                      fontSize: 48,
                      fontWeight: FontWeight.w800,
                      shadows: [
                        Shadow(
                          color: Colors.black.withOpacity(0.22),
                          offset: const Offset(0, 3),
                          blurRadius: 18,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),
                  Text(
                    description,
                    style: AppTextStyles.bodyLarge.copyWith(
                      color: const Color(0xFFF3F3F7),
                      fontSize: 20,
                      shadows: [
                        Shadow(
                          color: Colors.black.withOpacity(0.17),
                          offset: const Offset(0, 2),
                          blurRadius: 12,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDarkHero() {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 24),
      decoration: BoxDecoration(
        gradient: AppColors.darkGradient,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.10),
            offset: const Offset(0, 2),
            blurRadius: 24,
          ),
        ],
      ),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 38),
        child: Row(
          children: [
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.only(left: 54),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTextStyles.headingLarge.copyWith(
                        color: AppColors.textOnDark,
                        fontSize: 36,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      description,
                      style: AppTextStyles.bodyLarge.copyWith(
                        color: const Color(0xFFE2E2E2),
                        fontSize: 18,
                      ),
                    ),
                    if (actionText != null && onActionTap != null) ...[
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: onActionTap,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1B1919),
                          foregroundColor: AppColors.textOnDark,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 36,
                            vertical: 10,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Text(
                          actionText!,
                          style: AppTextStyles.buttonLarge,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
            if (backgroundImage != null)
              Expanded(
                flex: 3,
                child: backgroundImage!,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturedHero() {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Determine if we're on a wide screen (desktop)
        bool isWideScreen = constraints.maxWidth > 1200;
        
        return Container(
          margin: const EdgeInsets.symmetric(vertical: 34, horizontal: 24),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(32),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppColors.primary.withOpacity(0.1),
                AppColors.secondary.withOpacity(0.05),
              ],
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.05),
                offset: const Offset(0, 10),
                blurRadius: 30,
                spreadRadius: -5,
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(32),
            child: isWideScreen 
              ? _buildWideScreenLayout() 
              : _buildMobileLayout(),
          ),
        );
      },
    );
  }

  Widget _buildWideScreenLayout() {
    return Row(
      children: [
        Expanded(
          flex: 3,
          child: _buildHeroContent(
            titleStyle: AppTextStyles.headingLarge.copyWith(
              color: AppColors.textPrimary,
              fontSize: 48,
              fontWeight: FontWeight.w900,
              letterSpacing: -1.5,
            ),
            descriptionStyle: AppTextStyles.bodyLarge.copyWith(
              color: AppColors.textPrimary.withOpacity(0.8),
              fontSize: 20,
              height: 1.6,
            ),
          ),
        ),
        Expanded(
          flex: 4,
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(32),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.1),
                  offset: const Offset(0, 15),
                  blurRadius: 45,
                  spreadRadius: -10,
                ),
              ],
            ),
            margin: const EdgeInsets.all(24),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(32),
              child: backgroundImage ?? Container(
                color: AppColors.surface,
                child: Center(
                  child: Text(
                    'Hình ảnh minh họa',
                    style: AppTextStyles.bodyLarge.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          height: 320,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(32),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                offset: const Offset(0, 15),
                blurRadius: 45,
                spreadRadius: -10,
              ),
            ],
          ),
          margin: const EdgeInsets.all(16),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(32),
            child: backgroundImage ?? Container(
              color: AppColors.surface,
              child: Center(
                child: Text(
                  'Hình ảnh minh họa',
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: _buildHeroContent(
            titleStyle: AppTextStyles.headingLarge.copyWith(
              color: AppColors.textPrimary,
              fontSize: 36,
              fontWeight: FontWeight.w900,
              letterSpacing: -1,
            ),
            descriptionStyle: AppTextStyles.bodyLarge.copyWith(
              color: AppColors.textPrimary.withOpacity(0.8),
              fontSize: 18,
              height: 1.6,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildHeroContent({
    required TextStyle titleStyle, 
    required TextStyle descriptionStyle,
  }) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(18, 8, 23, 8),
            decoration: BoxDecoration(
              color: AppColors.secondary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              'ĐẶC SẮC',
              style: AppTextStyles.badge.copyWith(
                color: AppColors.secondary,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(height: 22),
          Text(
            title,
            style: titleStyle,
          ),
          const SizedBox(height: 17),
          Text(
            description,
            style: descriptionStyle,
          ),
          if (actionText != null && onActionTap != null) ...[
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: onActionTap,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 36,
                  vertical: 16,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                elevation: 6,
                shadowColor: AppColors.primary.withOpacity(0.4),
              ),
              child: Text(
                actionText!,
                style: AppTextStyles.buttonLarge.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

enum HeroStyle { gradient, dark, featured } 