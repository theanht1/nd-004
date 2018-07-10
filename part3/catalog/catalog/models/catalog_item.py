from sqlalchemy import Column, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from . import Base
from user import User
from catalog import Catalog


class CatalogItem(Base):

    __tablename__ = 'catalog_items'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship(User)
    catalog_id = Column(Integer, ForeignKey('catalogs.id'))
    catalog = relationship(Catalog)

    UniqueConstraint('catalog_id', 'name')

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

