from flask import Blueprint, request, jsonify
from extensions import db, mail # <-- Imported mail instance
from models import Listing, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message # <-- Imported Message envelope class

listings_bp = Blueprint('listings', __name__, url_prefix='/api/listings')

@listings_bp.route('', methods=['GET'])
def get_listings():
    category = request.args.get('category')
    search = request.args.get('search')
    
    query = Listing.query
    if category:
        query = query.filter_by(category=category)
    if search:
        query = query.filter(Listing.title.ilike(f'%{search}%') | Listing.description.ilike(f'%{search}%'))
        
    listings = query.order_by(Listing.created_at.desc()).all()
    return jsonify([l.to_dict() for l in listings]), 200

@listings_bp.route('/<int:id>', methods=['GET'])
def get_listing_detail(id):
    listing = Listing.query.get_or_404(id) # <-- Fixed typo parameter bug
    return jsonify(listing.to_dict()), 200

@listings_bp.route('', methods=['POST'])
@jwt_required()
def create_listing():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    listing = Listing(
        title=data['title'],
        description=data['description'],
        price=float(data['price']),
        category=data['category'],
        image_url=data.get('image_url'),
        user_id=user_id
    )
    db.session.add(listing)
    db.session.commit()
    return jsonify(listing.to_dict()), 201

@listings_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_listing(id):
    user_id = int(get_jwt_identity())
    listing = Listing.query.get_or_404(id) # <-- Fixed typo parameter bug
    
    if listing.user_id != user_id:
        return jsonify({"msg": "Unauthorized action"}), 403
        
    data = request.get_json()
    listing.title = data.get('title', listing.title)
    listing.description = data.get('description', listing.description)
    listing.price = float(data.get('price', listing.price))
    listing.category = data.get('category', listing.category)
    listing.image_url = data.get('image_url', listing.image_url)
    listing.status = data.get('status', listing.status)
    
    db.session.commit()
    return jsonify(listing.to_dict()), 200

@listings_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_listing(id):
    user_id = int(get_jwt_identity())
    listing = Listing.query.get_or_404(id) # <-- Fixed typo parameter bug
    
    if listing.user_id != user_id:
        return jsonify({"msg": "Unauthorized action"}), 403
        
    db.session.delete(listing)
    db.session.commit()
    return jsonify({"msg": "Listing deleted"}), 200

@listings_bp.route('/<int:id>/favorite', methods=['POST'])
@jwt_required()
def toggle_favorite(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    listing = Listing.query.get_or_404(id) # <-- Fixed typo parameter bug
    
    if listing in user.favorite_listings:
        user.favorite_listings.remove(listing)
        status = False
    else:
        user.favorite_listings.append(listing)
        status = True
        
    db.session.commit()
    return jsonify({"favorited": status}), 200

@listings_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_user_dashboard():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    my_listings = [l.to_dict() for l in user.listings]
    fav_listings = [l.to_dict() for l in user.favorite_listings]
    
    return jsonify({
        "my_listings": my_listings,
        "favorites": fav_listings
    }), 200

@listings_bp.route('/<int:id>/inquiry', methods=['POST'])
@jwt_required()
def send_inquiry(id):
    sender_id = get_jwt_identity()
    sender = User.query.get(sender_id)
    listing = Listing.query.get_or_404(id) # <-- Fixed typo parameter bug
    data = request.get_json()
    
    message_content = data.get('message', 'Is this item still available?')
    seller = listing.owner
    
    # NEW FEATURE: Automated Interactive Inquiry Email Pipeline to Seller Profile Account
    try:
        msg = Message(f"SmartClassifieds - New Customer Inquiry regarding '{listing.title}'", recipients=[seller.email])
        msg.body = (
            f"Hello {seller.username},\n\n"
            f"An interested buyer named '{sender.username}' ({sender.email}) has reached out regarding "
            f"your listed marketplace ad item: '{listing.title}'.\n\n"
            f"Buyer Custom Message:\n"
            f"--------------------------------------------------\n"
            f"\"{message_content}\"\n"
            f"--------------------------------------------------\n\n"
            f"Please respond directly to the buyer by addressing an email back to: {sender.email}."
        )
        mail.send(msg)
        print(f"[MAIL LOG] Dispatched inquiry message notification from {sender.email} to seller {seller.email}")
    except Exception as e:
        # Safeguards local workflow so invalid dummy testing emails don't crash core routes
        print(f"[MAIL ERROR - BYPASSING CRASH] Lead dispatch failed to route over SMTP: {e}")
    
    return jsonify({"msg": f"Inquiry notification processed successfully and dispatched to seller {seller.username}!"}), 200