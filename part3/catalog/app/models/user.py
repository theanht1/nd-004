from sqlalchemy import Column, Integer, String

from . import Base


class User(Base):

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    name = Column(String)
    picture = Column(String)

    @property
    def serialize(self):
        """Arrange object data to python type dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'picture': self.picture,
        }

