from flask import Blueprint


edit_bp = Blueprint('edit', __name__)

from . import views
