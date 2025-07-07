import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../models/app_model.dart';

class AppCard extends StatefulWidget {
  final AppModel app;
  final VoidCallback? onTap;
  final CardStyle style;

  const AppCard({
    super.key,
    required this.app,
    this.onTap,
    this.style = CardStyle.compact,
  });

  @override
  State<AppCard> createState() => _AppCardState();
}

class _AppCardState extends State<AppCard> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  bool _isHovered = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.03).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _handleHover(bool isHovered) {
    setState(() {
      _isHovered = isHovered;
      if (isHovered) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    switch (widget.style) {
      case CardStyle.compact:
        return _buildCompactCard();
      case CardStyle.detailed:
        return _buildDetailedCard();
      case CardStyle.featured:
        return _buildFeaturedCard();
    }
  }

  Widget _buildCompactCard() {
    return LayoutBuilder(
      builder: (context, constraints) {
        return MouseRegion(
          onEnter: (_) => _handleHover(true),
          onExit: (_) => _handleHover(false),
          child: GestureDetector(
            onTap: widget.onTap,
            child: ScaleTransition(
              scale: _scaleAnimation,
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppColors.cardBackground,
                      AppColors.cardBackground.withOpacity(0.95),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: _isHovered 
                      ? AppColors.primary.withOpacity(0.3)
                      : AppColors.border.withOpacity(0.1),
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: _isHovered
                          ? AppColors.primary.withOpacity(0.15)
                          : AppColors.shadow.withOpacity(0.1),
                      offset: const Offset(0, 8),
                      blurRadius: 24,
                      spreadRadius: -4,
                    ),
                  ],
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                                    AppColors.primary.withOpacity(0.05),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: AppColors.primary.withOpacity(0.2),
                                  width: 1.5,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppColors.primary.withOpacity(0.15),
                                    offset: const Offset(0, 4),
                                    blurRadius: 12,
                                    spreadRadius: -4,
                                  ),
                                ],
                              ),
                              child: Center(
                                child: Text(
                                  widget.app.icon,
                                  style: TextStyle(
                                    fontSize: 40,
                                    color: AppColors.primary,
                                    shadows: [
                                      Shadow(
                                        color: AppColors.primary.withOpacity(0.3),
                                        offset: const Offset(0, 2),
                                        blurRadius: 4,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              widget.app.title,
                              style: AppTextStyles.cardTitle.copyWith(
                                color: AppColors.textPrimary,
                                fontWeight: FontWeight.w700,
                                letterSpacing: -0.5,
                                fontSize: 16,
                              ),
                              textAlign: TextAlign.center,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 8),
                            _buildPriceLabel(),
                            const SizedBox(height: 12),
                            _buildUseButton(),
                          ],
                        ),
                      ),
                    ),
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      height: 6,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.centerLeft,
                          end: Alignment.centerRight,
                          colors: [
                            widget.app.isFree
                                ? AppColors.success.withOpacity(_isHovered ? 0.7 : 0.5)
                                : AppColors.primary.withOpacity(_isHovered ? 0.7 : 0.5),
                            widget.app.isFree
                                ? AppColors.success.withOpacity(_isHovered ? 0.5 : 0.3)
                                : AppColors.primary.withOpacity(_isHovered ? 0.5 : 0.3),
                          ],
                        ),
                        borderRadius: const BorderRadius.vertical(
                          bottom: Radius.circular(24),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildDetailedCard() {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.cardBackground,
              AppColors.cardBackground.withOpacity(0.95),
            ],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: AppColors.border.withOpacity(0.1), 
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadow.withOpacity(0.1),
              offset: const Offset(0, 8),
              blurRadius: 24,
              spreadRadius: -8,
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 180,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.primary.withOpacity(0.1),
                    AppColors.secondary.withOpacity(0.1),
                  ],
                ),
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(22),
                ),
              ),
              child: Center(
                child: Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: AppColors.primary.withOpacity(0.2),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.primary.withOpacity(0.1),
                        offset: const Offset(0, 4),
                        blurRadius: 12,
                        spreadRadius: -4,
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      widget.app.icon,
                      style: TextStyle(
                        fontSize: 56,
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
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.app.title,
                    style: AppTextStyles.cardTitle.copyWith(
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.5,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  _buildPriceRow(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturedCard() {
    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(28),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadowDark.withOpacity(0.2),
              offset: const Offset(0, 12),
              blurRadius: 48,
              spreadRadius: -12,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: Stack(
            children: [
              if (widget.app.thumbnailUrl != null)
                Positioned.fill(
                  child: Image.network(
                    widget.app.thumbnailUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: AppColors.primary.withOpacity(0.1),
                        child: Center(
                          child: Text(
                            widget.app.icon,
                            style: TextStyle(
                              fontSize: 80,
                              color: AppColors.primary,
                              shadows: [
                                Shadow(
                                  color: AppColors.primary.withOpacity(0.2),
                                  offset: const Offset(0, 4),
                                  blurRadius: 12,
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              Positioned.fill(
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.transparent,
                        Color(0xCC000000),
                      ],
                      stops: [0.3, 1.0],
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 0,
                left: 0,
                right: 0,
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (widget.app.isFeatured)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 18,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.secondary,
                            borderRadius: BorderRadius.circular(12),
                            boxShadow: [
                              BoxShadow(
                                color: AppColors.secondary.withOpacity(0.4),
                                offset: const Offset(0, 4),
                                blurRadius: 12,
                                spreadRadius: -4,
                              ),
                            ],
                          ),
                          child: Text(
                            'FEATURED',
                            style: AppTextStyles.badge.copyWith(
                              color: AppColors.textOnDark,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 1.2,
                            ),
                          ),
                        ),
                      const SizedBox(height: 16),
                      Text(
                        widget.app.title,
                        style: AppTextStyles.headingMedium.copyWith(
                          color: AppColors.textOnDark,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        widget.app.description,
                        style: AppTextStyles.bodyLarge.copyWith(
                          color: AppColors.textOnDark.withOpacity(0.9),
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPriceLabel() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: widget.app.isFree 
          ? AppColors.success.withOpacity(0.1) 
          : AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        widget.app.priceText,
        style: AppTextStyles.price.copyWith(
          color: widget.app.isFree ? AppColors.success : AppColors.primary,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }

  Widget _buildPriceRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: widget.app.isFree 
              ? AppColors.success.withOpacity(0.1) 
              : AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            widget.app.priceText,
            style: AppTextStyles.price.copyWith(
              color: widget.app.isFree ? AppColors.success : AppColors.primary,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        Text(
          widget.app.category,
          style: AppTextStyles.bodySmall.copyWith(
            color: AppColors.textSecondary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildUseButton() {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: widget.onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: widget.app.isFree ? AppColors.primary : AppColors.success,
          foregroundColor: AppColors.textOnDark,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: _isHovered ? 4 : 2,
        ),
        child: Text(
          widget.app.isFree ? 'Sử dụng' : 'Mua ngay',
          style: AppTextStyles.buttonMedium.copyWith(
            color: AppColors.textOnDark,
            fontSize: 14,
          ),
        ),
      ),
    );
  }
}

enum CardStyle { compact, detailed, featured } 