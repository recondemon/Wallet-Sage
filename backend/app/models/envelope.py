from .. import db
from datetime import datetime

class Envelope(db.Model):
    __tablename__ = 'envelopes'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    limit = db.Column(db.Integer, nullable=False)
    balance = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    transactions = db.relationship('Transaction', backref='envelope', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'limit': self.limit,
            'balance': self.balance,
            'created_at': self.created_at.isoformat(),
            'user_id': self.user_id
        }