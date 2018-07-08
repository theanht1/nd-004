from google.appengine.ext import db

class User(db.Model):
    """ Model for users """

    username = db.StringProperty(required = True)
    password = db.StringProperty(required = True)
    email = db.EmailProperty(required = True)
