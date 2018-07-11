from flask import make_response, render_template
import json


def render_json(data={}, code=200):
    response = make_response(json.dumps(data), code)
    response.headers['Content-Type'] = 'application/json'
    return response

def render_json_error(message, code=400):
    return render_json({ 'error': message }, code)
