from catalog import db
from catalog.models import Category, Item, User
from helpers import get_access_token


def create_item(client, new_item=None, token=None):
    return client.post('/api/items/', json=new_item, headers={'Authorization': token})


def edit_item(client, item_id, edit_info=None, token=None):
    return client.patch('/api/items/%s/' % item_id, json=edit_info, headers={'Authorization': token})


def delete_item(client, item_id, token=None):
    return client.delete('/api/items/%s/' % item_id, headers={'Authorization': token})


class TestItem(object):
    def test_latest_items(self, client, app):
        with app.app_context():
            items = db.session.query(Item).order_by(Item.created_at.desc())\
                .limit(2).all()

        response = client.get('/api/items/latest/?limit=2')
        data = response.get_json()
        assert response.status_code == 200
        assert 'items' in data and len(data['items']) == len(items)
        assert data['items'][0]['id'] == items[0].id

    def test_get_category_items(self, client, app):
        with app.app_context():
            category = db.session.query(Category).first()
            category_items = category.items

        response = client.get('/api/categories/%s/items/' % category.id)
        data = response.get_json()

        # It should response all items of this categories
        assert response.status_code == 200
        assert 'items' in data and len(data['items']) == len(category_items)
        item_ids = map(lambda item: item.id, category_items)
        response_item_ids = map(lambda item: item['id'], data['items'])
        assert sorted(item_ids) == sorted(response_item_ids)

    def test_get_item(self, client, app):
        with app.app_context():
            item = db.session.query(Item).first()

        response = client.get('/api/items/%s/' % item.id)
        data = response.get_json()

        # It should response item data
        assert response.status_code == 200
        assert 'item' in data and data['item']['id'] == item.id

        # Case not found
        response = client.get('/api/items/%s/' % 100)
        assert response.status_code == 404

    def test_create_item(self, client, app):
        # Prepare testing
        new_item = {'name': 'item', 'description': 'desc', 'user_id': 1, 'category_id': 1}
        with app.app_context():
            user = db.session.query(User).first()
            token = get_access_token(user)

        # Case anonymous user
        response = create_item(client, new_item)
        assert response.status_code == 401

        # Case login user
        response = create_item(client, new_item, token)
        data = response.get_json()
        # New item should be created
        assert response.status_code == 201
        assert 'item' in data and data['item']['name'] == new_item['name']
        with app.app_context():
            db_item = db.session.query(Item).filter(Item.name == new_item['name']).first()
        assert db_item.name == new_item['name']
        assert db_item.description == new_item['description']

        # Case empty input
        response = create_item(client, {}, token)
        assert response.status_code == 400

        # Case duplicated item
        response = create_item(client, new_item, token)
        data = response.get_json()
        # Duplicated item should not be created
        assert response.status_code == 400
        assert 'error' in data

        # Case invalid item info
        new_item['name'] = '  '
        del new_item['category_id']
        response = create_item(client, new_item, token)
        data = response.get_json()
        # Invalid item should not be created
        assert response.status_code == 400
        assert 'error' in data

    def test_edit_item(self, client, app):
        # Prepare testing
        edit_info = {'name': 'edited item', 'description': 'desc', 'category_id': 1}
        with app.app_context():
            item = db.session.query(Item).first()
            other_item = db.session.query(Item)\
                .filter(Item.id != item.id,
                        Item.category_id == item.category_id).first()

            auth_user = item.user
            auth_token = get_access_token(auth_user)
            unauth_user = db.session.query(User).filter(User.id != auth_user.id).first()
            unauth_token = get_access_token(unauth_user)

        # Case anonymous user
        response = edit_item(client, item.id, edit_info)
        assert response.status_code == 401

        # Case unauthorized user
        response = edit_item(client, item.id, edit_info, unauth_token)
        assert response.status_code == 401

        # Case authorized user
        response = edit_item(client, item.id, edit_info, auth_token)
        data = response.get_json()
        assert response.status_code == 200
        assert data['item']['name'] == edit_info['name']
        with app.app_context():
            db_item = Item.get_by_id(item.id)
        assert db_item.name == edit_info['name']

        # Case duplicate item
        edit_info['name'] = other_item.name
        response = edit_item(client, item.id, edit_info, auth_token)
        assert response.status_code == 400

        # Case invalid info
        edit_info['name'] = '  '
        response = edit_item(client, item.id, edit_info, auth_token)
        assert response.status_code == 400
        assert 'error' in response.get_json()

    def test_delete_item(self, client, app):
        # Prepare testing
        with app.app_context():
            item = db.session.query(Item).first()
            auth_user = item.user
            auth_token = get_access_token(auth_user)
            unauth_user = db.session.query(User).filter(User.id != auth_user.id).first()
            unauth_token = get_access_token(unauth_user)

        # Case anonymous user
        response = delete_item(client, item.id)
        assert response.status_code == 401

        # Case unauthorized user
        response = delete_item(client, item.id, unauth_token)
        assert response.status_code == 401

        # Case authorized user
        response = delete_item(client, item.id, auth_token)
        assert response.status_code == 204
        with app.app_context():
            db_item = Item.get_by_id(item.id)
        assert db_item is None
