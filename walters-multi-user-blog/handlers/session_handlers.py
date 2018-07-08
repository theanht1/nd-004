from base_handler import BaseHandler
from models import User
from utils import validators
from utils.authen_helpers import make_secure_password, is_user_authenticated

class SignupHandler(BaseHandler):

    def get(self):
        self.render('signup.html')

    def post(self):
        username = self.request.get('username')
        password = self.request.get('password')
        password_confirmation = self.request.get('password_confirmation')
        email = self.request.get('email')

        params = dict(username = username,
                      email = email)

        if not validators.valid_username(username):
            params['error_username'] = "That's not a valid username."

        if not validators.valid_password(password):
            params['error_password'] = "That wasn't a valid password."
        elif password != password_confirmation:
            params['error_password_confirm'] = "Your passwords didn't match."

        if not validators.valid_email(email):
            params['error_email'] = "That's not a valid email."

        # If validation failed
        if len(params) > 2:
            self.render('signup.html', **params)
        else:
            user = User(username = username, email = email,
                        password = make_secure_password(password))
            user.put()
            self.set_current_user_cookie(user)
            self.redirect('/')

class LoginHandler(BaseHandler):

    def get(self):
        self.render('login.html')

    def post(self):
        username = self.request.get('username')
        password = self.request.get('password')

        user = User.gql("WHERE username = '%s'" % username).get()
        if not (user and is_user_authenticated(user, password)):
            self.render('login.html', username = username,
                        error = 'username or password is wrong')
        else:
            self.set_current_user_cookie(user)
            self.redirect('/')

class LogoutHandler(BaseHandler):
    def post(self):
        self.response.set_cookie('user', '')
        self.redirect('/')
