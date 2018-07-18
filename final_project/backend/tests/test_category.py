from catalog import db
from catalog.models import Category


class TestCategory(object):
    def test_get_categories(self, client, app):
        with app.app_context():
            categories = db.session.query(Category).all()

        response = client.get('/categories/')
        data = response.get_json()

        assert response.status_code == 200
        # Categories should be in response data
        assert 'categories' in data and len(data['categories']) == len(categories)
        cat_ids = map(lambda cat: cat.id, categories)
        response_cat_ids = map(lambda cat: cat['id'], data['categories'])
        assert sorted(cat_ids) == sorted(response_cat_ids)
