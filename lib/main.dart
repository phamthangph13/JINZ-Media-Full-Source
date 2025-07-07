import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/routes/app_router.dart';
import 'core/constants/app_colors.dart';
import 'presentation/pages/splash/splash_page.dart';
import 'presentation/pages/introduce/introduce_page.dart';
import 'presentation/pages/auth/auth_page.dart';
import 'presentation/pages/home/home_page.dart';
import 'presentation/pages/store/store_page.dart';
import 'presentation/pages/apps_special/apps_special_page.dart';
import 'presentation/pages/utility_apps/utility_apps_page.dart';

void main() {
  runApp(const MyApp());
}

final GoRouter _router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashPage(),
    ),
    GoRoute(
      path: '/introduce',
      builder: (context, state) => const IntroducePage(),
    ),
    GoRoute(
      path: '/auth',
      builder: (context, state) => const AuthPage(),
    ),
    GoRoute(
      path: '/home',
      builder: (context, state) => const HomePage(),
    ),
    GoRoute(
      path: '/store',
      builder: (context, state) => const StorePage(),
    ),
    GoRoute(
      path: '/apps-special',
      builder: (context, state) => const AppsSpecialPage(),
    ),
    GoRoute(
      path: '/utility-apps',
      builder: (context, state) => const UtilityAppsPage(),
    ),
  ],
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'JINZ Media',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }
}
