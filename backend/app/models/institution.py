from .. import db  # pylint: disable=relative-beyond-top-level

class Institution(db.Model):
    __tablename__ = 'institutions'

    id = db.Column(db.Integer, primary_key=True)  # pylint: disable=no-member
    name = db.Column(db.String(255), nullable=False)  # pylint: disable=no-member
    institution_id = db.Column(db.String, nullable=False)  # pylint: disable=no-member
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # pylint: disable=no-member
    accounts = db.relationship('Account', backref='institution', lazy=True)  # pylint: disable=no-member
