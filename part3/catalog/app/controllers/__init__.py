from flask import g
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
from app.db import get_engine

from app import app
from flask import g
from flask import session as login_session
from app.models import User

@app.before_request
def before_request():
    g.session = scoped_session(sessionmaker(bind=get_engine()))

    user_id = login_session.get('user_id')
    if user_id:
        g.current_user = g.session.query(User).filter(User.id == user_id).first()
    else:
        g.current_user = None

@app.teardown_request
def remove_session(ex=None):
    g.session.remove()


from catalog_controllers import *
from session_controllers import *
from item_controllers import *
