from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

from user import User
from catalog import Catalog
from catalog_item import CatalogItem
