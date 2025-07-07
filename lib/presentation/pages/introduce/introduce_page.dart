import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lottie/lottie.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../models/onboarding_model.dart';

class IntroducePage extends StatefulWidget {
  const IntroducePage({super.key});

  @override
  State<IntroducePage> createState() => _IntroducePageState();
}

class _IntroducePageState extends State<IntroducePage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: onboardingData.length,
                onPageChanged: (index) {
                  setState(() {
                    _currentPage = index;
                  });
                },
                itemBuilder: (context, index) {
                  final item = onboardingData[index];
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: Lottie.asset(
                            item.lottiePath,
                            fit: BoxFit.contain,
                            frameRate: FrameRate.max,
                            repeat: true,
                            errorBuilder: (context, error, stackTrace) {
                              return Center(
                                child: Icon(
                                  Icons.error_outline,
                                  size: 64,
                                  color: AppColors.error,
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20.0),
                        child: Column(
                          children: [
                            Text(
                              item.title,
                              style: AppTextStyles.headingLarge,
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              item.description,
                              style: AppTextStyles.bodyLarge,
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 40),
                    ],
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                children: [
                  AnimatedSmoothIndicator(
                    activeIndex: _currentPage,
                    count: onboardingData.length,
                    effect: ExpandingDotsEffect(
                      dotHeight: 8,
                      dotWidth: 8,
                      activeDotColor: AppColors.primary,
                      dotColor: AppColors.primary.withOpacity(0.2),
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        if (_currentPage < onboardingData.length - 1) {
                          _pageController.nextPage(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeInOut,
                          );
                        } else {
                          context.go('/auth');
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        _currentPage < onboardingData.length - 1 ? 'Next' : 'Get Started',
                        style: AppTextStyles.buttonLarge,
                      ),
                    ),
                  ),
                  if (_currentPage < onboardingData.length - 1) ...[
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: () {
                        context.go('/auth');
                      },
                      child: Text(
                        'Skip',
                        style: AppTextStyles.buttonMedium.copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
} 