import '../core/constants/app_vectors.dart';

class OnboardingModel {
  final String title;
  final String description;
  final String lottiePath;

  OnboardingModel({
    required this.title,
    required this.description,
    required this.lottiePath,
  });
}

final List<OnboardingModel> onboardingData = [
  OnboardingModel(
    title: 'Welcome to JINZ Media',
    description: 'Your one-stop solution for all media needs. Discover a world of possibilities.',
    lottiePath: 'assets/lotties/welcome.json',
  ),
  OnboardingModel(
    title: 'Powerful Media Tools',
    description: 'Access a wide range of professional media tools and utilities all in one place.',
    lottiePath: 'assets/lotties/tools.json',
  ),
  OnboardingModel(
    title: 'Easy to Use',
    description: 'Simple and intuitive interface designed for both beginners and professionals.',
    lottiePath: 'assets/lotties/easy.json',
  ),
]; 