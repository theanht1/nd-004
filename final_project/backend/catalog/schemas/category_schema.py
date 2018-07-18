from marshmallow import Schema, fields, validate


class CategoryScheme(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True, validate=validate.Length(1, 50))

