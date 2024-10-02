from .. import db #pylint: disable=relative-beyond-top-level

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True) # pylint: disable=no-member
    transaction_id = db.Column(db.String(255), unique=True, nullable=False) # pylint: disable=no-member
    name = db.Column(db.String(255), nullable=False) # pylint: disable=no-member
    amount = db.Column(db.Float, nullable=False) # pylint: disable=no-member
    date = db.Column(db.Date, nullable=False) # pylint: disable=no-member
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False) # pylint: disable=no-member
    category = db.Column(db.String(255), nullable=True) # pylint: disable=no-member
    merchant_name = db.Column(db.String(255), nullable=True) # pylint: disable=no-member