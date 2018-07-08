from base_handler import BaseHandler
from models import Comment, Post
from utils.helpers import map_comment
import json

class AddCommentHandler(BaseHandler):
    def post(self, post_id):
        self.check_user_login()

        post = Post.get_by_id(int(post_id))
        if not post:
            return self.render_json_error('Post not found', 404)

        content = json.loads(self.request.body)['content']
        comment = Comment(user = self.current_user, post = post,
                          content = content)
        comment.put()

        self.render_json({ 'comment': map_comment(comment) }, 201)
