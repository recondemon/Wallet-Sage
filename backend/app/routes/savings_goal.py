from flask import Blueprint, jsonify, request
from app.models import User, Account, SavingsGoal, Institution, Balance
from .. import db
from datetime import datetime
import logging

savings_goal_bp = Blueprint('savings_goal', __name__)

@savings_goal_bp.route('/')
def index():
    return 'Savings Goal Blueprint'

#********* Create Savings Goal *********#
@savings_goal_bp.route('/create', methods=['POST'])
def create_savings_goal():

    data = request.get_json()

    name = data.get('name')
    description = data.get('description')
    goal = data.get('goal')
    balance = data.get('balance')
    account = data.get('account')
    user_uid = data.get('userId')

    try: 
        user = User.query.filter(User.uid == user_uid).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
           
        new_savings_goal = SavingsGoal(
            name=name,
            description=description,
            goal=goal,
            balance=balance,
            account=account,
            user_id=user.id
        )

        db.session.add(new_savings_goal)
        db.session.commit()
        return jsonify({'message': 'Savings goal created successfully', 'savingsGoalId': new_savings_goal.id}), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error during savings goal creation: {str(e)}")
        return jsonify({'error': str(e)}), 400