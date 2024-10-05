from .. import db #pylint: disable=relative-beyond-top-level
from datetime import datetime

class Envelope(db.Model):
    __tablename__ = 'envelopes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    limit = db.Column(db.Integer, nullable=False)
    balance = db.Column(db.Integer, nullable=False)
    transactions = db.relationship('Transaction', backref='envelope', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', backref='envelopes', lazy=True)