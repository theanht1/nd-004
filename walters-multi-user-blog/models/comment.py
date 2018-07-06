from google.appengine.ext import db
from user import User
from post import Post

class Comment(db.Model):
    """ Model for post's comment """

    user = db.ReferenceProperty(User, required = True,
                                collection_name='comments')
    post = db.ReferenceProperty(Post, required = True,
                                collection_name='comments')
    content = db.StringProperty(required = True)
    created = db.DateTimeProperty(auto_now_add = True)
