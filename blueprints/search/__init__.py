from flask import Blueprint

search_bp = Blueprint('search_bp', __name__, template_folder='templates')

from. import views