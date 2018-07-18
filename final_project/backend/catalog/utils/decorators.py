from functools import wraps
from flask import g, request
from marshmallow import ValidationError

from catalog.models import Item
from catalog.utils.responses_helper import render_json_error


def login_required(f):
    """Decorator that redirect anonymous user to login page"""
    @wraps(f)
    def decorated_func(**kwargs):
        if g.current_user is None:
            return render_json_error('User not authorized', 401)
        return f(**kwargs)
    return decorated_func


def item_required(f):
    """Decorator that redirect to home page if item not found"""
    @wraps(f)
    def decorated_func(item_id, **kwargs):
        item = Item.get_by_id(item_id)
        if item is None:
            return render_json_error('Item not found', 404)
        return f(item_id, item, **kwargs)
    return decorated_func


def item_owner_required(f):
    """Decorator that redirect user doesn't own item to home page"""
    @wraps(f)
    def decorated_func(item_id, item, **kwargs):
        if g.current_user.id != item.user_id:
            return render_json_error('User not authorized', 401)
        return f(item_id, item, **kwargs)
    return decorated_func


def check_input_schema(schema):
    def decorated_generator(f):
        @wraps(f)
        def decorated_func(**kwargs):
            payload = request.get_json()
            if not payload:
                return render_json_error('No input data provided', 400)

            try:
                payload_dump = schema.load(payload)
                if payload_dump.errors:
                    return render_json_error(payload_dump.errors, 400)

                g.payload = payload_dump.data
            except ValidationError as err:
                return render_json_error(err.messages, 400)
            return f(**kwargs)

        return decorated_func

    return decorated_generator
