from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from products.models import Category, Product
from coupons.models import Coupon
import django.utils.timezone as tz
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with demo data'

    def handle(self, *args, **options):
        # Extended categories with 100+ items
        categories = {
            'Rice & Grains': [
                'Basmati Rice 5kg', 'Basmati Rice 10kg', 'White Rice Premium', 'Brown Rice Organic',
                'Wheat Flour 1kg', 'Wheat Flour 5kg', 'Maida Flour', 'Corn Flour',
                'Oats Rolled', 'Quinoa White', 'Millet', 'Pearl Barley',
                'Rice Bran', 'Buckwheat', 'Rye Flour', 'Semolina'
            ],
            'Meat & Fish': [
                'Chicken Breast 500g', 'Chicken Leg 1kg', 'Chicken Thigh 500g',
                'Beef Mince 500g', 'Beef Steak Premium', 'Lamb Mince 500g',
                'Fish Fillet Fresh', 'Salmon Fillet', 'Shrimp Large', 'Shrimp Medium',
                'Crab Meat', 'Squid Fresh', 'Chicken Wings 1kg', 'Turkey Meat'
            ],
            'Eggs & Dairy': [
                'Chicken Eggs Brown 12pc', 'Chicken Eggs White 12pc', 'Quail Eggs 12pc',
                'Fresh Milk 1L', 'Fresh Milk 500ml', 'Yogurt Plain 180g', 'Yogurt Plain 500g',
                'Cheese Cheddar 200g', 'Cheese Mozzarella 200g', 'Paneer Fresh 200g',
                'Butter 100g', 'Butter 500g', 'Ghee Pure 1L', 'Cream Fresh 200ml'
            ],
            'Vegetables': [
                'Tomato Red', 'Tomato Cherry', 'Onion Red', 'Onion White',
                'Potato Red', 'Potato White', 'Carrot Orange', 'Carrot Purple',
                'Cucumber Fresh', 'Cucumber Seedless', 'Capsicum Red', 'Capsicum Yellow',
                'Broccoli Fresh', 'Cauliflower', 'Cabbage Green', 'Cabbage Red',
                'Spinach Bundle', 'Lettuce Green', 'Kale Fresh', 'Peas Green',
                'Beans Green', 'Bottle Gourd', 'Bitter Gourd', 'Pumpkin'
            ],
            'Fruits': [
                'Banana Cavendish', 'Banana Red', 'Apple Red', 'Apple Green',
                'Orange Local', 'Orange Imported', 'Mango Alphonso', 'Mango Langra',
                'Watermelon Fresh', 'Papaya', 'Pineapple', 'Grapes Red',
                'Grapes Green', 'Strawberry', 'Blueberry', 'Raspberry',
                'Coconut Fresh', 'Guava', 'Lemon', 'Lime',
                'Kiwi', 'Avocado', 'Pomegranate', 'Dragon Fruit'
            ],
            'Snacks & Sweets': [
                'Potato Chips Salt', 'Potato Chips Spicy', 'Corn Chips', 'Tortilla Chips',
                'Cookies Chocolate', 'Cookies Vanilla', 'Biscuit Digestive', 'Wafer Cream',
                'Nuts Mix 200g', 'Almonds Raw', 'Cashews Roasted', 'Walnuts',
                'Popcorn Ready', 'Peanut Butter', 'Granola Cereal', 'Candy Assorted'
            ],
            'Beverages': [
                'Black Tea Loose', 'Green Tea Loose', 'Earl Grey Tea', 'Chai Masala',
                'Coffee Ground Medium', 'Coffee Ground Dark', 'Coffee Instant', 'Espresso Powder',
                'Orange Juice 1L', 'Apple Juice 1L', 'Mango Juice 1L', 'Grape Juice',
                'Bottled Water 500ml', 'Bottled Water 1L', 'Sparkling Water', 'Sports Drink'
            ],
            'Pantry Staples': [
                'Oil Canola 1L', 'Oil Olive 500ml', 'Oil Coconut 500ml', 'Oil Mustard 1L',
                'Salt Fine 500g', 'Salt Iodized 1kg', 'Sugar White 1kg', 'Sugar Brown 500g',
                'Spice Turmeric 100g', 'Spice Cumin 100g', 'Spice Coriander 100g', 'Spice Ginger',
                'Honey Pure 500g', 'Vinegar White', 'Soy Sauce', 'Chili Sauce'
            ],
            'Frozen Foods': [
                'Frozen Vegetables Mix', 'Frozen Peas 500g', 'Frozen Corn 500g', 'Frozen Shrimp',
                'Ice Cream Vanilla', 'Ice Cream Chocolate', 'Frozen Pizza', 'Frozen Naan',
                'Frozen Momos', 'Frozen Fries', 'Frozen Samosa', 'Frozen Dumplings'
            ],
            'Household & Cleaning': [
                'Dish Soap Liquid 500ml', 'Dish Soap Liquid 1L', 'Laundry Detergent 1kg',
                'Laundry Detergent 2kg', 'Toilet Paper 4 Roll', 'Toilet Paper 12 Roll',
                'Kitchen Paper Roll 3pc', 'Trash Bags 10pc', 'Trash Bags 30pc',
                'Cleaning Spray 500ml', 'Air Freshener Spray', 'Dish Cloth Pack'
            ]
        }

        created_count = 0
        for cat_name, products in categories.items():
            category, _ = Category.objects.get_or_create(name=cat_name)
            for idx, product_name in enumerate(products):
                product_id = f'{cat_name.lower().replace(" & ", "-").replace(" ", "-")}-{idx+1}'
                # Variable pricing based on category and product
                base_price = {'Rice & Grains': 50, 'Meat & Fish': 150, 'Eggs & Dairy': 100, 
                             'Vegetables': 40, 'Fruits': 60, 'Snacks & Sweets': 80, 
                             'Beverages': 70, 'Pantry Staples': 90, 'Frozen Foods': 120,
                             'Household & Cleaning': 45}
                price = base_price.get(cat_name, 50) + (idx * 15)
                
                Product.objects.get_or_create(
                    product_id=product_id,
                    defaults={
                        'product_name': product_name,
                        'brand': [
                            'Premium Select', 'Fresh Choice', 'Organic Pure', 'Quality Plus',
                            'Market Best', 'Daily Fresh', 'Pure & Good', 'Nature\'s Own'
                        ][idx % 8],
                        'price': price,
                        'stock_quantity': 150 + (idx * 5),
                        'category': category,
                        'description': f'Premium quality {product_name}. Fresh, healthy & delicious. Best value for money.',
                        'discount_percentage': (idx % 5) * 5,  # 0, 5, 10, 15% discount
                    }
                )
                created_count += 1

        # Create test user
        test_user, created = User.objects.get_or_create(
            username='testuser',
            defaults={
                'email': 'test@example.com',
                'role': 'customer'
            }
        )
        if created:
            test_user.set_password('testpass123')
            test_user.save()

        # Create admin user
        if not User.objects.filter(username='admin').exists():
            admin = User.objects.create_user(
                username='admin',
                email='admin@example.com',
                password='admin123',
                role='owner'
            )

        # Create demo coupons
        coupon_codes = [
            {'code': 'SAVE10', 'type': 'percent', 'value': 10},
            {'code': 'SAVE15', 'type': 'percent', 'value': 15},
            {'code': 'SAVE100', 'type': 'fixed', 'value': 100},
            {'code': 'WELCOME20', 'type': 'percent', 'value': 20},
        ]

        for coupon in coupon_codes:
            Coupon.objects.get_or_create(
                coupon_code=coupon['code'],
                defaults={
                    'discount_type': coupon['type'],
                    'discount_value': coupon['value'],
                    'expiry_date': tz.now() + timedelta(days=60),
                    'usage_limit': 200,
                }
            )

        self.stdout.write(self.style.SUCCESS('✅ Demo data created successfully!'))
        self.stdout.write(f'📦 Created {created_count} products across 10 categories')
        self.stdout.write('👤 Users: testuser (testpass123), admin (admin123)')
        self.stdout.write('🎟️  Coupons: SAVE10, SAVE15, WELCOME20 (percent), SAVE100 (fixed)')
