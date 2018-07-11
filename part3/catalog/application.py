from app import app


if __name__ == '__main__':
    # app.config['TESTING'] = False
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.config['DB'] = 'sqlite:///catalog_menu.db'
    app.run(host='0.0.0.0', port=8000)
