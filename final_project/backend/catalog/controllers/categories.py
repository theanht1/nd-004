from flask import Blueprint

from catalog import db
from catalog.models import Category, Item
from catalog.schemas.category_schema import CategorySchema
from catalog.schemas.item_schema import ItemSchema
from catalog.utils.responses_helper import render_json

bp = Blueprint('category', __name__, url_prefix='/api/categories')
categories_schema = CategorySchema(many=True)
items_schema = ItemSchema(many=True)


@bp.route('/')
def get_categories():
    """GET categories"""
    categories = Category.get_all()
    return render_json({'categories': categories_schema.dump(categories)[0]})


@bp.route('/<int:category_id>/items/')
def get_category_items(category_id):
    """GET items of a category"""
    items = db.session.query(Item).filter(Item.category_id == category_id)
    return render_json({'items': items_schema.dump(items)[0]})
