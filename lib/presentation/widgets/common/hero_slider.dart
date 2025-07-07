import 'dart:async';
import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';

class HeroSlider extends StatefulWidget {
  const HeroSlider({super.key});

  @override
  State<HeroSlider> createState() => _HeroSliderState();
}

class _HeroSliderState extends State<HeroSlider> {
  final PageController _pageController = PageController();
  int _currentIndex = 0;
  Timer? _timer;

  final List<Map<String, dynamic>> _slides = [
    {
      'title': 'Media Tools Pro',
      'subtitle': 'Bộ công cụ xử lý media chuyên nghiệp với AI tích hợp',
      'description': 'Tối ưu hóa quy trình làm việc của bạn với các công cụ thông minh',
      'gradient': [const Color(0xFF667eea), const Color(0xFF764ba2)],
      'icon': Icons.smart_display,
      'buttonText': 'Tìm hiểu ngay',
      'buttonIcon': Icons.arrow_forward,
    },
    {
      'title': 'Giải pháp All-in-One',
      'subtitle': 'Tất cả công cụ bạn cần trong một nền tảng',
      'description': 'Tiết kiệm thời gian và chi phí với bộ công cụ đa năng',
      'gradient': [const Color(0xFF6B8DD6), const Color(0xFF8E37D7)],
      'icon': Icons.dashboard,
      'buttonText': 'Dùng thử miễn phí',
      'buttonIcon': Icons.play_arrow,
    },
    {
      'title': 'Gói doanh nghiệp',
      'subtitle': 'Giải pháp tối ưu cho doanh nghiệp của bạn',
      'description': 'Tính năng cao cấp và hỗ trợ ưu tiên 24/7',
      'gradient': [const Color(0xFF4CAF50), const Color(0xFF2196F3)],
      'icon': Icons.business,
      'buttonText': 'Xem bảng giá',
      'buttonIcon': Icons.price_check,
    },
    {
      'title': 'AI Studio',
      'subtitle': 'Sức mạnh của AI trong tầm tay bạn',
      'description': 'Tự động hóa quy trình với công nghệ AI tiên tiến',
      'gradient': [const Color(0xFFFF4B2B), const Color(0xFFFF416C)],
      'icon': Icons.auto_awesome,
      'buttonText': 'Mua ngay',
      'buttonIcon': Icons.shopping_cart,
    },
  ];

  @override
  void initState() {
    super.initState();
    _startAutoPlay();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  void _startAutoPlay() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_currentIndex < _slides.length - 1) {
        _pageController.nextPage(
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      } else {
        _pageController.animateToPage(
          0,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          SizedBox(
            height: 400,
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentIndex = index;
                });
              },
              itemCount: _slides.length,
              itemBuilder: (context, index) {
                final slide = _slides[index];
                return Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: slide['gradient'] as List<Color>,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        right: -50,
                        top: -50,
                        child: Icon(
                          slide['icon'] as IconData,
                          size: 250,
                          color: Colors.white.withOpacity(0.1),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(40),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              slide['title'] as String,
                              style: AppTextStyles.displayMedium.copyWith(
                                color: Colors.white,
                                fontSize: 36,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              slide['subtitle'] as String,
                              style: AppTextStyles.headingMedium.copyWith(
                                color: Colors.white.withOpacity(0.9),
                                fontSize: 20,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              slide['description'] as String,
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: Colors.white.withOpacity(0.8),
                              ),
                            ),
                            const SizedBox(height: 32),
                            ElevatedButton.icon(
                              onPressed: () {
                                // Handle button tap
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: slide['gradient'][0] as Color,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 24,
                                  vertical: 16,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              icon: Icon(slide['buttonIcon'] as IconData),
                              label: Text(
                                slide['buttonText'] as String,
                                style: AppTextStyles.buttonLarge.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                onPressed: () {
                  _pageController.previousPage(
                    duration: const Duration(milliseconds: 500),
                    curve: Curves.easeInOut,
                  );
                },
                icon: const Icon(Icons.arrow_back_ios),
                color: AppColors.primary,
              ),
              const SizedBox(width: 16),
              AnimatedSmoothIndicator(
                activeIndex: _currentIndex,
                count: _slides.length,
                effect: ExpandingDotsEffect(
                  dotHeight: 8,
                  dotWidth: 8,
                  activeDotColor: AppColors.primary,
                  dotColor: AppColors.primary.withOpacity(0.2),
                ),
              ),
              const SizedBox(width: 16),
              IconButton(
                onPressed: () {
                  _pageController.nextPage(
                    duration: const Duration(milliseconds: 500),
                    curve: Curves.easeInOut,
                  );
                },
                icon: const Icon(Icons.arrow_forward_ios),
                color: AppColors.primary,
              ),
            ],
          ),
        ],
      ),
    );
  }
} 