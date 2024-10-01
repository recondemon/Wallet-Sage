from flask import Blueprint, jsonify, request
from ..models.envelope import Envelope
from .. import db

envelope_bp = Blueprint('envelope', __name__)

@envelope_bp.route('/')
def index():
    return 'Envelope Blueprint'