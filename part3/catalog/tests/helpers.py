from urlparse import urlparse

from flask import url_for

from app import db_session
from app.models import CatalogItem

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
def create_items():
    for item in ITEMS:
        new_item = CatalogItem(name=item['name'], description=item['description'],
                               user_id=item['user_id'], catalog_id=item['catalog_id'])
        db_session.add(new_item)

    db_session.commit()


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

