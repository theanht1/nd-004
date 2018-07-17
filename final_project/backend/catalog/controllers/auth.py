from flask import Blueprint, request

from catalog import db
from catalog.models import User
from catalog.utils.auth_helper import create_jwt_token, get_user_info
from catalog.utils.responses_helper import render_json_error, render_json

bp = Blueprint('auth', __name__)


@bp.route('/google-login', methods=['POST'])
def google_login():
    payload = request.get_json()

    if not (payload and 'id_token' in payload):
        return render_json_error('Id token is required', 400)

    id_token = payload['id_token']

    user_info = get_user_info(id_token)
    if not user_info:
        return render_json_error('Id token is not valid', 401)

    # Try to find user in our db
    user = db.session.query(User).filter(User.email == user_info['email']).first()
    # If user not in db, create new
    if not user:
        user = User(name=user_info['name'], email=user_info['email'], picture=user_info['picture'])
        db.session.add(user)
        db.session.commit()

    return render_json({'access_token': create_jwt_token(user)})
