from flask import Blueprint, jsonify, request
from ..models.user import User
from ..models.envelope import Envelope
from .. import db
from datetime import datetime
import logging

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