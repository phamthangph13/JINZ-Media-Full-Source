import 'package:flutter/material.dart';
import 'package:mediatool/presentation/pages/auth/widgets/auth_content.dart';
import 'package:mediatool/presentation/pages/auth/widgets/auth_form.dart';

class AuthPage extends StatelessWidget {
  const AuthPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Left side - Content
          const Expanded(
            flex: 5,
            child: AuthContent(),
          ),
          // Right side - Auth Form
          Expanded(
            flex: 4,
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Background
                Container(
                  decoration: BoxDecoration(
                    color: Colors.grey[50],
                  ),
                ),
                // Floating Form
                Container(
                  width: 400,
                  margin: const EdgeInsets.symmetric(horizontal: 32),
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: const AuthForm(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
} 