class AppModel {
  final String id;
  final String title;
  final String description;
  final String icon;
  final AppType type;
  final double? price;
  final bool isFree;
  final bool isOnSale;
  final double? originalPrice;
  final String category;
  final bool isFeatured;
  final String? thumbnailUrl;

  const AppModel({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.type,
    this.price,
    this.isFree = false,
    this.isOnSale = false,
    this.originalPrice,
    required this.category,
    this.isFeatured = false,
    this.thumbnailUrl,
  });

  String get priceText {
    if (isFree) return 'Free';
    if (price != null) {
      return '${price!.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')} đ';
    }
    return 'Paid';
  }
}

enum AppType {
  utility,
  media,
  productivity,
  security,
  ai,
}

class CategoryModel {
  final String id;
  final String name;
  final String description;
  final String icon;
  final List<AppModel> apps;

  const CategoryModel({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.apps,
  });
} 