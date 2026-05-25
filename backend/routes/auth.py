from flask import Blueprint, request, jsonify
from extensions import db
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Missing required fields"}), 400
        
    if User.query.filter_by(username=data['username']).first() or User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "User or Email already exists"}), 400
        
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({"msg": "Invalid email or password"}), 401
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200