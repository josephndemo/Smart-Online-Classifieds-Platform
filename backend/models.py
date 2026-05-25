from extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# Many-to-Many Helper Table for Favorites
favorites = db.Table('favorites',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    db.Column('listing_id', db.Integer, db.ForeignKey('listings.id', ondelete='CASCADE'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # One-to-Many Relationship: One user can have many listings
    listings = db.relationship('Listing', backref='owner', lazy=True, cascade="all, delete-orphan")
    
    # Many-to-Many Relationship: Favorites
    favorite_listings = db.relationship('Listing', secondary=favorites, backref=db.backref('favorited_by', lazy='dynamic'))

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

class Listing(db.Model):
    __tablename__ = 'listings'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False) # Electronics, Vehicles, Real Estate, etc.
    image_url = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='Available') # Available, Sold
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "category": self.category,
            "image_url": self.image_url or "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=500",
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "owner": {
                "id": self.owner.id,
                "username": self.owner.username,
                "email": self.owner.email
            }
        }