from app import create_app
from app.db import init_db, seed

app = create_app({})
# app.config['DB'] = 'sqlite:///catalog_menu.db'
init_db()
seed()
