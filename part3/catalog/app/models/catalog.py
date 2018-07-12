from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from flask import g

from . import Base


class Catalog(Base):

    __tablename__ = 'catalogs'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User')
    items = relationship('CatalogItem', order_by='CatalogItem.name')

    @property
    def serialize(self):
        """Arrange object data to python type dictionary"""
        return {
            'id': self.id,
            'name': self.name,
        }

    @classmethod
    def get_all(cls):
        """Get all catalogs, order by name

        :return: [Catalog]
        """
        return g.session.query(cls).order_by(cls.name).all()

    @classmethod
    def get_by_id(cls, catalog_id):
        """Get a catalog by its id

        :param catalog_id:
        :return: Catalog
        """
        return g.session.query(cls).filter(cls.id == catalog_id).first()
