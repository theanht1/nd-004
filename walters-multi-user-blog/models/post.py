from google.appengine.ext import db
from user import User

class Post(db.Model):

    user = db.ReferenceProperty(User, required = true,
                                collection_name='likes')
    subject = db.StringProperty(required = True)
    content = db.TextProperty(required = True)
    created = db.DateTimeProperty(auto_now_add = True)

