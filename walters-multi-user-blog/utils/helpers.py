import json

def map_comment(comment):
    return {
        'content': comment.content,
        'created': str(comment.created),
        'user': {
            'id': comment.user.key().id(),
            'username': comment.user.username,
        },
    }
