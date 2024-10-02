from flask import Blueprint, jsonify, request
from ..models.user import User
from .. import db
from datetime import datetime
import logging

user_bp = Blueprint('user', __name__)

@user_bp.route('/')
def index():
    return 'User Blueprint'

#********* Register User *********#
@user_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    uid = data.get('uid')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    username = data.get('userName')
    dob_str = data.get('dob')
    

    try:
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    
    existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400
    
    new_user = User(
        uid=uid,
        first_name=first_name,
        last_name=last_name,
        email=email,
        username=username,
        dob=dob
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully', 'userId': new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error during registration: {str(e)}")
        return jsonify({'error': str(e)}), 400

#********* User Login *********#
@user_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    uid = data.get('uid')

    if not uid:
        return jsonify({'error': 'UID is required'}), 400

    try:
        user = User.query.filter_by(uid=uid).first()

        if user is None:
            return jsonify({'error': 'User not found'}), 404

        user_data = {
            'id': user.id,
            'uid': user.uid,
            'email': user.email,
            'username': user.username,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'dob': user.dob.strftime('%Y-%m-%d')
        }

        return jsonify(user_data), 200

    except Exception as e:
        logging.error(f"Error during login: {str(e)}")
        return jsonify({'error': str(e)}), 500