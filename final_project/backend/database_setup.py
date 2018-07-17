from catalog import create_app
from catalog.db import init_db, seed


app = create_app()
with app.app_context():
    init_db()
    seed()
