from flask import g, Blueprint, request

from catalog import db
from catalog.models import Item
from catalog.schemas.item_schema import ItemSchema
from catalog.utils.decorators import login_required, item_required,\
    item_owner_required, check_input_schema
from catalog.utils.responses_helper import render_json, render_json_error

bp = Blueprint('item', __name__, url_prefix='/api/items')
item_schema = ItemSchema()
items_schema = ItemSchema(many=True)


@bp.route('/latest/')
def latest_items():
    """Get latest items, order by created_at"""
    limit = int(request.args.get('limit') or 10)

    items = db.session.query(Item)\
        .order_by(Item.created_at.desc())\
        .limit(limit).all()

    return render_json({'items': items_schema.dump(items)[0]})


@bp.route('/', methods=['POST'])
@login_required
@check_input_schema(item_schema)
def create_item():
    """Create new item"""
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
    return render_json({'item': item_schema.dump(item).data}, 201)


@bp.route('/<int:item_id>/')
@item_required
def get_item(item_id, item):
    """Get item detail"""
    return render_json({'item': item_schema.dump(item).data})


@bp.route('/<int:item_id>/', methods=['PATCH'])
@login_required
@check_input_schema(item_schema)
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

    return render_json({'item': item_schema.dump(item).data})


@bp.route('/<int:item_id>/', methods=['DELETE'])
@login_required
@item_required
@item_owner_required
def delete_item(item_id, item):
    """Delete an item"""
    db.session.delete(item)
    db.session.commit()

    return render_json({}, 204)
