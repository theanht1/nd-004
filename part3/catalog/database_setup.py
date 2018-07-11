from app.db import get_engine, init_db, seed


engine = get_engine()
init_db(engine)
seed(engine)
