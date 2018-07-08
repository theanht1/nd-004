from base_handler import BaseHandler
from models import Like, Post

class TriggerLikePostHandler(BaseHandler):
    def post(self, post_id):
        self.check_user_login()

        post = Post.get_by_id(int(post_id))
        if not post:
            return self.render_json_error('Post not found', 404)

        if post.user.key() == self.current_user.key():
            return self.render_json_error('Can not like your post')

        like = Like.all() \
            .filter('user = ', self.current_user.key()) \
            .filter('post = ', post.key()) \
            .get()

        if like:
            like.delete()
        else:
            like = Like(post = post, user = self.current_user)
            like.put()

        self.render_json({ 'success': True }, 200)
