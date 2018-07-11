from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from flask import g
from . import Base
from user import User


class Catalog(Base):

    __tablename__ = 'catalogs'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship(User)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
        }

    @classmethod
    def get_all(cls):
        return g.session.query(cls).order_by(cls.name).all()

    @classmethod
    def get_by_id(cls, catalog_id):
        return g.session.query(cls).filter(cls.id == catalog_id).first()
