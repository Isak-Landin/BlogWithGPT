import mongoengine as me
import datetime

from models.notes import Note
from models.user import User
from models.conclusions import Conclusion


class Thread(me.Document):
    meta = {'collection': 'threads'}
    Title = me.StringField(max_length=100, required=True)
    question = me.StringField(max_length=1000, required=False)
    created_at = me.DateTimeField(default=datetime.datetime.now())
    updated_at = me.DateTimeField(default=datetime.datetime.now())
    openai_thread_id = me.StringField(required=False)

    owner_id = me.ReferenceField(User, required=True)
    note_pks = me.ListField(me.ReferenceField(Note, required=True), required=True)
    conclusion_pks = me.ListField(me.ReferenceField(Conclusion, required=False), required=False)

