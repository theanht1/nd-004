import json

from flask import session, g, request


def init_controller(app):
    @app.before_request
    def before_request():
        # if request.headers?
        pass
