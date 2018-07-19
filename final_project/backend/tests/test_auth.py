import jwt
from flask import current_app

from catalog import db
from catalog.models import User
from catalog.utils.auth_helper import get_user_from_token, create_jwt_token


class TestAuth(object):
    def test_lack_id_token(self, client):
        response = client.post('/api/google-login/')
        assert response.status_code == 400

    def test_invalid_id_token(self, client):
        response = client.post('/api/google-login/', json={'id_token': 'Random_token'})
        assert response.status_code == 401

    def test_valid_id_token(self, client):
        from catalog.utils import auth_helper
        auth_helper.get_user_info = lambda x: {'email': 'test@test.dev', 'name': 'test'}
        response = client.post('/api/google-login/', json={'id_token': 'Valid_token'})
        data = response.get_json()
        # It should return a valid access token
        assert response.status_code == 200
        assert 'access_token' in data and len(data['access_token']) > 0
        assert 'current_user' in data and data['current_user']['name'] == 'test'

    def test_get_current_user(self, client, app):
        with app.app_context():
            user = db.session.query(User).first()
            token = create_jwt_token(user)

        response = client.get('/api/me/', headers={'Authorization': token})
        data = response.get_json()
        assert response.status_code == 200
        assert 'current_user' in data and data['current_user']['id'] == user.id

    def test_jwt_helper(self, app):
        with app.app_context():
            user = db.session.query(User).first()
            token = create_jwt_token(user)

            check_user = get_user_from_token(token)
            assert check_user and check_user.id == user.id

            # Case invalid token
            check_user = get_user_from_token('Invalid token')
            assert check_user is None

            # Case invalid payload
            secret = current_app.config.get('JWT_SECRET')
            invalid_token = jwt.encode({}, secret, algorithm='HS256')
            check_user = get_user_from_token(invalid_token)
            assert  check_user is None
