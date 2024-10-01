from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    from app.routes.user_routes import user_bp
    from app.routes.account_routes import account_bp
    from app.routes.envelope_routes import envelope_bp
    from app.routes.savings_goal_routes import savings_goal_bp

    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(account_bp, url_prefix='/api/accounts')
    app.register_blueprint(envelope_bp, url_prefix='/api/envelopes')
    app.register_blueprint(savings_goal_bp, url_prefix='/api/savings-goals')

    return app