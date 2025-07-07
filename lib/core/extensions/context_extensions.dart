import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

extension BuildContextColors on BuildContext {
  Color get appBackground => AppColors.background;
  Color get appTextPrimary => AppColors.textPrimary;
  Color get appAccent => AppColors.secondary;
} 