from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine('sqlite:///catalog_menu.db')
DBSession = sessionmaker(bind=engine)
session = DBSession()

from catalog import app
from flask import g
from flask import session as login_session
from catalog.models import User

@app.before_request
def before_request():
    user_id = login_session.get('user_id')
    if user_id:
        g.current_user = session.query(User).filter(User.id == user_id).first()


from page_controllers import *
from session_controllers import *
