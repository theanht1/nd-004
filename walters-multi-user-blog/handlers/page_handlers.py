from base_handler import BaseHandler
from models import Post

class IndexHandler(BaseHandler):
    def get(self):
        posts = Post.all().order('-created')
        self.render('index.html', posts = posts)
