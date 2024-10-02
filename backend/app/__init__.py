import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from plaid.api import plaid_api
from plaid.model import *
from plaid.configuration import Configuration
from plaid.api_client import ApiClient
import logging

db = SQLAlchemy()
migrate = Migrate()

def create_plaid_client():
    configuration = Configuration(
        host="https://sandbox.plaid.com",
        api_key={
            'clientId': os.getenv('PLAID_CLIENT_ID'),
            'secret': os.getenv('PLAID_SECRET'),
        }
    )
    api_client = ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)

plaid_client = create_plaid_client()  

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    configure_logging(app)

    with app.app_context():
        from app.routes.user_routes import user_bp
        from app.routes.plaid_routes import plaid_bp
        
        app.register_blueprint(user_bp, url_prefix='/api/users')
        app.register_blueprint(plaid_bp, url_prefix='/api/plaid')
    return app

def configure_logging(app):

    logging.basicConfig(level=logging.DEBUG,  
                        format='%(asctime)s %(levelname)s: %(message)s',
                        handlers=[
                            logging.StreamHandler(),
                            logging.FileHandler('app.log', mode='a')
                        ])

    error_handler = logging.FileHandler('error.log', mode='a')
    error_handler.setLevel(logging.ERROR)
    app.logger.addHandler(error_handler)

    app.logger.setLevel(logging.DEBUG)

    return app