import json

import httplib2
import requests
from flask import render_template, request, g
from flask import session as login_session
from oauth2client.client import FlowExchangeError
from oauth2client.client import flow_from_clientsecrets

from app import app
from app.models import User
from app.utils import render_json, render_json_error

CLIENT_ID = json.loads(
    open('client_secrets.json', 'r').read())['web']['client_id']


@app.route('/login')
def login():
    """Route to login page"""
    return render_template('login.html')


@app.route('/gconnect', methods=['POST'])
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
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If there was an error in the access token info, abort.
    if result.get('error') is not None:
        return render_json_error(result.get('error'), 500)

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        return render_json_error("Token's user ID doesn't match given user ID.", 401)

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        return render_json_error("Token's client ID does not match app's.", 401)

    # Store the access token in the session for later use.
    login_session['access_token'] = credentials.access_token

    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    user = g.session.query(User).filter(User.email == data['email']).first()
    if not user:
        user = User(name=data['name'], email=data['email'], picture=data['picture'])
        g.session.add(user)
        g.session.commit()

    login_session['user_id'] = user.id
    return render_json({'message': 'Successfully login'})


# DISCONNECT - Revoke a current user's token and reset their login_session
@app.route('/gdisconnect', methods=['POST'])
def gdisconnect():
    access_token = login_session.get('access_token')
    if access_token is None:
        return render_json_error("Current user not connected.", 401)

    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % login_session['access_token']
    h = httplib2.Http()
    h.request(url, 'GET')
    del login_session['access_token']
    del login_session['user_id']
    return render_json({'message': 'Successfully disconnected.'})
