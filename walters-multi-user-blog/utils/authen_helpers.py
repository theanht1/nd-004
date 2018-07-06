import hashlib
import hmac
import string
import random

secret = 'THIS_SECRET_WILL_KEEP_YOU_SAFE'

def gen_salt(length = 5):
    return ''.join(random.choice(string.letters) for i in range(length))

def make_secure_hash(text):
    return hmac.new(secret, text).hexdigest()

def make_hash_with_salt(password, salt):
    return '%s|%s' % (make_secure_hash(password) ,salt)

def make_secure_password(raw_password):
    salt = gen_salt()
    return make_hash_with_salt(raw_password, salt)

def is_user_authenticated(user, password):
    salt = user.password.split('|')[-1]

    return user.password == make_hash_with_salt(password, salt)

def make_secure_cookie(user):
    user_id = user.key().id()
    return '%s|%s' % (user_id, make_secure_hash(str(user_id)))

def check_valid_cookie(cookie):
    user_id, user_id_hash = cookie.split('|')
    return user_id_hash == make_secure_hash(str(user_id))
