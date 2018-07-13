from flask import render_template, request, redirect, flash, url_for, g, Blueprint

from app.models import Catalog, CatalogItem
from app.utils import render_json, render_json_error, convert_item_fields
from app.db import db_session
from app.utils.decorators import login_required, item_required, item_owner_required

bp = Blueprint('item', __name__, url_prefix='/catalogs/items')


@bp.route('/new/', methods=['GET', 'POST'])
@login_required
def add_new_item():
    """Route to new item page + create item"""
    catalogs = Catalog.get_all()

    # GET request
    if request.method == 'GET':
        return render_template('items/new.html', catalogs=catalogs)

    # POST request
    name, description, catalog_id = convert_item_fields(request.form.get('name'),
                                                        request.form.get('description'),
                                                        request.form.get('catalog_id'))
    if name and description and catalog_id:
        item = CatalogItem(name=name, description=description,
                           catalog_id=catalog_id, user_id=g.current_user.id)
        db_session.add(item)
        db_session.commit()
        flash('Item %s is created' % item.name, 'info')
        return redirect(url_for('item.get_item', item_id=item.id))

    else:
        flash('Name, description and catalog are required', 'warning')
        return render_template('items/new.html', name=name, catalog_id=catalog_id,
                               description=description, catalogs=catalogs)


@bp.route('/<int:item_id>/')
@item_required
def get_item(item_id, item):
    """Route to item detail page"""
    return render_template('items/show.html', item=item)


@bp.route('/<int:item_id>/JSON')
def get_item_json(item_id):
    """Render JSON for item"""
    item = CatalogItem.get_by_id(item_id)
    if not item:
        return render_json_error('Item not found')

    return render_json(item.serialize)


@bp.route('/<int:item_id>/edit', methods=['GET', 'POST'])
@login_required
@item_required
@item_owner_required
def edit_item(item_id, item):
    """Route to item edit form + update item"""
    catalogs = Catalog.get_all()
    # GET request
    if request.method == 'GET':
        return render_template('items/edit.html', item=item, catalogs=catalogs,
                               name=item.name, catalog_id=item.catalog_id,
                               description=item.description)

    # POST request
    name, description, catalog_id = convert_item_fields(request.form.get('name'),
                                                        request.form.get('description'),
                                                        request.form.get('catalog_id'))
    if name and description and catalog_id:
        item.name = name
        item.description = description
        item.catalog_id = catalog_id
        db_session.add(item)
        db_session.commit()
        flash('Item %s is updated' % item.name, 'info')
        return redirect(url_for('item.get_item', item_id=item.id))

    else:
        flash('Name, description and catalog are required', 'warning')
        return render_template('items/edit.html', catalogs=catalogs, item=item, name=name,
                               catalog_id=catalog_id, description=description)


@bp.route('/<int:item_id>/delete', methods=['GET', 'POST'])
@login_required
@item_required
@item_owner_required
def delete_item(item_id, item):
    """Route to item's delete page + delete item"""
    # GET request
    if request.method == 'GET':
        return render_template('items/delete.html', item=item)

    # POST request
    item_name = item.name
    db_session.delete(item)
    db_session.commit()
    flash('Item %s is removed' % item_name, 'info')
    return redirect(url_for('catalog.home_page'))
