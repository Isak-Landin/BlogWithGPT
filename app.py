import os
from flask import Flask, jsonify, request, redirect, url_for
import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from flask_mongoengine import MongoEngine
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager, login_required, current_user
from bson.objectid import ObjectId

from blueprints.home import home_bp
from blueprints.search import search_bp
from blueprints.edit import edit_bp
from blueprints.auth import auth_bp

from models.user import User


load_dotenv()

csrf = CSRFProtect()

EXEMPT_ROUTES = ['auth_bp.login', 'auth_bp.register', 'static']


def create_app():
    app = Flask(__name__)
    app.register_blueprint(home_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(edit_bp, url_prefix='/edit')
    app.register_blueprint(auth_bp, url_prefix='/auth')

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['WTF_CSRF_SECRET_KEY'] = os.getenv('WTF_CSRF_SECRET_KEY')

    app.config['MONGODB_SETTINGS'] = {
        'host': os.getenv("MONGODB_URI"),
        'db': 'microblog'  # os.getenv("MONGODB_DATABASE"),
    }

    # create login manager
    login_manager = LoginManager()
    # initialize login manager for application
    login_manager.init_app(app)
    login_manager.login_view = 'auth_bp.login'
    # Store login manager for use in different parts of the application
    app.login_manager = login_manager

    # Create a new client and connect to the server
    client: MongoClient = MongoClient(os.getenv("MONGODB_URI"))
    client_mongo_engine = MongoEngine(app)

    # make the mongoDB client our db for the app
    app.db = client.microblog
    app.db_mongo_engine = client_mongo_engine

    csrf.init_app(app=app)

    @app.route('/generate-csrf-token')
    @login_required
    def generate_csrf_token():
        return jsonify({'csrf_token': generate_csrf()})

    @app.errorhandler(400)
    def bad_request(error):
        print(error)

        response = jsonify({'error': 'Bad request', 'message': str(error)})
        response.status_code = 400
        return response

    @login_manager.user_loader
    def load_user(user_id):
        try:
            # Convert the user_id to ObjectId and query the database
            return User.objects(pk=ObjectId(user_id)).first()
        except Exception as e:
            # Handle any exception (e.g., if user_id is not a valid ObjectId)
            print(e)
            return None

    @app.before_request
    def check_user_authentication():
        if request.endpoint not in EXEMPT_ROUTES and not current_user.is_authenticated:
            return redirect(url_for(login_manager.login_view))

    return app
