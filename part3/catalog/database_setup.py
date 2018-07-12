from app import app
from app.db import init_db, seed

app.config['DB'] = 'sqlite:///catalog_menu.db'
init_db()
seed()
