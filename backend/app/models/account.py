from .. import db # pylint: disable=relative-beyond-top-level

class Account(db.Model):
    __tablename__ = 'accounts'

    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=no-member
    account_id = db.Column(db.String(255), unique=True, nullable=False)  # pylint: disable=no-member
    balance = db.Column(db.Float, nullable=False)  # pylint: disable=no-member
    name = db.Column(db.String(255), nullable=False)  # pylint: disable=no-member
    type = db.Column(db.String(255), nullable=False)  # pylint: disable=no-member
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # pylint: disable=no-member
    institution_id = db.Column(db.Integer, db.ForeignKey('institutions.id'), nullable=False) # pylint: disable=no-member

    transactions = db.relationship('Transaction', backref='account', lazy=True)  # pylint: disable=no-member
