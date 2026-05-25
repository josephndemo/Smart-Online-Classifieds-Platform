from app import create_app
from extensions import db
from models import User, Listing

app = create_app()

def seed_database():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Create Demo Sellers/Buyers
        user1 = User(username="alice_dev", email="alice@example.com")
        user1.set_password("password123")
        user2 = User(username="bob_sales", email="bob@example.com")
        user2.set_password("password123")
        
        db.session.add_all([user1, user2])
        db.session.commit()

        # Create Mock Listings
        l1 = Listing(
            title="iPhone 14 Pro - 256GB Space Black",
            description="Excellent condition, original screen, box included.",
            price=699.00,
            category="Electronics",
            image_url="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=500",
            user_id=user1.id
        )
        l2 = Listing(
            title="2018 Honda Civic LX",
            description="Single owner, clean title, 45k miles, fuel efficient.",
            price=16500.00,
            category="Vehicles",
            image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=500",
            user_id=user2.id
        )
        l3 = Listing(
            title="Cozy 1 Bedroom Apartment",
            description="Located in downtown Jersey City, amenities included.",
            price=2400.00,
            category="Real Estate",
            image_url="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500",
            user_id=user1.id
        )

        db.session.add_all([l1, l2, l3])
        db.session.commit()
        print("Database initialized and populated with sample items!")

if __name__ == '__main__':
    seed_database()