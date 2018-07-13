import json

from flask import url_for

from app.db import db_session
from app.models import Catalog
from helpers import ITEMS, create_items


def test_main_page(client, app):
    with app.test_request_context():
        response = client.get(url_for('catalog.home_page'))
        data = response.data

        assert response.status_code == 200
        # Our seed data should be in page
        assert 'Skating' in data and 'Hockey' in data

        create_items()
        response = client.get(url_for('catalog.home_page'))
        data = response.data

        # Items should in page
        assert ITEMS[0]['name'] in data and ITEMS[1]['name'] in data
        # New items should appear from latest
        assert data.find(ITEMS[0]['name']) > data.find(ITEMS[1]['name'])


def test_catalog_items_page(client, app):
    create_items()
    catalog = db_session.query(Catalog).first()
    with app.test_request_context():
        response = client.get(url_for('catalog.catalog_items', catalog_id=catalog.id))
        data = response.data

        # Board should in the item list
        assert ITEMS[0]['name'] in data
        # Helmet should not in the item list
        assert not ITEMS[1]['name'] in data


def test_catalogs_json(client, app):
    catalogs = Catalog.get_all()
    with app.test_request_context():
        response = client.get(url_for('catalog.catalogs_json'))
        data = json.loads(response.data)

        # It should render item list
        assert len(data) == len(catalogs)
        for index in range(len(data)):
            assert data[index]['id'] == catalogs[index].id
            assert data[index]['name'] == catalogs[index].name


def test_catalog_items_json(client, app):
    create_items()
    catalog = db_session.query(Catalog).first()
    items = catalog.items
    with app.test_request_context():
        response = client.get(url_for('catalog.catalog_items_json', catalog_id=catalog.id))
        data = json.loads(response.data)

        # It should render item list
        assert len(data) == len(items)
        for index in range(len(data)):
            assert data[index]['id'] == items[index].id
