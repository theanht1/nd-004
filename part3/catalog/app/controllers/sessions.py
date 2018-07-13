import json

import httplib2
import requests
from flask import render_template, request, session, Blueprint, flash
from oauth2client.client import flow_from_clientsecrets, FlowExchangeError

from app.models import User
from app.utils import render_json, render_json_error
from app.db import db_session

CLIENT_ID = json.loads(
    open('client_secrets.json', 'r').read())['web']['client_id']

bp = Blueprint('auth', __name__)


@bp.route('/login')
def login():
    """Route to login page"""
    return render_template('login.html')


@bp.route('/gconnect', methods=['POST'])
def gconnect():
    """Use google one time token to validate user"""
    code = request.data

    try:
        # Upgrade the authorization code into a credentials object
        oauth_flow = flow_from_clientsecrets('client_secrets.json', scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        return render_json_error('Failed to upgrade the authorization code.', 401)

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
    user = db_session.query(User).filter(User.email == data['email']).first()
    # If user not in db, create new
    if not user:
        user = User(name=data['name'], email=data['email'], picture=data['picture'])
        db_session.add(user)
        db_session.commit()

    # Store the access token in the session for later use.
    session['access_token'] = credentials.access_token
    # Store user id for user authentication in next request
    session['user_id'] = user.id

    flash('Successfully login', 'info')
    return render_json({'message': 'Successfully login'})


@bp.route('/gdisconnect', methods=['POST'])
def gdisconnect():
    """Disconnect current user by revoke access_token"""
    access_token = session.get('access_token')
    if access_token is None:
        return render_json_error("Current user not connected.", 401)

    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % session['access_token']
    httplib2.Http().request(url, 'GET')

    del session['access_token']
    del session['user_id']

    flash('Successfully logout', 'info')
    return render_json({'message': 'Successfully disconnected.'})
