from datetime import datetime

from catalog.db import db


class Item(db.Model):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow())
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    user = db.relationship('User')
    category = db.relationship('Category')

    db.UniqueConstraint('catalog_id', 'name')

    @property
    def serialize(self):
        """Arrange object data to python type dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category.serialize,
        }

    @classmethod
    def get_by_id(cls, item_id):
        """Get a item by its id

        :param item_id:
        :return: CatalogItem
        """
        return db.session.query(cls).filter(cls.id == item_id).first()

    def is_owned_by(self, user):
        """Determine if a user is the owner of this item

        :param user:
        :return: bool
        """
        return user and user.id == self.user_id
