from flask import g, request

from catalog.utils.auth_helper import get_user_from_token


def init_controller(app):
    @app.before_request
    def before_request():
        g.current_user = None
        auth_token = request.headers.get('Authorization')
        if auth_token:
            g.current_user = get_user_from_token(auth_token)
