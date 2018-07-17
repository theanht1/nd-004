from functools import wraps
from flask import g, redirect, url_for, flash, request

from app.models import CatalogItem


def login_required(f):
    """Decorator that redirect anonymous user to login page"""
    @wraps(f)
    def decorated_func(**kwargs):
        if g.current_user is None:
            flash('User not authorized', 'error')
            return redirect(url_for('auth.login'))
        return f(**kwargs)
    return decorated_func


def item_required(f):
    """Decorator that redirect to home page if item not found"""
    @wraps(f)
    def decorated_func(item_id, **kwargs):
        item = CatalogItem.get_by_id(item_id)
        if item is None:
            flash('Item not found', 'error')
            return redirect(url_for('catalog.home_page'))
        return f(item_id, item, **kwargs)
    return decorated_func


def item_owner_required(f):
    """Decorator that redirect user doesn't own item to home page"""
    @wraps(f)
    def decorated_func(item_id, item, **kwargs):
        if g.current_user.id != item.user_id:
            flash('User not authorized', 'error')
            return redirect(url_for('catalog.home_page'))
        return f(item_id, item, **kwargs)
    return decorated_func
