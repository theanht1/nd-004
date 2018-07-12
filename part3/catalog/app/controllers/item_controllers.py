from flask import g, render_template, request, redirect, flash, url_for
from app import app
from app.models import Catalog, CatalogItem
from app.utils import render_json, render_json_error, convert_item_fields


@app.route('/catalogs/items/new/', methods=['GET', 'POST'])
def add_new_item():
    """Route to new item page + create item"""
    if not g.current_user:
        flash('User not authorized', 'error')
        return redirect(url_for('home_page'))

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
        g.session.add(item)
        g.session.commit()
        flash('Item %s is created' % item.name, 'info')
        return redirect(url_for('get_item', item_id=item.id))

    else:
        flash('Name, description and catalog are required', 'warning')
        return render_template('items/new.html', name=name, catalog_id=catalog_id,
                               description=description, catalogs=catalogs)


@app.route('/catalogs/items/<int:item_id>/')
def get_item(item_id):
    """Route to item detail page"""
    item = CatalogItem.get_by_id(item_id)
    if not item:
        flash('Item not found', 'error')
        return redirect(url_for('home_page'))

    return render_template('items/show.html', item=item)


@app.route('/catalogs/items/<int:item_id>/JSON')
def get_item_json(item_id):
    """Render JSON for item"""
    item = CatalogItem.get_by_id(item_id)
    if not item:
        return render_json_error('Item not found')

    return render_json(item.serialize)


@app.route('/catalogs/items/<int:item_id>/edit', methods=['GET', 'POST'])
def edit_item(item_id):
    """Route to item edit form + update item"""
    item = CatalogItem.get_by_id(item_id)
    if not (item and item.is_owned_by(g.current_user)):
        flash('Item not found', 'error')
        return redirect(url_for('home_page'))

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
        g.session.add(item)
        g.session.commit()
        flash('Item %s is updated' % item.name, 'info')
        return redirect(url_for('get_item', item_id=item.id))

    else:
        flash('Name, description and catalog are required', 'warning')
        return render_template('items/edit.html', catalogs=catalogs, item=item, name=name,
                               catalog_id=catalog_id, description=description)


@app.route('/catalogs/items/<int:item_id>/delete', methods=['GET', 'POST'])
def delete_item(item_id):
    """Route to item's delete page + delete item"""
    item = CatalogItem.get_by_id(item_id)
    if not (item and item.is_owned_by(g.current_user)):
        flash('Item not found', 'error')
        return redirect(url_for('home_page'))

    # GET request
    if request.method == 'GET':
        return render_template('items/delete.html', item=item)

    # POST request
    item_name = item.name
    g.session.delete(item)
    g.session.commit()
    flash('Item %s is removed' % item_name, 'info')
    return redirect(url_for('home_page'))
