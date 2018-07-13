# Catalog app file

### Installations

* Install requirement librariesL `pip install -r requirements.txt`
* Setup db `python database_setup.py`

### Running

* Start server : `python -m flask run`
* App now can be accessed in : `localhost:5000`

### Testing

* Run test `PYTHONPATH=./ pytest -v`
* Coverage
```
coverage run -m pytest
coverage report
coverage html
```