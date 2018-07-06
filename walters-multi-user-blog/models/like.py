from google.appengine.ext import db
from user import User
from post import Post

class Like(db.Model):
    """ Model for post's like """

    user = db.ReferenceProperty(User, required = True,
                                collection_name='likes')
    post = db.ReferenceProperty(Post, required = True,
                                collection_name='likes')
    created = db.DateTimeProperty(auto_now_add = True)
