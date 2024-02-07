import mongoengine as me
from models.user import User
from models.notes import Note


class Conclusion(me.Document):
    meta = {'collection': 'conclusions'}
    note_id = me.ReferenceField(Note, required=True)
    owner_id = me.ReferenceField(User, required=True)
    content = me.StringField(max_length=2000, required=True)