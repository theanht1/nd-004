from google.appengine.ext import db
from user import User

class Post(db.Model):
    """ Model for posts """

    user = db.ReferenceProperty(User, required = True,
                                collection_name='posts')
    subject = db.StringProperty(required = True)
    content = db.TextProperty(required = True)
    created = db.DateTimeProperty(auto_now_add = True)

