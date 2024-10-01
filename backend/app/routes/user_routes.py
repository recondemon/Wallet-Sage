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
    # converts string to date
    try:
        dob = datetime.strptime(dob_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    
    
    existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
    # checks for user
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400
    # makes new user
    new_user = User(
        uid=uid,
        first_name=first_name,
        last_name=last_name,
        email=email,
        username=username,
        dob=dob
    )
    #! -------- add better error handling here -------- #
    try:
        db.session.add(new_user) # pylint: disable=no-member
        db.session.commit() # pylint: disable=no-member
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback() # pylint: disable=no-member
        logging.error(f"Error during registration: {str(e)}")
        return jsonify({'error': str(e)}), 400

