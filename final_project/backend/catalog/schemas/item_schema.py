from marshmallow import Schema, fields, pre_load, validate


class ItemSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(1, 50))
    description = fields.Str(required=True, validate=validate.Length(1))
    category_id = fields.Int(required=True)
    created_at = fields.Str(dump_only=True)

    @pre_load
    def strip_fields(self, in_data):
        """Strip name and description before saving"""
        in_data['name'] = in_data['name'].strip()
        in_data['description'] = in_data['description'].strip()
        return in_data
