from flask import Blueprint


delete_bp = Blueprint('delete', __name__, url_prefix='/delete')

from . import views
