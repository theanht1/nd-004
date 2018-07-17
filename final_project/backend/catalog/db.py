from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils import database_exists, create_database

db = SQLAlchemy()

from catalog.models import Category, User, Item


def init_db():
    """Initialize database, must run in an app context"""

    # Create db if not exist
    if not database_exists(db.get_engine().url):
        create_database(db.get_engine().url)

    # Drop all tables
    db.drop_all()
    # Create tables
    db.create_all()


def seed():
    """Create some default categories"""
    # Seed some default categories
    categories = [
        {'name': 'Football'},
        {'name': 'Baseball'},
        {'name': 'Basketball'},
        {'name': 'Snowboarding'},
        {'name': 'Skating'},
        {'name': 'Hockey'},
    ]

    for category in categories:
        new_category = Category(name=category['name'])
        db.session.add(new_category)

    db.session.commit()
