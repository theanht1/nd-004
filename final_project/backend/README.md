# Backend for GotIt final project
This repository contains backend code for the final project

### Structure
```
catalog/
    controllers/                # API routes
    models/                     # Database models
    schemas/                    # Marshmallow validation schemas
    static/                     # Static file
    utils/                      # Util helpers
        auth_helper.py          # Contains util functions for create/check token
        decorators.py           # Contains decorators used in controllers
        responses_helper.py     # Contains utils functions for return JSON response
    __init__.py                 # Contains create_app function
    db.py                       # Contains db setup and init functions
config/                         # Config file
tests/                          $ Contains unit tests
```
### Installation
* Python 2.7
* [MySQL](https://www.mysql.com/downloads/)
* Install requirements: `pip install -r requirements.txt`
* Create environment variables:
```bash
export FLASK_APP=catalog/__init__.py
export FLASK_ENV=development
# Use MySql credential 
export SQLALCHEMY_DATABASE_ROOT=mysql://{username}@{password}:{host}
export JWT_SECRET=some_secret_text
```
* Initial database `python database_setup.py`

### Running and testing
* Run backend: `python run -m flask`
* Testing: `PYTHONPATH=./ pytest -v`
* Coverage:
```bash
coverage run --source=catalog/controllers,catalog/utils -m pytest
coverage report
```
