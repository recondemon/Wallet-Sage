import click
from flask import Flask
from flask.cli import with_appcontext
from app.seeds.demo_account_seeds import seed_demo_user

def register_commands(app: Flask):
    @app.cli.command("seed")
    @click.argument("option")
    @with_appcontext
    def seed(option):
        """Seeds the database. Use 'all' as an option to seed everything."""
        if option == "all":
            click.echo("Seeding all data...")
            seed_demo_user()
            click.echo("Seeding completed.")
        else:
            click.echo("Invalid seed option. Use 'all' to seed everything.")