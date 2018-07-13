import json

from flask import url_for, g
from helpers import edit_item, ITEMS, create_items, create_item, get_redirect_url

from app.db import db_session
from app.models import CatalogItem, User


def test_item_page(client):
    create_items()
    response = client.get('/catalogs/items/1/')
    data = response.data
    # Board should in the item list
    assert ITEMS[0]['name'] in data


def test_item_page_json(client, app):
    create_items()
    item = db_session.query(CatalogItem).first()
    with app.test_request_context():
        response = client.get(url_for('item.get_item_json', item_id=item.id))
        data = json.loads(response.data)

        # It should render item list
        assert item.id == data['id'] and item.name == data['name']


def test_create_items(client, app):
    user = db_session.query(User).first()
    with app.test_request_context():
        # Case unauthorized user
        response = create_item(client, ITEMS[0])
        redirect_url = get_redirect_url(response)
        # It should redirect to home page
        assert redirect_url == url_for('auth.login')

        # Case authorized user
        g.current_user = user

        response = client.get(url_for('item.add_new_item'))
        # It should have a form
        assert 'form' in response.data

        response = create_item(client, ITEMS[0])
        redirect_url = get_redirect_url(response)

        assert response.status_code == 302
        assert redirect_url == url_for('item.get_item', item_id=1)

        # Case invalid form
        items_before = db_session.query(CatalogItem).all()
        response = create_item(client, {'name': ' ', 'description': '', 'catalog_id': 1})
        items_after = db_session.query(CatalogItem).all()
        # Item should not be added
        assert len(items_before) == len(items_after)
        # It should response at current path
        assert not response.location


def test_delete_items(client, app):
    create_items()
    item = db_session.query(CatalogItem).first()
    user = item.user
    with app.test_request_context():

        # Case unauthorized user
        g.current_user = None
        client.post(url_for('item.delete_item', item_id=item.id))
        # Item should not be delete
        assert CatalogItem.get_by_id(item.id) is not None

        g.current_user = user
        response = client.get(url_for('item.delete_item', item_id=item.id))
        # It should response form
        assert response.status_code == 200
        assert 'form' in response.data

        # Case authorized user
        response = client.post(url_for('item.delete_item', item_id=item.id))
        # It should redirect to home
        assert response.status_code == 302
        # Item should be delete
        assert CatalogItem.get_by_id(item.id) is None


def test_edit_items(client, app):
    create_items()
    item = db_session.query(CatalogItem).first()
    user = item.user
    with app.test_request_context():
        g.current_user = user

        # Case get form
        response = client.get(url_for('item.edit_item', item_id=item.id))
        assert response.status_code == 200
        # Response should have item's info
        assert item.name in response.data

        # Case edit invalid form
        response = edit_item(client, item.id, {'name': ' ', 'description': '', 'catalog_id': 1})
        # It should not update and render current from
        assert response.location is None

        # Case edit success
        edit_item(client, item.id, ITEMS[1])
        edited_item = CatalogItem.get_by_id(item.id)
        assert (edited_item.name == ITEMS[1]['name']
                and edited_item.description == ITEMS[1]['description'])
