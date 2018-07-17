from catalog.db import db


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    items = db.relationship('Item', order_by='Item.name')

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
        return db.session.query(cls).order_by(cls.name).all()

    @classmethod
    def get_by_id(cls, catalog_id):
        """Get a catalog by its id

        :param catalog_id:
        :return: Catalog
        """
        return db.session.query(cls).filter(cls.id == catalog_id).first()
