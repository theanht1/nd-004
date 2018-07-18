from urlparse import urlparse

from flask import url_for

from catalog import db
from catalog.models import Category, User, Item
from catalog.utils.auth_helper import create_jwt_token

ITEMS = [
    {
        'name': 'Board',
        'description': "Board's description",
        'user_id': 1,
        'catalog_id': 1,
    },
    {
        'name': 'Helmet',
        'description': "Helmet's description",
        'user_id': 2,
        'catalog_id': 2,
    }
]


# Helper methods
def seed_db():
    user1 = User(name='user1', email='user1@test.com')
    user2 = User(name='user2', email='user2@test.com')
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    categories_data = [
        {'name': 'Football'},
        {'name': 'Tennis'},
    ]

    for categories in categories_data:
        new_category = Category(name=categories['name'])
        db.session.add(new_category)
    db.session.commit()

    items_data = [
        {'name': 'Ball', 'description': 'Football', 'category_id': 1},
        {'name': 'Net', 'description': 'Football', 'category_id': 1},
        {'name': 'Racket', 'description': 'Tennis', 'category_id': 2},
        {'name': 'Tennis ball', 'description': 'Football', 'category_id': 2},
    ]
    for index, item in enumerate(items_data):
        new_item = Item(name=item['name'], description=item['description'],
                        category_id=item['category_id'], user_id=(index % 2 + 1))
        db.session.add(new_item)
    db.session.commit()


def get_access_token(user):
    return create_jwt_token(user)


def create_items():
    for item in ITEMS:
        new_item = Item(name=item['name'], description=item['description'],
                        user_id=item['user_id'], catalog_id=item['catalog_id'])
        db.session.add(new_item)

    db.session.commit()


def create_item(client, item):
    return client.post(url_for('item.add_new_item'), data=dict(name=item['name'],
                                                               description=item['description'],
                                                               catalog_id=item['catalog_id']))


def edit_item(client, item_id, item):
    return client.post(url_for('item.edit_item', item_id=item_id),
                       data=dict(name=item['name'], description=item['description'],
                                 catalog_id=item['catalog_id']))


def get_redirect_url(response):
    return urlparse(response.location).path

