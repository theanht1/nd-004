from flask import session, g

from app.models import User
from app.db import db_session


def init_controller(app):
    @app.before_request
    def before_request():
        user_id = session.get('user_id')
        if user_id:
            g.current_user = db_session.query(User).filter(User.id == user_id).first()

        if not hasattr(g, 'current_user'):
            g.current_user = None

    @app.teardown_request
    def remove_session(exception=None):
        db_session.remove()