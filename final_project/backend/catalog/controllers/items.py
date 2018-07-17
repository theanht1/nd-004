from flask import request, g, Blueprint

from catalog import db
from catalog.models import Item
from catalog.utils.decorators import login_required, item_required, item_owner_required
from catalog.utils.responses_helper import render_json

bp = Blueprint('item', __name__, url_prefix='/items')


@bp.route('/', methods=['POST'])
@login_required
def create_item():
    """CREATE new item"""
    data = request.get_json()
    # TODO: validate data
    name, description, category_id = data['name'], data['description'], data['category_id']
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
@item_required
@item_owner_required
def edit_item(item_id, item):
    """Edit an item"""
    data = request.get_json()
    # TODO: validate data
    name, description, category_id = data['name'], data['description'], data['category_id']
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
