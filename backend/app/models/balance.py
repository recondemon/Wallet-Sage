from .. import db #pylint: disable=relative-beyond-top-level
from datetime import datetime

class Balance(db.Model):
    __tablename__ = 'balances'

    id = db.Column(db.Integer, primary_key=True)
    # Available balance of account:
    available = db.Column(db.Float, nullable=True)
    # Current balance of account:
    current = db.Column(db.Float, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    # Plaid account id:
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

