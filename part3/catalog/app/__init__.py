from flask import Flask, g, session

# app = Flask(__name__)

# from controllers import *
from app.db import db_session
from app.models import User


def create_app(app_config):
    app = Flask(__name__)
    app.secret_key = 'super_secret_key'
    app.debug = True

    from app.controllers import init_controller
    init_controller(app)

    from controllers import catalogs, items, sessions
    app.register_blueprint(sessions.bp)
    app.register_blueprint(catalogs.bp)
    app.register_blueprint(items.bp)

    return app
