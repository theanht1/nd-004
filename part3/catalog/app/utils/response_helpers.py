import json

from flask import make_response


def render_json(data={}, code=200):
    """Helper function to response json data"""
    response = make_response(json.dumps(data), code)
    response.headers['Content-Type'] = 'application/json'
    return response


def render_json_error(message, code=400):
    """Helper function to response json data as an error"""
    return render_json({'error': message}, code)
