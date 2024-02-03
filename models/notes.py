import mongoengine as me
import datetime


class Note(me.Document):
    meta = {'collection': 'entries'}
    content = me.StringField(max_length=1000, required=True)
    created_at = me.DateTimeField(required=True, default=datetime.datetime.now())
    updated_at = me.DateTimeField(required=True, default=datetime.datetime.now())
    user_id = me.StringField(max_length=100, required=True)
    is_deleted = me.BooleanField(required=False, default=False)
    deleted_at = me.DateTimeField(required=False, default=None)