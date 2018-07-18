from flask import Blueprint

from catalog import db
from catalog.models import Category, Item
from catalog.utils.responses_helper import render_json

bp = Blueprint('category', __name__, url_prefix='/categories')


@bp.route('/')
def get_categories():
    """GET categories"""
    categories = Category.get_all()
    return render_json({'categories': [c.serialize for c in categories]})


@bp.route('/<int:category_id>/items/')
def get_category_items(category_id):
    """GET items of a category"""
    items = db.session.query(Item).filter(Item.category_id == category_id)
    return render_json({'items': [i.serialize for i in items]})
