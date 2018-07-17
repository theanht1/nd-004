from os import environ

import jwt

from catalog.models import User

SECRET = environ.get('JWT_SECRET') or 'secret'


def create_jwt_token(user):
    """Create authorization token for user
    :param user:
    :return: token string
    """
    return jwt.encode({'user_id': user.id}, SECRET, algorithm='HS256')


def get_user_from_token(token):
    """Validate token and retrieve user from token
    :param token: str
    :return: a User or None
    """
    payload = jwt.decode(token, SECRET, algorithms=['HS256'])
    if payload and payload['user_id']:
        return User.get_by_id(payload['user_id'])
    return None
