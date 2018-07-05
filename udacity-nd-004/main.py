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


class Post(db.Model):
    title = db.StringProperty(required = True)
    body = db.TextProperty(required = True)
    created = db.DateTimeProperty(auto_now_add = True)

class PostIndexHandler(Handler):
    def get(self):
        posts = Post.all().order('-created')
        self.render('post_index.html', posts = posts)

class NewPostHandler(Handler):
    def render_form(self, title='', body='', error=''):
        self.render('new_post.html', title = title,
                    body = body, error = error)

    def get(self):
        self.render_form()

    def post(self):
        title = self.request.get('title')
        body = self.request.get('body')

        if title and body:
            post = Post(title = title, body = body)
            post.put()
            self.redirect('/blogs/%s' % str(post.key().id()))
        else:
            error = 'We need both title and body'
            self.render_form(title, body, error)

class PostDetailHander(Handler):
    def get(self, post_id):
        post = Post.get_by_id(int(post_id))
        self.render('post_detail.html', post = post)

app = webapp2.WSGIApplication([
    ('/unit2/rot13', ROT13Hander),
    ('/blogs/?', PostIndexHandler),
    ('/blogs/newpost', NewPostHandler),
    ('/blogs/([0-9]+)', PostDetailHander),
], debug=True)
