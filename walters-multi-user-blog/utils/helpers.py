import json

def map_comment(comment):
    """Map a comment into dict, used for render json"""
    return {
        'content': comment.content,
        'created': str(comment.created),
        'user': {
            'id': comment.user.key().id(),
            'username': comment.user.username,
        },
    }
