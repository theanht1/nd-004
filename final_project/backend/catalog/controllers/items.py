from flask import g, Blueprint

from catalog import db
from catalog.models import Item
from catalog.schemas.item_schema import ItemSchema
from catalog.utils.decorators import login_required, item_required,\
    item_owner_required, check_input_schema
from catalog.utils.responses_helper import render_json, render_json_error

bp = Blueprint('item', __name__, url_prefix='/api/items')
itemSchema = ItemSchema()


@bp.route('/', methods=['POST'])
@login_required
@check_input_schema(itemSchema)
def create_item():
    """CREATE new item"""
    payload = g.get('payload')
    name, description, category_id = (payload['name'], payload['description'],
                                      payload['category_id'])

    exist_item = db.session.query(Item) \
        .filter(Item.name == name, Item.category_id == category_id)\
        .first()

    if exist_item is not None:
        return render_json_error('Item\'s name existed in this category')

    item = Item(name=name, description=description,
                category_id=category_id, user_id=g.current_user.id)
    db.session.add(item)
    db.session.commit()
    return render_json({'item': item.serialize}, 201)


@bp.route('/<int:item_id>/')
@item_required
def get_item(item_id, item):
    """GET item detail"""
    return render_json({'item': item.serialize})


@bp.route('/<int:item_id>/', methods=['PATCH'])
@login_required
@check_input_schema(itemSchema)
@item_required
@item_owner_required
def edit_item(item_id, item):
    """Edit an item"""
    payload = g.get('payload')
    name, description, category_id = (payload['name'], payload['description'],
                                      payload['category_id'])

    exist_item = db.session.query(Item) \
        .filter(Item.name == name,
                Item.category_id == category_id,
                Item.id != item_id) \
        .first()

    if exist_item is not None:
        return render_json_error('Item\'s name existed in this category')

    item.name = name
    item.description = description
    item.category_id = category_id
    db.session.add(item)
    db.session.commit()

    return render_json({'item': item.serialize})


@bp.route('/<int:item_id>/', methods=['DELETE'])
@login_required
@item_required
@item_owner_required
def delete_item(item_id, item):
    """Delete an item"""
    db.session.delete(item)
    db.session.commit()

    return render_json({}, 204)
