from marshmallow import Schema, fields, pre_load, validate, validates_schema, ValidationError

from catalog import db
from catalog.models import Item


class ItemSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(1, 50))
    description = fields.Str(required=True, validate=validate.Length(1))
    category_id = fields.Int(required=True)
    created_at = fields.Str(dump_only=True)

    @validates_schema
    def validate_name(self, data):
        """Make sure it has only one item type in a category"""
        # If info does not exist then pass to other validations
        if not (data and data.get('name') and data.get('category_id')):
            return

        exist_item = db.session.query(Item)\
            .filter(Item.name == data.get('name') and Item.category_id == data.get('category_id'))\
            .first()

        if exist_item is not None:
            raise ValidationError('Item\'s name existed in this category')

    @pre_load
    def strip_fields(self, in_data):
        """Strip name and description before saving"""
        in_data['name'] = in_data['name'].strip()
        in_data['description'] = in_data['description'].strip()
        return in_data
