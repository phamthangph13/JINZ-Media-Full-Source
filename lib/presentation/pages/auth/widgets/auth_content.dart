import 'package:flutter/material.dart';
import 'package:mediatool/core/constants/app_colors.dart';
import 'package:mediatool/core/constants/app_text_styles.dart';

class AuthContent extends StatelessWidget {
  const AuthContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary,
            AppColors.primary.withOpacity(0.8),
            AppColors.primary.withOpacity(0.6),
          ],
        ),
      ),
      child: Stack(
        children: [
          // Background pattern (optional)
          Positioned.fill(
            child: CustomPaint(
              painter: BackgroundPatternPainter(),
            ),
          ),
          // Content
          Padding(
            padding: const EdgeInsets.all(32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome to\nJINZ Media',
                  style: AppTextStyles.displayLarge.copyWith(
                    color: Colors.white,
                    height: 1.2,
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Your one-stop solution for all media needs.',
                  style: AppTextStyles.bodyLarge.copyWith(
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
                const SizedBox(height: 48),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// Custom painter for background pattern
class BackgroundPatternPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.05)
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    final spacing = 30.0;
    final maxLines = ((size.width + size.height) / spacing).ceil();
    
    for (var i = 0.0; i < maxLines * spacing; i += spacing) {
      canvas.drawLine(
        Offset(0, i),
        Offset(i, 0),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
} 