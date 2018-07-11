from flask import g, render_template, request, redirect, flash, url_for
from app import app
from app.models import Catalog, CatalogItem
from app.utils import render_json
from . import session


@app.route('/catalogs/items/new/', methods=['GET', 'POST'])
def add_new_item():
    if not g.current_user:
        flash('User not authorized', 'error')
        return redirect(url_for('home_page'))

    catalogs = Catalog.get_all()
    if request.method == 'GET':
        return render_template('items/new.html', catalogs=catalogs)
    else:
        name = request.form.get('name')
        description = request.form.get('description')
        catalog_id = request.form.get('catalog_id')
        if name and description and catalog_id:
            item = CatalogItem(name=name, description=description,
                               catalog_id=catalog_id, user_id=g.current_user.id)
            session.add(item)
            session.commit()
            flash('Item %s is created' % item.name, 'info')
            return redirect(url_for('get_item', item_id=item.id))

        else:
            flash('Name, description and catalog are required', 'warning')
            return render_template('items/new.html', name=name, catalog_id=catalog_id,
                                    description=description, catalogs=catalogs)


@app.route('/catalogs/items/<int:item_id>/')
def get_item(item_id):
    item = CatalogItem.get_by_id(item_id)
    if item:
        return render_template('items/show.html', item=item)
    else:
        flash('Item not found', 'error')
        return redirect(url_for('home_page'))


@app.route('/catalogs/items/<int:item_id>/edit', methods=['GET', 'POST'])
def edit_item(item_id):
    item = CatalogItem.get_by_id(item_id)
    if item and item.is_owned_by(g.current_user):
        catalogs = Catalog.get_all()
        if request.method == 'GET':
            return render_template('items/edit.html', item=item, catalogs=catalogs,
                                    name=item.name, catalog_id=item.catalog_id,
                                    description=item.description)
        else:
            name = request.form.get('name')
            description = request.form.get('description')
            catalog_id = request.form.get('catalog_id')
            if name and description and catalog_id:
                item.name = name
                item.description = description
                item.catalog_id = catalog_id
                session.add(item)
                session.commit()
                flash('Item %s is updated' % item.name, 'info')
                return redirect(url_for('get_item', item_id=item.id))

            else:
                flash('Name, description and catalog are required', 'warning')
                return render_template('items/new.html', catalogs=catalogs, name=name,
                                        catalog_id=catalog_id, description=description)
    else:
        flash('Item not found', 'error')
        return redirect(url_for('home_page'))


@app.route('/catalogs/items/<int:item_id>/delete', methods=['GET', 'POST'])
def delete_item(item_id):
    item = CatalogItem.get_by_id(item_id)
    if item and item.is_owned_by(g.current_user):
        if request.method == 'GET':
            return render_template('items/delete.html', item=item)
        else:
            session.delete(item)
            session.commit()
            flash('Item %s is removed' % item.name, 'info')
            return redirect(url_for('home_page'))
    else:
        flash('Item not found', 'error')
        return redirect(url_for('home_page'))

