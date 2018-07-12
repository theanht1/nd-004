from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from flask import g
from . import Base


class CatalogItem(Base):

    __tablename__ = 'catalog_items'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    catalog_id = Column(Integer, ForeignKey('catalogs.id'), nullable=False)
    user = relationship('User')
    catalog = relationship('Catalog')

    UniqueConstraint('catalog_id', 'name')

    @property
    def serialize(self):
        """Arrange object data to python type dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'catalog': self.catalog.serialize,
        }

    @classmethod
    def get_by_id(cls, item_id):
        """Get a item by its id

        :param item_id:
        :return: CatalogItem
        """
        return g.session.query(cls).filter(cls.id == item_id).first()

    def is_owned_by(self, user):
        """Determine if a user is the owner of this item

        :param user:
        :return: bool
        """
        return user and user.id == self.user_id
