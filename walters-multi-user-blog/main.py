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
import handlers

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                                autoescape = True)

app = webapp2.WSGIApplication([
    ('/?', handlers.IndexHandler),
    ('/signup/?', handlers.SignupHandler),
    ('/login/?', handlers.LoginHandler),
    ('/logout', handlers.LogoutHandler),
    ('/new-post', handlers.NewPostHandler),
    ('/posts/([0-9]+)', handlers.PostDetailHander),
    ('/posts/([0-9]+)/likes', handlers.TriggerLikePostHandler),
    ('/posts/([0-9]+)/comments', handlers.AddCommentHandler),
    ('/users/([0-9]+)/posts', handlers.UserPostIndexHandler),
], debug=True)
