from flask import Blueprint, jsonify, request
from app.models import User, Account, Institution, Balance, Transaction
from .. import db
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.country_code import CountryCode
from plaid.model.products import Products
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.accounts_get_request import AccountsGetRequest
from plaid.model.institutions_get_by_id_request import InstitutionsGetByIdRequest
from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from app import plaid_client
from sqlalchemy import Enum
from enum import Enum as PyEnum
import traceback
import logging
import uuid
import plaid
from flask_cors import cross_origin
from datetime import datetime, timedelta



class AccountSubtype(Enum):
    CHECKING = "checking"
    SAVINGS = "savings"
    CREDIT = "credit"
    LOAN = "loan"
    UNKNOWN = "unknown"


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

    link_token_user = LinkTokenCreateRequestUser(client_user_id=str(user_uid))

    request_data = LinkTokenCreateRequest(
        user=link_token_user,
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

    logging.info(f"Received public token: {public_token} for user: {user_uid}")

    user = User.query.filter_by(uid=user_uid).first()
    if user is None:
        logging.error(f"User not found for UID: {user_uid}")
        return jsonify({"error": "User not found"}), 404

    try:
        exchange_response = plaid_client.item_public_token_exchange(ItemPublicTokenExchangeRequest(public_token=public_token))
        access_token = exchange_response['access_token']
        logging.info(f"Public token exchanged for access token for user {user_uid}")
        available_products = exchange_response.get('available_products', [])
        logging.info(f"Available products in exchanged token: {available_products}")
        user.plaid_access_token = access_token
        db.session.commit()

        logging.info(f"Access token stored for user {user_uid}")
        return jsonify({"status": "success"})
    except Exception as e:
        logging.error(f"Error exchanging public token: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

#! ---- TODO: Seperate Route Logic ----
#! 1. Fetch accounts for adding new accounts, ignoring existing accounts
#! 2. Fetch balances for updating existing balances
#! 3. Fetch transactions for updating existing transactions
#! ---------------------------------------------------------------------

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

        # Constructing the correct AccountsGetRequest object
        accounts_request = AccountsGetRequest(access_token=access_token)
        logging.info(f"Accounts request being sent: {accounts_request}")

        # Fetching the accounts from Plaid using the valid request
        accounts_response = plaid_client.accounts_get(accounts_request)

        # Check for invalid products in the response
        if 'signal' in accounts_response.get('available_products', []):
            logging.error("Invalid product 'signal' found in the available products.")
            return jsonify({"error": "Invalid product 'signal' found in available products."}), 400

        logging.info(f"Plaid accounts response: {accounts_response}")

        institutions = []
        accounts = []

        institution_id = accounts_response['item'].get('institution_id')
        institution_name = 'Unknown Institution'

        if institution_id:
            logging.info(f"Fetching institution details for ID: {institution_id}")

            institution_response = plaid_client.institutions_get_by_id(
                InstitutionsGetByIdRequest(
                    institution_id=institution_id, 
                    country_codes=[CountryCode('US')]
                )
            )
            institution_name = institution_response.institution.name
            logging.info(f"Institution name: {institution_name}")

            institution = Institution.query.filter_by(institution_id=institution_id).first()
            if not institution:
                institution = Institution(
                    name=institution_name,
                    institution_id=institution_id,
                    user_id=user.id
                )
                db.session.add(institution)
                db.session.flush()

            if not any(inst['institution_id'] == institution_id for inst in institutions):
                institutions.append({
                    'institution_id': institution_id,
                    'name': institution_name
                })

        for account in accounts_response['accounts']:
            account_institution_id = getattr(account, 'institution_id', institution_id)

            if not account_institution_id:
                logging.warning(f"Institution ID missing for account {account['account_id']}")
                account_institution_id = str(uuid.uuid4())

                institution = Institution.query.filter_by(name='Unknown Institution', user_id=user.id).first()
                if not institution:
                    institution = Institution(
                        name='Unknown Institution',
                        institution_id=account_institution_id,
                        user_id=user.id
                    )
                    db.session.add(institution)
                    db.session.flush()
            else:
                logging.info(f"Fetching institution details for account institution ID: {account_institution_id}")
                institution_response = plaid_client.institutions_get_by_id(
                    InstitutionsGetByIdRequest(
                        institution_id=account_institution_id,
                        country_codes=[CountryCode('US')]
                    )
                )
                account_institution_name = institution_response.institution.name
                logging.info(f"Institution name for account: {account_institution_name}")

                institution = Institution.query.filter_by(institution_id=account_institution_id).first()
                if not institution:
                    institution = Institution(
                        name=account_institution_name,
                        institution_id=account_institution_id,
                        user_id=user.id
                    )
                    db.session.add(institution)
                    db.session.flush()

                if not any(inst['institution_id'] == account_institution_id for inst in institutions):
                    institutions.append({
                        'institution_id': account_institution_id,
                        'name': account_institution_name
                    })

            account_type = str(account['subtype']) if account['subtype'] else 'unknown'
            balance = account['balances']['current'] if account['balances']['current'] else 0.0

            existing_account = Account.query.filter_by(account_id=account['account_id']).first()
            if existing_account:
                existing_account.balance = balance
                existing_account.name = account['name']
                existing_account.type = account_type
                existing_account.institution_id = institution.id
            else:
                account_model = Account(
                    account_id=account['account_id'],
                    balance=balance,
                    name=account['name'],
                    type=account_type,
                    user_id=user.id,
                    institution_id=institution.id
                )
                db.session.add(account_model)

            accounts.append({
                'account_id': account['account_id'],
                'name': account['name'],
                'type': account_type,
                'balance': balance,
                'institution_name': institution.name
            })

        db.session.commit()

        return jsonify({
            'status': 'success',
            'institutions': institutions,
            'accounts': accounts
        })

    except plaid.ApiException as e:
        logging.error(f"Plaid API error: {str(e)}")
        return jsonify({"error": f"Plaid API error: {str(e)}"}), 500
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

#**** Check if user has accounts ****#
@plaid_bp.route('/check_accounts', methods=['POST'])
def check_accounts():
    user_uid = request.json.get('user_id')
    
    logging.info(f"Checking accounts for user: {user_uid}")

    user = User.query.filter_by(uid=user_uid).first()
    if user is None:
        logging.error(f"User not found for UID: {user_uid}")
        return jsonify({"error": "User not found"}), 404

    accounts_exist = Account.query.filter_by(user_id=user.id).count() > 0

    return jsonify({"hasAccounts": accounts_exist})


#**** Refresh accounts from Plaid ****#
@plaid_bp.route('/refresh_accounts', methods=['POST'])
def refresh_accounts():
    user_uid = request.json.get('user_id')

    logging.info(f"Refreshing accounts for user: {user_uid}")

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

        logging.info(f"Plaid accounts response: {accounts_response}")

        institutions = []
        accounts = []

        institution_id = accounts_response['item'].get('institution_id')
        institution_name = 'Unknown Institution'

        if institution_id:
            logging.info(f"Fetching institution details for ID: {institution_id}")
            institution_response = plaid_client.institutions_get_by_id(
                InstitutionsGetByIdRequest(
                    institution_id=institution_id, 
                    country_codes=[CountryCode('US')]
                )
            )
            institution_name = institution_response.institution.name
            logging.info(f"Institution name: {institution_name}")

            institution = Institution.query.filter_by(institution_id=institution_id).first()
            if not institution:
                institution = Institution(
                    name=institution_name,
                    institution_id=institution_id,
                    user_id=user.id
                )
                db.session.add(institution)
                db.session.flush()

            if not any(inst['institution_id'] == institution_id for inst in institutions):
                institutions.append({
                    'institution_id': institution_id,
                    'name': institution_name
                })

        for account in accounts_response['accounts']:
            account_institution_id = getattr(account, 'institution_id', institution_id)

            if not account_institution_id:
                logging.warning(f"Institution ID missing for account {account['account_id']}")
                account_institution_id = str(uuid.uuid4())

                institution = Institution.query.filter_by(name='Unknown Institution', user_id=user.id).first()
                if not institution:
                    institution = Institution(
                        name='Unknown Institution',
                        institution_id=account_institution_id,
                        user_id=user.id
                    )
                    db.session.add(institution)
                    db.session.flush()
            else:
                logging.info(f"Fetching institution details for account institution ID: {account_institution_id}")
                institution_response = plaid_client.institutions_get_by_id(
                    InstitutionsGetByIdRequest(
                        institution_id=account_institution_id,
                        country_codes=[CountryCode('US')]
                    )
                )
                account_institution_name = institution_response.institution.name
                logging.info(f"Institution name for account: {account_institution_name}")

                institution = Institution.query.filter_by(institution_id=account_institution_id).first()
                if not institution:
                    institution = Institution(
                        name=account_institution_name,
                        institution_id=account_institution_id,
                        user_id=user.id
                    )
                    db.session.add(institution)
                    db.session.flush()

                if not any(inst['institution_id'] == account_institution_id for inst in institutions):
                    institutions.append({
                        'institution_id': account_institution_id,
                        'name': account_institution_name
                    })

            account_type = str(account['subtype']) if account['subtype'] else 'unknown'
            balance = account['balances']['current'] if account['balances']['current'] else 0.0

            existing_account = Account.query.filter_by(account_id=account['account_id']).first()
            if existing_account:
                existing_account.balance = balance
                existing_account.name = account['name']
                existing_account.type = account_type
                existing_account.institution_id = institution.id
            else:
                account_model = Account(
                    account_id=account['account_id'],
                    balance=balance,
                    name=account['name'],
                    type=account_type,
                    user_id=user.id,
                    institution_id=institution.id
                )
                db.session.add(account_model)

            accounts.append({
                'account_id': account['account_id'],
                'name': account['name'],
                'type': account_type,
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
        logging.error(f"Error refreshing accounts: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    
#******** Fetch transactions from Plaid ********#
@plaid_bp.route('/fetch_transactions', methods=['POST'])
@cross_origin()
def fetch_transactions():
    user_id = request.json.get('user_id')

    logging.info(f"Fetching transactions for user: {user_id}")

    # Fetch the user from the database
    user = User.query.filter_by(uid=user_id).first()
    if user is None:
        logging.error(f"User not found for UID: {user_id}")
        return jsonify({"error": "User not found"}), 404

    access_token = user.plaid_access_token
    if not access_token:
        logging.error(f"No Plaid access token found for user {user_id}")
        return jsonify({"error": "No Plaid access token found for user"}), 400

    try:
        # Fetch the date range for transactions
        start_date = (datetime.now() - timedelta(days=30)).date()
        end_date = datetime.now().date()

        # Get all accounts for the user
        accounts = Account.query.filter_by(user_id=user.id).all()
        if not accounts:
            logging.error(f"No accounts found for user {user_id}")
            return jsonify({"error": "No accounts found for user"}), 400

        transactions_to_add = []
        for account in accounts:
            # Fetch transactions from Plaid
            transactions_request = TransactionsGetRequest(
                access_token=access_token,
                start_date=start_date,
                end_date=end_date
            )
            transactions_response = plaid_client.transactions_get(transactions_request)
            transactions = transactions_response['transactions']

            logging.info(f"Transactions fetched for account {account.account_id}: {transactions}")

            # Check and update or insert transactions
            for transaction in transactions:
                existing_transaction = Transaction.query.filter_by(transaction_id=transaction['transaction_id']).first()

                if existing_transaction:
                    # If the transaction exists, update its fields
                    existing_transaction.name = transaction['name']
                    existing_transaction.amount = transaction['amount']
                    existing_transaction.date = transaction['date']
                    existing_transaction.category = ', '.join(transaction['category']) if transaction.get('category') else None
                    existing_transaction.merchant_name = transaction.get('merchant_name', None)
                    db.session.add(existing_transaction)  # Mark as updated
                else:
                    # If it's a new transaction, create and prepare for insertion
                    transaction_model = Transaction(
                        transaction_id=transaction['transaction_id'],
                        name=transaction['name'],
                        amount=transaction['amount'],
                        date=transaction['date'],
                        account_id=account.id,
                        envelope_id=None,  # Adjust if envelope logic is needed
                        category=', '.join(transaction['category']) if transaction.get('category') else None,
                        merchant_name=transaction.get('merchant_name', None)
                    )
                    transactions_to_add.append(transaction_model)

        # If there are new transactions to add, bulk insert them
        if transactions_to_add:
            db.session.add_all(transactions_to_add)

        # Commit both updates to existing transactions and new transactions
        db.session.commit()

        # Fetch updated transactions and return them
        updated_transactions = Transaction.query.join(Account).filter(Account.user_id == user.id).all()

        return jsonify({
            'status': 'success',
            'transactions': [t.to_dict() for t in updated_transactions]
        }), 200

    except plaid.ApiException as e:
        logging.error(f"Plaid API error: {str(e)}")
        return jsonify({"error": f"Plaid API error: {str(e)}"}), 500
    except Exception as e:
        logging.error(f"Error fetching transactions: {str(e)}")
        logging.error(traceback.format_exc())
        db.session.rollback()  # Rollback in case of error
        return jsonify({"error": str(e)}), 500










