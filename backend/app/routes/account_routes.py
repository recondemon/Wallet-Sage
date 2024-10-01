from flask import Blueprint, jsonify, request
from ..models.account import Account
from .. import db

account_bp = Blueprint('account', __name__)

@account_bp.route('/')
def index():
    return 'Account Blueprint'