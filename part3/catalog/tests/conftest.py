import os
import pytest

from app import create_app
from app.models import Catalog, User
from app.db import db_session, init_db
from flask import g


@pytest.fixture
def app():
    test_db = 'sqlite:///test.db'
    catalog_app = create_app({'DB_URI': test_db})
    # Init test db
    with catalog_app.app_context():
        init_db(catalog_app)
        seed_db()
        g.test = 'asdasd'

    yield catalog_app

    os.remove('test.db')


@pytest.fixture
def client(app):
    return app.test_client()


def seed_db():
    user1 = User(name='user1', email='user1@test.com')
    user2 = User(name='user2', email='user2@test.com')
    db_session.add(user1)
    db_session.add(user2)
    db_session.commit()

    catalog_datas = [
        {'name': 'Skating'},
        {'name': 'Hockey'},
    ]

    for catalog in catalog_datas:
        new_catalog = Catalog(name=catalog['name'])
        db_session.add(new_catalog)

    db_session.commit()
