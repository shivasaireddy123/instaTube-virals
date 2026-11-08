import os
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
from sellers.models import SellerProfile
from categories.models import Category
from products.models import Product
from accounts.models import CustomerProfile, Address
from orders.models import Order, OrderItem
from cart.models import Cart

User = get_user_model()

class Command(BaseCommand):
    help = "Seed database with initial Admin, Sellers, Categories, Products, and Orders"

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding InstaTube Virals database..."))

        # 1. Admin User
        admin_user, created = User.objects.get_or_create(
            email="admin@instatube.com",
            defaults={
                "username": "admin",
                "first_name": "Eleanor",
                "last_name": "Vance",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "phone": "+1 555-0199"
            }
        )
        if created:
            admin_user.set_password("Admin@12345")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("Created Admin: admin@instatube.com / Admin@12345"))
        else:
            admin_user.set_password("Admin@12345")
            admin_user.save()

        # 2. Approved Seller 1 - Artisan Pottery & Stoneware
        seller1_user, s1_created = User.objects.get_or_create(
            email="artisan@instatube.com",
            defaults={
                "username": "artisan",
                "first_name": "Kiran",
                "last_name": "Deshmukh",
                "role": User.Role.SELLER,
                "phone": "+1 555-0142"
            }
        )
        if s1_created:
            seller1_user.set_password("Seller@12345")
            seller1_user.save()
        SellerProfile.objects.update_or_create(
            user=seller1_user,
            defaults={
                "business_name": "EarthCrafts Artisan Studio",
                "business_description": "Hand-thrown stoneware ceramics, textured terracotta planters, and rustic tabletop wares inspired by ancestral pottery traditions.",
                "phone": "+1 555-0142",
                "business_address": "404 Clayworks Lane, Sedona, AZ 86336",
                "approval_status": SellerProfile.ApprovalStatus.APPROVED,
            }
        )

        # 3. Approved Seller 2 - Organic Farm Harvest
        seller2_user, s2_created = User.objects.get_or_create(
            email="farmer@instatube.com",
            defaults={
                "username": "farmer",
                "first_name": "Mateo",
                "last_name": "Rivera",
                "role": User.Role.SELLER,
                "phone": "+1 555-0188"
            }
        )
        if s2_created:
            seller2_user.set_password("Seller@12345")
            seller2_user.save()
        SellerProfile.objects.update_or_create(
            user=seller2_user,
            defaults={
                "business_name": "GreenValley Organic Homestead",
                "business_description": "Small-batch cold-pressed raw honey, sun-dried heirloom herbs, organic orchard preserves, and sustainable botanicals.",
                "phone": "+1 555-0188",
                "business_address": "88 Orchard Ridge Road, Hood River, OR 97031",
                "approval_status": SellerProfile.ApprovalStatus.APPROVED,
            }
        )

        # 4. Pending Seller 3 - Woodworking Crafts
        seller3_user, s3_created = User.objects.get_or_create(
            email="newcrafter@instatube.com",
            defaults={
                "username": "newcrafter",
                "first_name": "Chloe",
                "last_name": "Bennett",
                "role": User.Role.SELLER,
                "phone": "+1 555-0177"
            }
        )
        if s3_created:
            seller3_user.set_password("Seller@12345")
            seller3_user.save()
        SellerProfile.objects.update_or_create(
            user=seller3_user,
            defaults={
                "business_name": "TimberWood Heritage Studio",
                "business_description": "Hand-carved walnut charcuterie boards, live-edge oak serving trays, and organic beeswax finished kitchen accessories.",
                "phone": "+1 555-0177",
                "business_address": "12 Sawmill Hollow, Asheville, NC 28801",
                "approval_status": SellerProfile.ApprovalStatus.PENDING,
            }
        )

        # 5. Customer User
        customer_user, c_created = User.objects.get_or_create(
            email="customer@instatube.com",
            defaults={
                "username": "customer",
                "first_name": "Aria",
                "last_name": "Montgomery",
                "role": User.Role.CUSTOMER,
                "phone": "+1 555-0165"
            }
        )
        if c_created:
            customer_user.set_password("Customer@12345")
            customer_user.save()
        CustomerProfile.objects.update_or_create(
            user=customer_user,
            defaults={
                "phone": "+1 555-0165",
                "address": "742 Evergreen Terrace, Springfield, OR 97477"
            }
        )
        Address.objects.update_or_create(
            customer=customer_user,
            full_name="Aria Montgomery",
            defaults={
                "phone": "+1 555-0165",
                "street_address": "742 Evergreen Terrace",
                "city": "Springfield",
                "state": "Oregon",
                "pincode": "97477",
                "is_default": True
            }
        )
        Cart.objects.get_or_create(customer=customer_user)

        self.stdout.write(self.style.SUCCESS("Users created (Admin, 2 Approved Sellers, 1 Pending Seller, 1 Customer)."))

        # 6. Categories
        cat_data = [
            ("Handcrafted Pottery", "handcrafted-pottery", "Artisan wheel-thrown ceramics, glazed mugs, earthy vases, and decorative bowls.", "Palette"),
            ("Organic Farm Harvest", "organic-farm-harvest", "Direct from family farms: cold-pressed oils, grains, fresh roots, and seasonal produce.", "Leaf"),
            ("Natural Skincare & Apothecary", "natural-skincare", "Botanical balms, lavender essential oils, artisan soaps, and gentle herbal care.", "Sparkles"),
            ("Artisanal Woodwork", "artisanal-woodwork", "Carved walnut kitchenware, live-edge dining boards, and handcrafted wooden decor.", "Hammer"),
            ("Handwoven Textiles", "handwoven-textiles", "Loom-woven wool throws, organic cotton shawls, and botanical dyed linen.", "Feather"),
            ("Wild Honey & Herbal Teas", "honey-and-herbal-teas", "Raw wildflower comb honey, loose-leaf mountain herbal blends, and artisanal syrups.", "Coffee"),
        ]

        categories_map = {}
        for name, slug, desc, icon in cat_data:
            cat, _ = Category.objects.update_or_create(
                slug=slug,
                defaults={"name": name, "description": desc, "icon": icon}
            )
            categories_map[slug] = cat

        self.stdout.write(self.style.SUCCESS(f"Created/Updated {len(categories_map)} categories."))

        # 7. Products (Curated High Quality Earthy Visuals)
        products_data = [
            {
                "name": "Terracotta Sunset Glazed Stoneware Pitcher",
                "category": categories_map["handcrafted-pottery"],
                "seller": seller1_user,
                "price": Decimal("48.50"),
                "stock": 14,
                "description": "Individually thrown on a traditional kick-wheel with rich red Sedona clay. Finished with a food-safe matte cream and terracotta reactive glaze. Perfect for iced herbal infusions, water, or fresh wildflowers.",
                "image_url": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.APPROVED,
            },
            {
                "name": "Artisanal Speckled Ceramic Coffee Mug (Set of 2)",
                "category": categories_map["handcrafted-pottery"],
                "seller": seller1_user,
                "price": Decimal("38.00"),
                "stock": 25,
                "description": "Ergonomic thumb-rest handle and velvety satin finish. Each mug holds 12oz of your favorite morning brew and features unique iron speckles naturally drawn from the high-temperature wood kiln.",
                "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.APPROVED,
            },
            {
                "name": "Hand-Carved Black Walnut Charcuterie Board",
                "category": categories_map["artisanal-woodwork"],
                "seller": seller1_user,
                "price": Decimal("64.00"),
                "stock": 9,
                "description": "Crafted from sustainably salvaged American black walnut. Features natural swirling grain patterns and a hand-shaped ergonomic handle. Finished with food-grade walnut oil and organic beeswax.",
                "image_url": "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.APPROVED,
            },
            {
                "name": "Wildflower Raw Comb Honey (16 oz Jar)",
                "category": categories_map["honey-and-herbal-teas"],
                "seller": seller2_user,
                "price": Decimal("22.50"),
                "stock": 35,
                "description": "Unpasteurized, unfiltered honey straight from high-meadow bee hives. Rich floral amber notes with a slice of fresh natural beeswax comb submerged inside. Pure wholesome goodness.",
                "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.APPROVED,
            },
            {
                "name": "Organic Mountain Chamomile & Lavender Loose Leaf Tea",
                "category": categories_map["honey-and-herbal-teas"],
                "seller": seller2_user,
                "price": Decimal("16.00"),
                "stock": 40,
                "description": "Hand-harvested whole chamomile flowers paired with fragrant Oregon high-altitude lavender and gentle lemon verbena. Naturally caffeine-free and soothing for peaceful evenings.",
                "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.APPROVED,
            },
            {
                "name": "Cold-Pressed Extra Virgin Estate Olive Oil (500ml)",
                "category": categories_map["organic-farm-harvest"],
                "seller": seller2_user,
                "price": Decimal("29.00"),
                "stock": 18,
                "description": "Single-estate harvested green olives pressed within 4 hours of picking. Features a peppery finish, vibrant grassy aroma, and polyphenol-rich profile.",
                "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.APPROVED,
            },
            {
                "name": "Botanical Calendula & Shea Butter Herbal Balm",
                "category": categories_map["natural-skincare"],
                "seller": seller2_user,
                "price": Decimal("19.50"),
                "stock": 30,
                "description": "Slow-infused with organic calendula blossoms grown on our farm. Blended with unrefined fair-trade shea butter and sweet almond oil to restore dry, weathered skin gently.",
                "image_url": "https://images.unsplash.com/photo-1608248597359-7f311df986eb?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.APPROVED,
            },
            {
                "name": "Handwoven Organic Cotton Waffle Throw Blanket",
                "category": categories_map["handwoven-textiles"],
                "seller": seller1_user,
                "price": Decimal("72.00"),
                "stock": 12,
                "description": "Woven on wooden handlooms using certified GOTS unbleached organic cotton. Earthy clay tones dyed using natural madder root and walnut husks. Breathable, textured, and delightfully cozy.",
                "image_url": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.APPROVED,
            },
            # Pending products (ready for Admin dashboard testing)
            {
                "name": "Live-Edge Spalted Maple Serving Platter",
                "category": categories_map["artisanal-woodwork"],
                "seller": seller1_user,
                "price": Decimal("85.00"),
                "stock": 5,
                "description": "Hand-carved spalted maple featuring dark marbled fungal lines and bark-edge charm. Awaiting curator review.",
                "image_url": "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.PENDING,
            },
            {
                "name": "Wild Forest Rosemary & Cedarwood Castile Soap",
                "category": categories_map["natural-skincare"],
                "seller": seller2_user,
                "price": Decimal("12.00"),
                "stock": 22,
                "description": "Traditional cold-process olive oil soap steeped with crushed forest rosemary needles and wild cedarwood resin.",
                "image_url": "https://images.unsplash.com/photo-1607006314187-21a44e5467db?auto=format&fit=crop&w=800&q=80",
                "status": Product.ProductStatus.PENDING,
            }
        ]

        created_products = []
        for p in products_data:
            prod, _ = Product.objects.update_or_create(
                name=p["name"],
                seller=p["seller"],
                defaults={
                    "category": p["category"],
                    "price": p["price"],
                    "stock": p["stock"],
                    "description": p["description"],
                    "image_url": p["image_url"],
                    "status": p["status"],
                }
            )
            created_products.append(prod)

        self.stdout.write(self.style.SUCCESS(f"Created {len(created_products)} realistic products."))

        # 8. Sample completed and active orders for testing
        if not Order.objects.filter(customer=customer_user).exists():
            # Order 1: Completed
            ord1 = Order.objects.create(
                customer=customer_user,
                total_amount=Decimal("86.50"),
                shipping_name="Aria Montgomery",
                shipping_phone="+1 555-0165",
                shipping_address="742 Evergreen Terrace, Springfield, OR 97477",
                payment_method=Order.PaymentMethod.COD,
                order_status=Order.OrderStatus.DELIVERED
            )
            OrderItem.objects.create(
                order=ord1,
                product=created_products[0],
                seller=created_products[0].seller,
                product_name=created_products[0].name,
                purchase_price=created_products[0].price,
                quantity=1,
                fulfillment_status=OrderItem.FulfillmentStatus.DELIVERED
            )
            OrderItem.objects.create(
                order=ord1,
                product=created_products[1],
                seller=created_products[1].seller,
                product_name=created_products[1].name,
                purchase_price=created_products[1].price,
                quantity=1,
                fulfillment_status=OrderItem.FulfillmentStatus.DELIVERED
            )

            # Order 2: Processing
            ord2 = Order.objects.create(
                customer=customer_user,
                total_amount=Decimal("51.50"),
                shipping_name="Aria Montgomery",
                shipping_phone="+1 555-0165",
                shipping_address="742 Evergreen Terrace, Springfield, OR 97477",
                payment_method=Order.PaymentMethod.COD,
                order_status=Order.OrderStatus.PROCESSING
            )
            OrderItem.objects.create(
                order=ord2,
                product=created_products[3],
                seller=created_products[3].seller,
                product_name=created_products[3].name,
                purchase_price=created_products[3].price,
                quantity=1,
                fulfillment_status=OrderItem.FulfillmentStatus.PROCESSING
            )
            OrderItem.objects.create(
                order=ord2,
                product=created_products[5],
                seller=created_products[5].seller,
                product_name=created_products[5].name,
                purchase_price=created_products[5].price,
                quantity=1,
                fulfillment_status=OrderItem.FulfillmentStatus.PROCESSING
            )
            self.stdout.write(self.style.SUCCESS("Created 2 sample orders for initial statistics."))

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
