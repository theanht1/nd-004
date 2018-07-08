from base_handler import BaseHandler
from models import Post, Like
from utils.helpers import map_comment
import json

class NewPostHandler(BaseHandler):
    def get(self):
        self.check_user_login()
        self.render('new_post.html')

    def post(self):
        self.check_user_login()

        subject = self.request.get('subject')
        content = self.request.get('content')

        if not (subject and content):
            return self.render('new_post.html', subject = subject, content = content,
                                error = 'Subject or content is invalid')

        post = Post(user = self.get_current_user(),
                    subject = subject, content = content)
        post.put()
        self.redirect('/posts/%s' % str(post.key().id()))

class PostDetailHander(BaseHandler):
    def get(self, post_id):
        post = Post.get_by_id(int(post_id))
        current_user = self.get_current_user()

        is_user_like = False
        if current_user:
            like = Like.all() \
                .filter('user = ', current_user.key()) \
                .filter('post = ', post.key()) \
                .get()

            if like:
                is_user_like = True

        comments = post.comments.order('-created')

        comments = json.dumps(list(map(lambda cmt: map_comment(cmt), comments)))

        self.render('post_detail.html', post = post,
                    is_user_like = is_user_like, comments = comments)
