# app/seeds/demo_account_seeds.py

def seed_demo_user():
    from app import db  # Import db inside the function to avoid circular import
    from app.models import Institution, Account  # Import your models here too

    user_id = 1  # Demo user ID

    # Create manual institutions
    institutions = [
        Institution(
            id=1,
            name="Acme Bank",
            institution_id="inst_123456",
            user_id=user_id
        ),
        Institution(
            id=2,
            name="Global Credit Union",
            institution_id="inst_654321",
            user_id=user_id
        ),
        Institution(
            id=3,
            name="Alpha Savings",
            institution_id="inst_987654",
            user_id=user_id
        )
    ]

    # Add the institutions to the session
    db.session.add_all(institutions)
    db.session.flush()  # This ensures we get the institution IDs after inserting them

    # Create manual accounts for each institution
    accounts = [
        # Accounts for Institution 1 (Acme Bank)
        Account(
            id=1,
            account_id="acc_001",
            balance=2500.00,
            name="Acme Checking",
            type="Checking",
            user_id=user_id,
            institution_id=1
        ),
        Account(
            id=2,
            account_id="acc_002",
            balance=5000.00,
            name="Acme Savings",
            type="Savings",
            user_id=user_id,
            institution_id=1
        ),
        # Accounts for Institution 2 (Global Credit Union)
        Account(
            id=3,
            account_id="acc_003",
            balance=3200.00,
            name="Global Credit Checking",
            type="Checking",
            user_id=user_id,
            institution_id=2
        ),
        Account(
            id=4,
            account_id="acc_004",
            balance=15000.00,
            name="Global Credit Savings",
            type="Savings",
            user_id=user_id,
            institution_id=2
        ),
        # Accounts for Institution 3 (Alpha Savings)
        Account(
            id=5,
            account_id="acc_005",
            balance=6000.00,
            name="Alpha High Yield",
            type="Savings",
            user_id=user_id,
            institution_id=3
        ),
        Account(
            id=6,
            account_id="acc_006",
            balance=800.00,
            name="Alpha Loan Account",
            type="Loan",
            user_id=user_id,
            institution_id=3
        ),
    ]

    # Add the accounts to the session
    db.session.add_all(accounts)

    # Commit the data to the database
    db.session.commit()

    print("Seeded demo user with institutions and accounts.")