from flask import Blueprint, jsonify, request
from ..models.user import User
from .. import db

user_bp = Blueprint('user', __name__)

@user_bp.route('/')
def index():
    return 'User Blueprint'


