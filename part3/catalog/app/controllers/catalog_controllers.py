from flask import render_template, g
from sqlalchemy import desc
from app import app
from app.models import Catalog, CatalogItem
from app.utils import render_json


@app.route('/')
def home_page():
    catalogs = Catalog.get_all()
    items = g.session.query(CatalogItem).order_by(desc(CatalogItem.id)).limit(10).all()
    return render_template('index.html', type='index',
                            catalogs=catalogs, items=items)

@app.route('/catalogs/JSON')
def catalogs_JSON():
    catalogs = Catalog.get_all()
    return render_json([c.serialize for c in catalogs])


@app.route('/catalogs/<int:catalog_id>/')
def catalog_items(catalog_id):
    catalogs = Catalog.get_all()
    catalog = Catalog.get_by_id(catalog_id)
    items = CatalogItem.get_by_catalog(catalog_id)
    return render_template('index.html', type='catalog', catalogs=catalogs,
                            items=items, catalog=catalog)


@app.route('/catalogs/<int:catalog_id>/JSON')
def catalog_items_json(catalog_id):
    items = CatalogItem.get_by_catalog(catalog_id)
    print([i.serialize for i in items])
    return render_json([i.serialize for i in items])
