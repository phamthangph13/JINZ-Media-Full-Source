import 'package:flutter/material.dart';

class AppColors {
  // Primary colors
  static const Color primary = Color(0xFF111827);
  static const Color secondary = Color(0xFF28db7b);
  
  // Background colors
  static const Color background = Color(0xFFF6F8FA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color cardBackground = Color(0xFFFFFFFF);
  
  // Text colors
  static const Color textPrimary = Color(0xFF222222);
  static const Color textSecondary = Color(0xFF828282);
  static const Color textLight = Color(0xFFAAAAAAA);
  static const Color textOnDark = Color(0xFFFFFFFF);
  
  // Border colors
  static const Color border = Color(0xFFE3E7EF);
  static const Color borderHover = Color(0xFFD0D7E3);
  
  // Status colors
  static const Color success = Color(0xFF28db7b);
  static const Color warning = Color(0xFFFFE25D);
  static const Color error = Color(0xFFE53E3E);
  
  // Shadow colors
  static const Color shadow = Color(0x1A3C5AAA);
  static const Color shadowDark = Color(0x3C3C5AAA);
  
  // Gradient colors
  static const LinearGradient heroGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [Color(0xFFDEC4BE), Color(0xFFFFFFFF)],
    stops: [0.44, 0.95],
  );
  
  static const LinearGradient darkGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF0B0B0C), Color(0xFF332724)],
    stops: [0.72, 1.0],
  );
} 