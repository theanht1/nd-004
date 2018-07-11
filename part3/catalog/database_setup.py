from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, Catalog

engine = create_engine('sqlite:///catalog_menu.db')

Base.metadata.create_all(engine)

# Seed some default catalogs
DBSession = sessionmaker(bind=engine)
session = DBSession()

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
