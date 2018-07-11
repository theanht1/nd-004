from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, Catalog
from app import app

def get_engine():
    return create_engine(app.config['DB'])

def init_db():
    Base.metadata.create_all(get_engine())

def create_session():
    DBSession = sessionmaker(bind=get_engine())
    return DBSession()

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

    for catalog in catalogs:
        new_catalog = Catalog(name=catalog['name'])
        session.add(new_catalog)

    session.commit()
