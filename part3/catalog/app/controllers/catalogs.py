from flask import render_template, Blueprint
from sqlalchemy import desc
from app.models import Catalog, CatalogItem
from app.utils import render_json
from app.db import db_session

bp = Blueprint('catalog', __name__)


@bp.route('/')
@bp.route('/catalogs/')
def home_page():
    """Route to home page"""
    catalogs = Catalog.get_all()
    items = db_session.query(CatalogItem).order_by(desc(CatalogItem.id)).limit(10).all()
    return render_template('index.html', type='index',
                           catalogs=catalogs, items=items)


@bp.route('/catalogs/JSON')
def catalogs_json():
    """Render JSON for catalogs"""
    catalogs = Catalog.get_all()
    return render_json([c.serialize for c in catalogs])


@bp.route('/catalogs/<int:catalog_id>/items/')
def catalog_items(catalog_id):
    """Route to catalog's items page"""
    catalogs = Catalog.get_all()
    catalog = Catalog.get_by_id(catalog_id)
    items = catalog.items
    return render_template('index.html', type='catalog', catalogs=catalogs,
                           items=items, catalog=catalog)


@bp.route('/catalogs/<int:catalog_id>/items/JSON/')
def catalog_items_json(catalog_id):
    """Render JSON for catalog's items"""
    items = db_session.query(CatalogItem).filter(CatalogItem.catalog_id == catalog_id)
    return render_json([i.serialize for i in items])
