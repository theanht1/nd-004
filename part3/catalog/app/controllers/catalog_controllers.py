from flask import render_template
from sqlalchemy import desc
from app import app
from app.models import Catalog, CatalogItem
from . import session


@app.route('/')
def home_page():
    catalogs = Catalog.get_all()
    items = session.query(CatalogItem).order_by(desc(CatalogItem.id)).limit(10).all()
    return render_template('index.html', catalogs=catalogs, items=items)


@app.route('/catalogs/<int:catalog_id>/')
def catalog_items(catalog_id):
    catalogs = Catalog.get_all()
    items = CatalogItem.get_by_catalog(catalog_id)
    return render_template('index.html', catalogs=catalogs, items=items)

