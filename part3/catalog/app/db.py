from flask import _app_ctx_stack
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

db_session = scoped_session(sessionmaker(), scopefunc=_app_ctx_stack.__ident_func__)

Base = declarative_base()
Base.query = db_session.query_property()


def init_db(catalog_app):
    Base.metadata.create_all(bind=catalog_app.engine)


def seed():
    catalogs = [
        {'name': 'Football'},
        {'name': 'Baseball'},
        {'name': 'Basketball'},
        {'name': 'Snowboarding'},
        {'name': 'Skating'},
        {'name': 'Hockey'},
    ]

    from app.models import Catalog

    for catalog in catalogs:
        new_catalog = Catalog(name=catalog['name'])
        db_session.add(new_catalog)

    db_session.commit()
