from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///catalog_menu.db')
DBSession = sessionmaker(bind=engine)
session = DBSession()

from app import app
from flask import g
from flask import session as login_session
from app.models import User

@app.before_request
def before_request():
    user_id = login_session.get('user_id')
    if user_id:
        g.current_user = session.query(User).filter(User.id == user_id).first()
    else:
        g.current_user = None


from page_controllers import *
from session_controllers import *
from item_controllers import *
