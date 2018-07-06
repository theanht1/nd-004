import os
from webapp2 import RequestHandler
import jinja2

from models import User
from utils.authen_helpers import make_secure_cookie, check_valid_cookie

base_path = os.path.dirname(os.path.dirname(__file__))
template_dir = os.path.join(base_path, 'templates')

jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)

class BaseHandler(RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        tml = jinja_env.get_template(template)
        return tml.render(params)

    def render(self, template, **params):
        self.write(self.render_str(template,
            current_user = self.get_current_user(), **params))

    def set_current_user_cookie(self, user):
        self.response.set_cookie('user', make_secure_cookie(user),
                                 max_age = 3600)

    def get_current_user(self):
        user_cookie = self.request.cookies.get('user')
        if user_cookie and check_valid_cookie(user_cookie):
            user_id = user_cookie.split('|')[0]
            return User.get_by_id(int(user_id))
