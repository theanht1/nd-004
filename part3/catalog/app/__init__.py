from flask import Flask


app = Flask(__name__)
app.config['TESTING'] = False

from controllers import *
