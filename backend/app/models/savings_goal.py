from .. import db #pylint: disable=relative-beyond-top-level

class SavingsGoal(db.Model):
    __tablename__ = 'savings_goals'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    goal = db.Column(db.Integer, nullable=False)
    balance = db.Column(db.Integer, nullable=False)
    account = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', backref='savings_goals', lazy=True)