from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, Catalog


def get_engine(name='catalog_menu'):
    return create_engine('sqlite:///%s.db' % name)

def init_db(engine):
    Base.metadata.create_all(engine)

def create_session(engine):
    DBSession = sessionmaker(bind=engine)
    return DBSession()

def default_session():
    engine = get_engine()
    return create_session(engine)

def seed(engine):
    session = create_session(engine)
    catalogs = [
        { 'name': 'Football' },
        { 'name': 'Baseball' },
        { 'name': 'Basketball' },
        { 'name': 'Snowboarding' },
        { 'name': 'Skating' },
        { 'name': 'Hockey' },
    ]

    for catalog in catalogs:
        new_catalog = Catalog(name=catalog['name'])
        session.add(new_catalog)

    session.commit()
