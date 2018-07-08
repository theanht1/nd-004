from base_handler import BaseHandler
from models import User, Post

class UserPostIndexHandler(BaseHandler):

    def get(self, user_id):
        user = User.get_by_id(int(user_id))

        if not user:
            return redirect('/')

        posts = user.posts.order('-created')

        self.render('index.html', posts = posts)
