from flask import Blueprint


delete_bp = Blueprint('delete', __name__)

from . import views
