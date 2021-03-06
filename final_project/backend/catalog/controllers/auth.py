from flask import Blueprint, request, g

from catalog import db
from catalog.models import User
from catalog.schemas.user_schema import UserSchema
from catalog.utils import auth_helper
from catalog.utils.auth_helper import create_jwt_token
from catalog.utils.decorators import login_required
from catalog.utils.responses_helper import render_json_error, render_json

bp = Blueprint('auth', __name__, url_prefix='/api')
userSchema = UserSchema()


@bp.route('/google-login/', methods=['POST'])
def google_login():
    payload = request.get_json()

    if not (payload and 'id_token' in payload):
        return render_json_error('Id token is required', 400)

    id_token = payload['id_token']

    user_info = auth_helper.get_user_info(id_token)
    if not user_info:
        return render_json_error('Id token is not valid', 401)

    # Try to find user in our db
    user = db.session.query(User).filter(User.email == user_info.get('email')).first()
    # If user not in db, create new
    if not user:
        user = User(name=user_info.get('name'), email=user_info.get('email'),
                    picture=user_info.get('picture'))
        db.session.add(user)
        db.session.commit()

    return render_json({
        'access_token': create_jwt_token(user),
        'current_user': userSchema.dump(user).data,
    })


@bp.route('/me/')
@login_required
def get_current_user():
    return render_json({
        'current_user': userSchema.dump(g.current_user).data,
    })
