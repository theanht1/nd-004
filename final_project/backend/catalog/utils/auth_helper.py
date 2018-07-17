import jwt
import requests
from flask import current_app

from catalog.models import User


def create_jwt_token(user):
    """Create authorization token for user
    :param user:
    :return: token string
    """
    secret = current_app.config.get('JWT_SECRET')
    return jwt.encode({'user_id': user.id}, secret, algorithm='HS256')


def get_user_from_token(token):
    """Validate token and retrieve user from token
    :param token: str
    :return: a User or None
    """
    secret = current_app.config.get('JWT_SECRET')
    payload = jwt.decode(token, secret, algorithms=['HS256'])
    if payload and payload['user_id']:
        return User.get_by_id(payload['user_id'])
    return None


def get_user_info(id_token):
    """ Check Google ID token valid and return user info
    :param id_token: str
    :return: bool
    """
    url = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
    params = {'id_token': id_token, 'alt': 'json'}
    result = requests.get(url, params=params)

    print(result.content)
    if result.status_code != 200:
        return False

    data = result.json()

    # Verify that the access token is valid for this app
    if not data.get('azp') or data.get('azp') != current_app.config.get('GOOGLE_CLIENT_ID'):
        return False

    return data
