import json

import httplib2
import requests
from flask import Blueprint, request
from oauth2client.client import flow_from_clientsecrets, FlowExchangeError

from catalog import db
from catalog.models import User
from catalog.utils.auth_helper import create_jwt_token
from catalog.utils.responses_helper import render_json_error, render_json

bp = Blueprint('auth', __name__)

CLIENT_ID = json.loads(
    open('client_secrets.json', 'r').read())['web']['client_id']


@bp.route('/google-login', methods=['POST'])
def google_login():
    code = request.get_json()['code']

    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        return render_json_error('Failed to get access token.', 401)

    # Check that the access token is valid.
    access_token = credentials.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
           % access_token)
    result = json.loads(httplib2.Http().request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        return render_json_error(result.get('error'), 500)

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        return render_json_error("Token's client ID does not match app's.", 401)

    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    # Try to find user in our db
    user = db.session.query(User).filter(User.email == data['email']).first()
    # If user not in db, create new
    if not user:
        user = User(name=data['name'], email=data['email'], picture=data['picture'])
        db.session.add(user)
        db.session.commit()

    return render_json({'access_token': create_jwt_token(user)})
