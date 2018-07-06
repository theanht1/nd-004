from base_handler import BaseHandler
from models import Post

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
        self.render('post_detail.html', post = post)
