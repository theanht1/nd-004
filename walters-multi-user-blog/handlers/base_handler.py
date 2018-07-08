import os
from webapp2 import RequestHandler
import jinja2
import json

from models import User
from utils.authen_helpers import make_secure_cookie, check_valid_cookie

base_path = os.path.dirname(os.path.dirname(__file__))
template_dir = os.path.join(base_path, 'templates')

jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               extensions=['jinja2.ext.autoescape'], autoescape = True)


class BaseHandler(RequestHandler):
    def __init__(self, *a, **kw):
        super(BaseHandler, self).__init__(*a, **kw)
        self.current_user = None

    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_json(self, data, code=200):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.set_status(code)
        self.write(json.dumps(data))

    def render_json_error(self, message, code=400):
        self.render_json({ 'error': message }, code = code)

    def render_str(self, template, **params):
        tml = jinja_env.get_template(template)
        return tml.render(params)

    def render(self, template, **params):
        self.write(self.render_str(template,
            current_user = self.get_current_user(), **params))

    def set_current_user_cookie(self, user):
        self.response.set_cookie('user', make_secure_cookie(user),
                                 max_age = 60 * 60 * 24)

    def get_current_user(self):
        if self.current_user:
            return self.current_user

        user_cookie = self.request.cookies.get('user')
        if user_cookie and check_valid_cookie(user_cookie):
            user_id = user_cookie.split('|')[0]
            self.current_user = User.get_by_id(int(user_id))
            return self.current_user

    def check_user_login(self):
        if not self.get_current_user():
            return self.redirect('/', abort = True)

        return True
