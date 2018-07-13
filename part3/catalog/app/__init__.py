from flask import Flask
from sqlalchemy import create_engine

from app.db import db_session
from app.models import User


def create_app(test_config=None):
    """Application factory"""
    app = Flask(__name__)
    app.secret_key = 'super_secret_key'
    app.debug = True

    # Config for test
    if test_config is not None:
        app.config.update(test_config)

    if 'DB_URI' not in app.config:
        app.config['DB_URI'] = 'sqlite:///catalog_menu.db'

    app.engine = create_engine(app.config['DB_URI'])

    db_session.configure(bind=app.engine)

    from app.controllers import init_controller
    init_controller(app)

    from controllers import catalogs, items, sessions
    app.register_blueprint(sessions.bp)
    app.register_blueprint(catalogs.bp)
    app.register_blueprint(items.bp)

    return app
