from flask import Flask
from os import environ

from catalog.db import db
from config import production, test, development


def create_app(cfg=None):
    app = Flask(__name__)

    load_config(app, cfg)
    db.init_app(app)

    @app.route('/')
    def hello_world():
        return 'Hello World!'

    return app


def load_config(app, cfg):
    # Load app config
    if environ.get('FLASK_ENV') == 'production':
        app.config.from_object(production)
    elif environ.get('FLASK_ENV') == 'test':
        app.config.from_object(test)
    else:
        app.config.from_object(development)

    if cfg is not None:
        app.config.from_pyfile(cfg)
