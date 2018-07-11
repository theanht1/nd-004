from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from flask import g
from . import Base
from user import User
from catalog import Catalog

class CatalogItem(Base):

    __tablename__ = 'catalog_items'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    catalog_id = Column(Integer, ForeignKey('catalogs.id'), nullable=False)
    user = relationship(User)
    catalog = relationship(Catalog)

    UniqueConstraint('catalog_id', 'name')

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'catalog': self.catalog.serialize,
        }

    @classmethod
    def get_by_id(cls, id):
        return g.session.query(cls).filter(cls.id == id).first()

    @classmethod
    def get_by_catalog(cls, catalog_id):
        return g.session.query(cls) \
                .filter(cls.catalog_id == catalog_id) \
                .order_by(cls.name).all()

    def is_owned_by(self, user):
        return user and user.id == self.user_id
