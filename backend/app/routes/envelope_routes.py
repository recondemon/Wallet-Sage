from flask import Blueprint, jsonify, request
from ..models.user import User
from ..models.envelope import Envelope
from .. import db
from datetime import datetime
import logging
from flask_cors import cross_origin

envelope_bp = Blueprint('envelope', __name__)

#****** Create Envelope Route ******#
@envelope_bp.route('/create', methods=['POST'])
def create_envelope():
    name = request.json.get('name')
    description = request.json.get('description', '')
    limit = request.json.get('limit')
    balance = request.json.get('balance', 0)
    transactions = request.json.get('transactions', [])
    user_id = request.json.get('user_id')

    user = User.query.filter_by(uid=user_id).first()
    if user is None:
        logging.error(f"User not found for UID: {user_id}")
        return jsonify({"error": "User not found"}), 404

    envelope = Envelope(
        name=name,
        description=description,
        limit=limit,
        balance=balance,
        user_id=user.id 
    )

    db.session.add(envelope)
    db.session.commit()

    logging.info(f"Envelope '{name}' created for user {user_id}")
    
    return jsonify(envelope=envelope.to_dict()), 201

#****** Get Envelopes Route ******#
@envelope_bp.route('/get', methods=['POST'])
def get_envelopes():
    user_id = request.json.get('user_id')

    user = User.query.filter_by(uid=user_id).first()
    if user is None:
        logging.error(f"User not found for UID: {user_id}")
        return jsonify({"error": "User not found"}), 404

    envelopes = Envelope.query.filter_by(user_id=user.id).all()
    envelopes = [envelope.to_dict() for envelope in envelopes]

    return jsonify(envelopes=envelopes), 200

#****** Add Transaction to Envelope ******#
@envelope_bp.route('/add_transaction', methods=['POST'])
def add_transaction():
    envelope_id = request.json.get('envelope_id')
    transaction_id = request.json.get('transaction_id')

    envelope = Envelope.query.filter_by(id=envelope_id).first()
    if envelope is None:
        logging.error(f"Envelope not found for ID: {envelope_id}")
        return jsonify({"error": "Envelope not found"}), 404

    transaction = Transaction.query.filter_by(transaction_id=transaction_id).first()
    if transaction is None:
        logging.error(f"Transaction not found for ID: {transaction_id}")
        return jsonify({"error": "Transaction not found"}), 404

    transaction.envelope_id = envelope.id

    envelope.balance += transaction.amount

    db.session.commit()

    logging.info(f"Transaction '{transaction_id}' added to envelope '{envelope_id}', updated balance: {envelope.balance}")
    
    return jsonify(envelope=envelope.to_dict()), 200

#***** Delete Envelope Route *****#
@envelope_bp.route('/delete', methods=['POST'])
@cross_origin()
def delete_envelope():
    envelope_id = request.json.get('envelope_id')

    envelope = Envelope.query.filter_by(id=envelope_id).first()
    if envelope is None:
        logging.error(f"Envelope not found for ID: {envelope_id}")
        return jsonify({"error": "Envelope not found"}), 404

    db.session.delete(envelope)
    db.session.commit()

    logging.info(f"Envelope '{envelope_id}' deleted")
    
    return jsonify({"message": "Envelope deleted"}), 200

#***** Update Envelope Route *****#
@envelope_bp.route('/update', methods=['POST'])
def update_envelope():
    envelope_id = request.json.get('envelope_id')
    name = request.json.get('name')
    description = request.json.get('description')
    limit = request.json.get('limit')
    balance = request.json.get('balance')

    envelope = Envelope.query.filter_by(id=envelope_id).first()
    if envelope is None:
        logging.error(f"Envelope not found for ID: {envelope_id}")
        return jsonify({"error": "Envelope not found"}), 404

    envelope.name = name
    envelope.description = description
    envelope.limit = limit
    envelope.balance = balance

    db.session.commit()

    logging.info(f"Envelope '{envelope_id}' updated")
    
    return jsonify(envelope=envelope.to_dict()), 200