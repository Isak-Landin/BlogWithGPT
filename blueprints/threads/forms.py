from flask_wtf import FlaskForm
from wtforms import TextAreaField, SubmitField
from wtforms import StringField
from wtforms.validators import DataRequired


class NewThreadForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
