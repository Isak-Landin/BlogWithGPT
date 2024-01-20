from flask_wtf import FlaskForm, RecaptchaField
from wtforms import TextAreaField
from wtforms.validators import DataRequired


class NoteForm(FlaskForm):
    content = TextAreaField('Entry contents:', validators=[DataRequired()])