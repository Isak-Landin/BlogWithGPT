from werkzeug.security import generate_password_hash, check_password_hash
import mongoengine as me

from flask_login import UserMixin


class User(UserMixin, me.Document):
    meta = {'collection': 'users'}
    username = me.StringField(max_length=30, unique=True, required=True)
    email = me.EmailField(max_length=100, unique=True, required=True)
    password_hash = me.StringField(required=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)