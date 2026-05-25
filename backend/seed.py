from app import create_app
from extensions import db
from models import User, Listing
import random

app = create_app()

def seed_database():
    with app.app_context():
        # Clear existing entries safely
        db.drop_all()
        db.create_all()

        print("Creating profile users...")
        # Create Demo Sellers/Buyers
        user1 = User(username="alice_dev", email="alice@example.com")
        user1.set_password("password123")
        user2 = User(username="bob_sales", email="bob@example.com")
        user2.set_password("password123")
        user3 = User(username="charlie_deals", email="charlie@example.com")
        user3.set_password("password123")
        user4 = User(username="dana_market", email="dana@example.com")
        user4.set_password("password123")
        
        users = [user1, user2, user3, user4]
        db.session.add_all(users)
        db.session.commit()

        print("Injecting 20 standard marketplace items...")
        
        raw_items = [
            # --- Electronics ---
            {
                "title": "iPhone 14 Pro - 256GB Space Black",
                "description": "Excellent condition, original screen, box included. Battery health at 89%. Unlocked for all networks.",
                "price": 699.00,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=500"
            },
            {
                "title": "Sony WH-1000XM4 Noise Canceling Headphones",
                "description": "Barely used, exceptional sound stage, silver finish. Comes with custom traveling protective case and type-C charging cable.",
                "price": 180.00,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500"
            },
            {
                "title": "M1 MacBook Air 2020 (8GB RAM / 256GB SSD)",
                "description": "Space Gray. Perfect for students and light software development. Minor scratch on bottom layout surface, screen is pristine.",
                "price": 550.00,
                "category": "Electronics",
                "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=500"
            },
            
            # --- Vehicles ---
            {
                "title": "2018 Honda Civic LX",
                "description": "Single owner, clean title, 45k miles, fuel efficient. Regular multi-point inspections performed.",
                "price": 16500.00,
                "category": "Vehicles",
                "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=500"
            },
            {
                "title": "Trek Domane AL 2 Disc Road Bike",
                "description": "Frame Size 54cm. Lightly ridden on paved roads. Perfect entry-level road bike with solid mechanical configurations.",
                "price": 850.00,
                "category": "Vehicles",
                "image_url": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=500"
            },
            {
                "title": "2015 Yamaha YZF-R3 Sportbike",
                "description": "Perfect beginner sport bike. 12,000 miles. Brand new tires installed last month. Runs smoothly, garage kept.",
                "price": 3400.00,
                "category": "Vehicles",
                "image_url": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=500"
            },

            # --- Real Estate ---
            {
                "title": "Cozy 1 Bedroom Apartment",
                "description": "Located in downtown Jersey City, luxury amenities included. Balcony views, close to rapid transit infrastructure.",
                "price": 2400.00,
                "category": "Real Estate",
                "image_url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500"
            },
            {
                "title": "Spacious Studio Condo - Fully Furnished",
                "description": "Modern studio setup with updated kitchen matrices, stainless steel appliances, and matching in-unit washer/dryer stack.",
                "price": 1850.00,
                "category": "Real Estate",
                "image_url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=500"
            },

            # --- Jobs ---
            {
                "title": "Remote Junior Full-Stack Python Developer",
                "description": "Moringa Corp is seeking a Junior Dev proficient with Flask APIs, dynamic routing, and basic React application deployment frameworks.",
                "price": 4500.00,
                "category": "Jobs",
                "image_url": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=500"
            },
            {
                "title": "Part-Time Graphic Designer Needed",
                "description": "Looking for a freelance designer to manage digital image assets, promotional layouts, and vector illustrations. 15 hours a week.",
                "price": 35.00,
                "category": "Jobs",
                "image_url": "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500"
            },

            # --- Fashion ---
            {
                "title": "Vintage Leather Jacket - Medium",
                "description": "Authentic brown distressed leather bomber jacket. Heavyweight, fits comfortably, all brass zippers functional.",
                "price": 120.00,
                "category": "Fashion",
                "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=500"
            },
            {
                "title": "Nike Air Jordan 1 Low (Size 10.5)",
                "description": "Deadstock, never worn. Classic Red/Black/White colorway matrix. Authenticity verification code included on box ticket.",
                "price": 140.00, # <-- Fixed the decimal format and closed out the block correctly below
                "category": "Fashion",
                "image_url": "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=500"
            },
            {
                "title": "Minimalist Stainless Steel Men's Watch",
                "description": "Waterproof quartz wrist watch with a clean black face and mesh metal strap. Includes extra micro-adjustment pins.",
                "price": 65.00,
                "category": "Fashion",
                "image_url": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=500"
            },

            # --- Services ---
            {
                "title": "Professional Mobile Auto Detailing Service",
                "description": "Full exterior wash, clay bar, wax application, and deep interior extraction cleaning. We drive right to your location!",
                "price": 150.00,
                "category": "Services",
                "image_url": "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=500"
            },
            {
                "title": "Expert Mathematics & Statistics Tutoring",
                "description": "University level tutor specializing in Calculus, Algebra, and data logic matrices. Available for remote Zoom calls.",
                "price": 40.00,
                "category": "Services",
                "image_url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=500"
            },

            # --- Furniture ---
            {
                "title": "Mid-Century Modern Velvet Sofa",
                "description": "Emerald green finish with elegant gold tapered legs. Super comfortable padding matrix, excellent structure.",
                "price": 450.00,
                "category": "Furniture",
                "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500"
            },
            {
                "title": "Solid Oak Wood Dining Table + 4 Chairs",
                "description": "Rustic, sturdy hardwood dining set. Minimal surface wear, legs have protective padding installed.",
                "price": 320.00,
                "category": "Furniture",
                "image_url": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=500"
            },
            {
                "title": "Ergonomic Mesh Office Chair",
                "description": "High back workspace chair with adjustable lumbar mechanisms, 3D armrests, and tilt lock function.",
                "price": 115.00,
                "category": "Furniture",
                "image_url": "https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=500"
            },

            # --- Other Classifieds ---
            {
                "title": "Acoustic Guitar - Fender CD-60S",
                "description": "Solid spruce top. Great projection and warm tone. Includes soft gig bag, strap, and 3 light-gauge picks.",
                "price": 160.00,
                "category": "Other Classifieds",
                "image_url": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=500"
            },
            {
                "title": "Premium Cast Iron Dumbbell Set (50 lbs total)",
                "description": "Includes 2 handles, 4x 7.5lb plates, 4x 2.5lb plates, and spin-lock collars. Great configuration parameters for home gym layouts.",
                "price": 55.00,
                "category": "Other Classifieds",
                "image_url": "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=500"
            }
        ]

        # Allocate random owners from seed users and instantiate the Listings
        for item in raw_items:
            assigned_owner = random.choice(users)
            listing = Listing(
                title=item["title"],
                description=item["description"],
                price=item["price"],
                category=item["category"],
                image_url=item["image_url"],
                user_id=assigned_owner.id
            )
            db.session.add(listing)

        db.session.commit()
        print("Success! Database initialized and populated with 20 real classified entries.")

if __name__ == '__main__':
    seed_database()