from flask import Blueprint, jsonify, request
from app.models import User, Account, Institution, Balance
from .. import db
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest
from app import plaid_client
import traceback
import logging
import uuid

plaid_bp = Blueprint('plaid', __name__)

@plaid_bp.route('/')
def index():
    logging.info("Plaid index route accessed")
    return 'Plaid Blueprint'

#**** Create a Link Token ****#
@plaid_bp.route('/create_link_token', methods=['POST'])
def create_link_token():
    user_uid = request.json.get('user_id')
    logging.info(f"Creating link token for user: {user_uid}")

    user = User.query.filter_by(uid=user_uid).first()
    if user is None:
        logging.error(f"User not found for UID: {user_uid}")
        return jsonify({"error": "User not found"}), 404

    request_data = LinkTokenCreateRequest(
        user={
            'client_user_id': str(user_uid),
        },
        client_name='Wallet Sage',
        products=[Products('auth'), Products('transactions')],
        country_codes=[CountryCode('US')],
        language='en',
    )

    try:
        link_token_response = plaid_client.link_token_create(request_data)
        logging.info(f"Link token created for user {user_uid}")
        return jsonify(link_token=link_token_response['link_token'])
    except Exception as e:
        logging.error(f"Error creating link token: {str(e)}")
        return jsonify({"error": str(e)}), 500

#**** Exchange Public Token and Store Access Token ****#
@plaid_bp.route('/exchange_public_token', methods=['POST'])
def exchange_public_token():
    public_token = request.json.get('public_token')
    user_uid = request.json.get('user_id')

    logging.info(f"Exchanging public token for user: {user_uid}")

    user = User.query.filter_by(uid=user_uid).first()
    if user is None:
        logging.error(f"User not found for UID: {user_uid}")
        return jsonify({"error": "User not found"}), 404

    try:
        exchange_response = plaid_client.item_public_token_exchange(ItemPublicTokenExchangeRequest(public_token=public_token))
        access_token = exchange_response['access_token']
        logging.info(f"Public token exchanged for access token for user {user_uid}")

        user.plaid_access_token = access_token
        db.session.commit()

        logging.info(f"Access token stored for user {user_uid}")
        return jsonify({"status": "success"})
    except Exception as e:
        logging.error(f"Error exchanging public token: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

#**** Fetch accounts from Plaid ****#
@plaid_bp.route('/fetch_accounts', methods=['POST'])
def fetch_accounts():
    user_uid = request.json.get('user_id')

    logging.info(f"Fetching accounts for user: {user_uid}")

    user = User.query.filter_by(uid=user_uid).first()
    if user is None:
        logging.error(f"User not found for UID: {user_uid}")
        return jsonify({"error": "User not found"}), 404

    access_token = user.plaid_access_token
    if not access_token:
        logging.error(f"No Plaid access token found for user {user_uid}")
        return jsonify({"error": "No Plaid access token found for user"}), 400

    try:
        logging.info(f"Fetching accounts from Plaid with access token: {access_token}")
        accounts_response = plaid_client.accounts_get(AccountsGetRequest(access_token=access_token))

        institutions = []
        accounts = []

        for account in accounts_response['accounts']:
            institution_id = getattr(account, 'institution_id', None)

            if institution_id:
                logging.info(f"Fetching institution details for ID: {institution_id}")
                institution_response = plaid_client.institutions_get_by_id(InstitutionsGetByIdRequest(institution_id=institution_id))
                institution_name = institution_response.institution.name

                institution = Institution.query.filter_by(institution_id=institution_id).first()

                if not institution:
                    institution = Institution(
                        name=institution_name,
                        institution_id=institution_id,
                        user_id=user.id
                    )
                    db.session.add(institution)
                    db.session.flush()

                institutions.append({
                    'institution_id': institution.institution_id,
                    'name': institution_name
                })

            else:
                logging.warning(f"Institution ID missing for account {account.account_id}")

                generated_institution_id = str(uuid.uuid4())

                institution = Institution.query.filter_by(name='Unknown Institution', user_id=user.id).first()

                if not institution:
                    institution = Institution(
                        name='Unknown Institution',
                        institution_id=generated_institution_id,
                        user_id=user.id
                    )
                    db.session.add(institution)
                    db.session.flush()

                institutions.append({
                    'institution_id': generated_institution_id,
                    'name': 'Unknown Institution'
                })

            balance = account.balances.current if account.balances.current is not None else 0.0

            account_model = Account(
                account_id=account.account_id,
                balance=balance,
                name=account.name,
                type=str(account.subtype),
                user_id=user.id,
                institution_id=institution.id
            )
            db.session.add(account_model)

            accounts.append({
                'account_id': account.account_id,
                'name': account.name,
                'type': str(account.subtype),
                'balance': balance,
                'institution_name': institution.name
            })

        db.session.commit()

        return jsonify({
            'status': 'success',
            'institutions': institutions,
            'accounts': accounts
        })

    except Exception as e:
        logging.error(f"Error fetching accounts: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500



#**** Fetch balances from Plaid ****#
@plaid_bp.route('/fetch_balances', methods=['POST'])
def fetch_balances():
    user_uid = request.json.get('user_id')

    logging.info(f"Fetching balances for user: {user_uid}")

    user = User.query.filter_by(uid=user_uid).first()
    if user is None:
        logging.error(f"User not found for UID: {user_uid}")
        return jsonify({"error": "User not found"}), 404

    access_token = user.plaid_access_token
    if not access_token:
        logging.error(f"No Plaid access token found for user {user_uid}")
        return jsonify({"error": "No Plaid access token found for user"}), 400

    try:
        logging.info(f"Fetching balances from Plaid with access token: {access_token}")
        balance_response = plaid_client.accounts_balance_get(AccountsBalanceGetRequest(access_token=access_token))

        for account in balance_response['accounts']:
            account_model = Account.query.filter_by(account_id=account.account_id).first()
            balance_model = Balance(
                available=account.balances.available,
                current=account.balances.current,
                account_id=account_model.id
            )
            db.session.add(balance_model)

        db.session.commit()

        logging.info(f"Balances stored for user {user_uid}")
        return jsonify({"status": "success"})

    except Exception as e:
        logging.error(f"Error fetching balances: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
