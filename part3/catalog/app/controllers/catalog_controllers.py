from flask import render_template, g
from sqlalchemy import desc
from app import app
from app.models import Catalog, CatalogItem
from app.utils import render_json


@app.route('/')
@app.route('/catalogs/')
def home_page():
    """Route to home page"""
    catalogs = Catalog.get_all()
    items = g.session.query(CatalogItem).order_by(desc(CatalogItem.id)).limit(10).all()
    return render_template('index.html', type='index',
                           catalogs=catalogs, items=items)


@app.route('/catalogs/JSON')
def catalogs_json():
    """Render JSON for catalogs"""
    catalogs = Catalog.get_all()
    return render_json([c.serialize for c in catalogs])


@app.route('/catalogs/<int:catalog_id>/items/')
def catalog_items(catalog_id):
    """Route to catalog's items page"""
    catalogs = Catalog.get_all()
    catalog = Catalog.get_by_id(catalog_id)
    items = catalog.items
    return render_template('index.html', type='catalog', catalogs=catalogs,
                           items=items, catalog=catalog)


@app.route('/catalogs/<int:catalog_id>/items/JSON/')
def catalog_items_json(catalog_id):
    """Render JSON for catalog's items"""
    items = CatalogItem.get_by_catalog(catalog_id)
    return render_json([i.serialize for i in items])
