from flask import Blueprint, jsonify, request
from app.models import User, Account, SavingsGoal, Institution, Balance
from .. import db
from datetime import datetime
import logging

savings_goal_bp = Blueprint('savingsgoals', __name__)

@savings_goal_bp.route('/')
def index():
    return 'Savings Goal Blueprint'

#********* Create Savings Goal *********#
@savings_goal_bp.route('/create', methods=['POST'])
def create_savings_goal():
    logging.debug("Savings goal creation endpoint hit")
    data = request.get_json()
    logging.debug(f"Received data: {data}")

    name = data.get('name')
    description = data.get('description', '')
    goal = data.get('goal')
    balance = data.get('balance')
    accounts = data.get('accounts')
    user_uid = data.get('uid')

    if not name or not goal or not balance or not accounts:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try: 
        user = User.query.filter(User.uid == user_uid).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404
           
        new_savings_goal = SavingsGoal(
            name=name,
            description=description,
            goal=goal,
            balance=balance,
            account=','.join(accounts),
            user_id=user.id
        )

        db.session.add(new_savings_goal)
        db.session.commit()
        return jsonify({'message': 'Savings goal created successfully', 'savingsGoalId': new_savings_goal.id}), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error during savings goal creation: {str(e)}")
        return jsonify({'error': str(e)}), 400
    
#********* Get Savings Goals *********#
@savings_goal_bp.route('/get', methods=['GET'])
def get_savings_goals():
    logging.debug("Get savings goals endpoint hit")
    user_uid = request.args.get('uid')
    if not user_uid:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        user = User.query.filter(User.uid == user_uid).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        savings_goals = SavingsGoal.query.filter(SavingsGoal.user_id == user.id).all()
        if not savings_goals:
            return jsonify({'message': 'No savings goals found'}), 200

        savings_goals_list = []
        for goal in savings_goals:
            account_ids = goal.account.split(',')
            linked_accounts = Account.query.filter(Account.account_id.in_(account_ids)).all()

            total_balance = sum(account.balance for account in linked_accounts)

            if total_balance != goal.balance:
                goal.balance = total_balance
                db.session.commit()

            goal_dict = {
                'id': goal.id,
                'name': goal.name,
                'description': goal.description,
                'goal': goal.goal,
                'balance': goal.balance,
                'account': account_ids,
                'created_at': goal.created_at
            }
            savings_goals_list.append(goal_dict)

        return jsonify({'savingsGoals': savings_goals_list}), 200
    except Exception as e:
        logging.error(f"Error during savings goal retrieval: {str(e)}")
        return jsonify({'error': str(e)}), 400

@savings_goal_bp.route('/delete', methods=['DELETE'])
def delete_savings_goal():
    logging.debug("Delete savings goal endpoint hit")
    data = request.get_json()
    logging.debug(f"Received data: {data}")

    savings_goal_id = data.get('savingsGoalId')
    user_uid = data.get('uid')

    if not savings_goal_id or not user_uid:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        user = User.query.filter(User.uid == user_uid).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        savings_goal = SavingsGoal.query.filter(SavingsGoal.id == savings_goal_id).first()
        if not savings_goal:
            return jsonify({'error': 'Savings goal not found'}), 404

        db.session.delete(savings_goal)
        db.session.commit()
        return jsonify({'message': 'Savings goal deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error during savings goal deletion: {str(e)}")
        return jsonify({'error': str(e)}), 400