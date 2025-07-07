import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> with TickerProviderStateMixin {
  late AnimationController _logoController;
  late AnimationController _textController;
  late Animation<double> _logoScaleAnimation;
  late Animation<double> _logoRotateAnimation;
  late Animation<double> _textSlideAnimation;
  late Animation<double> _textFadeAnimation;
  late Animation<double> _backgroundScaleAnimation;

  @override
  void initState() {
    super.initState();
    
    // Logo animations
    _logoController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    );

    _logoScaleAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: 1.2)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 60.0,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 1.2, end: 1.0)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 40.0,
      ),
    ]).animate(_logoController);

    _logoRotateAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: 0.5)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 60.0,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.5, end: 0.0)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 40.0,
      ),
    ]).animate(_logoController);

    _backgroundScaleAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 0.0, end: 50.0)
            .chain(CurveTween(curve: Curves.easeOut)),
        weight: 60.0,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 50.0, end: 40.0)
            .chain(CurveTween(curve: Curves.easeInOut)),
        weight: 40.0,
      ),
    ]).animate(_logoController);

    // Text animations
    _textController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _textSlideAnimation = Tween<double>(
      begin: 50.0,
      end: 0.0,
    ).animate(CurvedAnimation(
      parent: _textController,
      curve: Curves.easeOut,
    ));

    _textFadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _textController,
      curve: Curves.easeOut,
    ));

    // Start animations
    _logoController.forward();
    Future.delayed(const Duration(milliseconds: 500), () {
      _textController.forward();
    });

    // Navigate to introduce page
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        context.go('/introduce');
      }
    });
  }

  @override
  void dispose() {
    _logoController.dispose();
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.primary,
      body: Stack(
        children: [
          // Animated background circles
          Center(
            child: AnimatedBuilder(
              animation: _logoController,
              builder: (context, child) {
                return Transform.scale(
                  scale: _backgroundScaleAnimation.value,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                    ),
                  ),
                );
              },
            ),
          ),
          // Content
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Animated logo
                AnimatedBuilder(
                  animation: _logoController,
                  builder: (context, child) {
                    return Transform.scale(
                      scale: _logoScaleAnimation.value,
                      child: Transform.rotate(
                        angle: _logoRotateAnimation.value,
                        child: Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(30),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 20,
                                offset: const Offset(0, 10),
                              ),
                            ],
                          ),
                          child: Icon(
                            Icons.play_circle_fill_rounded,
                            size: 80,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 40),
                // Animated text
                AnimatedBuilder(
                  animation: _textController,
                  builder: (context, child) {
                    return Transform.translate(
                      offset: Offset(0, _textSlideAnimation.value),
                      child: Opacity(
                        opacity: _textFadeAnimation.value,
                        child: Column(
                          children: [
                            Text(
                              'JINZ Media',
                              style: TextStyle(
                                fontSize: 40,
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.onPrimary,
                                letterSpacing: 2,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Your Media Solution',
                              style: TextStyle(
                                fontSize: 16,
                                color: Theme.of(context).colorScheme.onPrimary.withOpacity(0.8),
                                letterSpacing: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
} 