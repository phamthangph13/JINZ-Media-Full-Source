import 'package:flutter/material.dart';
import '../../presentation/pages/auth/auth_page.dart';
import '../../presentation/pages/home/home_page.dart';
import '../../presentation/pages/splash/splash_page.dart';
import '../../presentation/pages/store/store_page.dart';
import '../../presentation/pages/apps_special/apps_special_page.dart';
import '../../presentation/pages/utility_apps/utility_apps_page.dart';
import '../../presentation/pages/introduce/introduce_page.dart';

class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const SplashPage());
      case '/introduce':
        return MaterialPageRoute(builder: (_) => const IntroducePage());
      case '/auth':
        return MaterialPageRoute(builder: (_) => const AuthPage());
      case '/home':
        return MaterialPageRoute(builder: (_) => const HomePage());
      case '/store':
        return MaterialPageRoute(builder: (_) => const StorePage());
      case '/apps-special':
        return MaterialPageRoute(builder: (_) => const AppsSpecialPage());
      case '/utility-apps':
        return MaterialPageRoute(builder: (_) => const UtilityAppsPage());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
} 