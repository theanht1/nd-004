from catalog import create_app
from catalog.db import db
from catalog.models import User, Category, Item


app = create_app()
with app.app_context():
    # Create database
    db.drop_all()
    db.create_all()

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
