

class TestOAuth(object):
    def test_lack_id_token(self, client):
        response = client.post('/google-login')
        assert response.status_code == 400

    def test_invalid_id_token(self, client):
        response = client.post('/google-login', json={'id_token': 'Random_token'})
        assert response.status_code == 401

    def test_valid_id_token(self, client):
        from catalog.utils import auth_helper
        auth_helper.get_user_info = lambda x: {'email': 'test@test.dev', 'name': 'test'}
        response = client.post('/google-login', json={'id_token': 'Valid_token'})
        assert response.status_code == 200
        assert ('access_token' in response.get_json() and
                len(response.get_json().get('access_token')) > 0)
