from .. import db

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(255), unique=True, nullable=False)
    name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    envelope_id = db.Column(db.Integer, db.ForeignKey('envelopes.id'), nullable=True)
    category = db.Column(db.String(255), nullable=True)
    merchant_name = db.Column(db.String(255), nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'transaction_id': self.transaction_id,
            'name': self.name,
            'amount': self.amount,
            'date': self.date.isoformat(),
            'account_id': self.account_id,
            'envelope_id': self.envelope_id,
            'category': self.category,
            'merchant_name': self.merchant_name
        }