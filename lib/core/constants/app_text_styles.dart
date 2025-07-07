import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTextStyles {
  // Display styles
  static TextStyle get displayLarge => GoogleFonts.inter(
    fontSize: 48,
    fontWeight: FontWeight.w800,
    color: AppColors.textPrimary,
    letterSpacing: 0.01,
    height: 1.06,
  );
  
  static TextStyle get displayMedium => GoogleFonts.inter(
    fontSize: 36,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
    letterSpacing: 0.01,
  );
  
  // Heading styles
  static TextStyle get headingLarge => GoogleFonts.inter(
    fontSize: 32,
    fontWeight: FontWeight.w700,
    color: AppColors.textPrimary,
    letterSpacing: 0.01,
  );
  
  static TextStyle get headingMedium => GoogleFonts.inter(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    letterSpacing: 0.01,
  );
  
  static TextStyle get headingSmall => GoogleFonts.inter(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );
  
  // Body styles
  static TextStyle get bodyLarge => GoogleFonts.roboto(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
    height: 1.42,
  );
  
  static TextStyle get bodyMedium => GoogleFonts.roboto(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
  );
  
  static TextStyle get bodySmall => GoogleFonts.roboto(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
  );
  
  // Button styles
  static TextStyle get buttonLarge => GoogleFonts.roboto(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: AppColors.textOnDark,
  );
  
  static TextStyle get buttonMedium => GoogleFonts.roboto(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    color: AppColors.textPrimary,
  );
  
  // Special styles
  static TextStyle get cardTitle => GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
    height: 1.28,
  );
  
  static TextStyle get price => GoogleFonts.roboto(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );
  
  static TextStyle get badge => GoogleFonts.roboto(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    color: AppColors.textPrimary,
  );
} 