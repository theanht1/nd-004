from marshmallow import Schema, fields


class UserScheme(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Email(required=True)
    name = fields.Str(required=True)
    picture = fields.Str()
