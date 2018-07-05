from google.appengine.ext import db
from user import User
from post import Post

class Commecnt(db.Model):
    """ Model for post's comment """

    user = db.ReferenceProperty(User, required = true,
                                collection_name='likes')
    post = db.ReferenceProperty(Post, required = true,,
                                collection_name='likes')
    content = db.StringProperty(required = true)
    created = db.DateTimeProperty(auto_now_add = True)
