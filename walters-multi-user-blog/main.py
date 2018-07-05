#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import os
import re
import webapp2
import jinja2
from google.appengine.ext import db

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                                autoescape = True)

class Handler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        tml = jinja_env.get_template(template)
        return tml.render(params)

    def render(self, template, **params):
        self.write(self.render_str(template, **params))

class ROT13Hander(Handler):
    def get(self):
        self.render('rot13.html')

    def post(self):
        def convert(char):
            if 'a' <= char <= 'z':
                return chr((ord(char) - 97 + 13) % 26 + 97)
            if 'A' <= char <= 'Z':
                return chr((ord(char) - 65 + 13) % 26 + 65)

            return char

        rot13_text = ''.join(map(convert, self.request.get('text')))
        self.render('rot13.html', text = rot13_text)


USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
def valid_username(username):
    return username and USER_RE.match(username)

PASS_RE = re.compile(r"^.{3,20}$")
def valid_password(password):
    return password and PASS_RE.match(password)

EMAIL_RE  = re.compile(r'^[\S]+@[\S]+\.[\S]+$')
def valid_email(email):
    return not email or EMAIL_RE.match(email)

class SignupHandler(Handler):

    def get(self):
        self.render("signup-form.html")

    def post(self):
        have_error = False
        username = self.request.get('username')
        password = self.request.get('password')
        verify = self.request.get('verify')
        email = self.request.get('email')

        params = dict(username = username,
                      email = email)

        if not valid_username(username):
            params['error_username'] = "That's not a valid username."
            have_error = True

        if not valid_password(password):
            params['error_password'] = "That wasn't a valid password."
            have_error = True
        elif password != verify:
            params['error_verify'] = "Your passwords didn't match."
            have_error = True

        if not valid_email(email):
            params['error_email'] = "That's not a valid email."
            have_error = True

        if have_error:
            self.render('signup-form.html', **params)
        else:
            self.redirect('/unit2/welcome?username=' + username)

class WelcomeHandler(Handler):
    def get(self):
        username = self.request.get('username')
        if valid_username(username):
            self.render('welcome.html', username = username)
        else:
            self.redirect('/unit2/signup')

class Post(db.Model):
    subject = db.StringProperty(required = True)
    content = db.TextProperty(required = True)
    created = db.DateTimeProperty(auto_now_add = True)

class PostIndexHandler(Handler):
    def get(self):
        posts = Post.all().order('-created')
        self.render('post_index.html', posts = posts)

class NewPostHandler(Handler):
    def render_form(self, subject='', content='', error=''):
        self.render('new_post.html', subject = subject,
                    content = content, error = error)

    def get(self):
        self.render_form()

    def post(self):
        subject = self.request.get('subject')
        content = self.request.get('content')

        if subject and content:
            post = Post(subject = subject, content = content)
            post.put()
            self.redirect('/blog/%s' % str(post.key().id()))
        else:
            error = 'We need both subject and content'
            self.render_form(subject, content, error)

class PostDetailHander(Handler):
    def get(self, post_id):
        post = Post.get_by_id(int(post_id))
        self.render('post_detail.html', post = post)

app = webapp2.WSGIApplication([
    ('/unit2/rot13', ROT13Hander),
    ('/unit2/signup', SignupHandler),
    ('/unit2/welcome', WelcomeHandler),
    ('/blog/?', PostIndexHandler),
    ('/blog/newpost', NewPostHandler),
    ('/blog/([0-9]+)', PostDetailHander),
], debug=True)
