from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///catalog_menu.db')
db_session = scoped_session(sessionmaker(bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()


def init_db():
    import app.models
    Base.metadata.create_all(bind=engine)


def get_engine():
    return None


def create_session():
    db_session = sessionmaker(bind=get_engine())
    return db_session()


def seed():
    session = create_session()
    catalogs = [
        { 'name': 'Football' },
        { 'name': 'Baseball' },
        { 'name': 'Basketball' },
        { 'name': 'Snowboarding' },
        { 'name': 'Skating' },
        { 'name': 'Hockey' },
    ]

    # for catalog in catalogs:
        # new_catalog = Catalog(name=catalog['name'])
        # session.add(new_catalog)

    session.commit()
