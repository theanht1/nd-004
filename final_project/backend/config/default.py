from os import environ


DEBUG = False
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_ROOT = environ.get('DB_URI_ROOT')

SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_ROOT + '/catalog'
GOOGLE_CLIENT_ID = '217213546954-co2a91q2h27thlckipqd810v3q8qr3p4.apps.googleusercontent.com'
JWT_SECRET = environ.get('JWT_SECRET') or 'super_secret_text'
