from flask import Blueprint, jsonify, request
from ..models.savings_goal import SavingsGoal
from .. import db

savings_goal_bp = Blueprint('savings_goal', __name__)

@savings_goal_bp.route('/')
def index():
    return 'Savings Goal Blueprint'