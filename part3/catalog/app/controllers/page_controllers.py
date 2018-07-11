from flask import render_template
from sqlalchemy import desc
from app import app
from app.models import Catalog, CatalogItem
from . import session


@app.route('/')
def home_page():
    catalogs = session.query(Catalog).order_by(Catalog.name).all()
    items = session.query(CatalogItem).order_by(desc(CatalogItem.id)).limit(10).all()
    return render_template('index.html', catalogs=catalogs, items=items)
