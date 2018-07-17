from datetime import datetime

from catalog.db import db


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    picture = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())

    @property
    def serialize(self):
        """Arrange object data to python type dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'picture': self.picture,
        }

    @classmethod
    def get_by_id(cls, user_id):
        """ Get user by id
        :param user_id: int
        :return: a User or None
        """
        return db.session.query(cls).filter(cls.id == user_id).first
