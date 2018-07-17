import os
import pytest

from flask import g

from catalog import create_app
from catalog.db import init_db
from helpers import seed_db


@pytest.fixture
def app():
    os.environ['FLASK_ENV'] = 'test'
    test_app = create_app()
    # Init test db
    with test_app.app_context():
        init_db()
        seed_db()

    yield test_app


@pytest.fixture
def client(app):
    return app.test_client()
