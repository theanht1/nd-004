from sqlalchemy import create_engine
from catalog.models import Base

engine = create_engine('sqlite:///catalog_menu.db')

Base.metadata.create_all(engine)
