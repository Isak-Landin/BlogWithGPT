import os

from flask import Flask, render_template, request, jsonify

from blueprints.home.home import home_bp
from blueprints.search.search import search_bp
from blueprints.edit.edit import edit_bp

import datetime
from dotenv import load_dotenv
from pymongo import MongoClient

from flask_wtf.csrf import CSRFProtect


load_dotenv()

csrf = CSRFProtect()


def create_app():
    app = Flask(__name__)
    app.register_blueprint(home_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(edit_bp, url_prefix='/edit')

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['WTF_CSRF_SECRET_KEY'] = os.getenv('WTF_CSRF_SECRET_KEY')

    # Create a new client and connect to the server
    client: MongoClient = MongoClient(os.getenv("MONGODB_URI"))

    # make the mongoDB client our db for the app
    app.db = client.microblog

    csrf.init_app(app=app)

    @app.errorhandler(400)
    def bad_request(error):
        print(error)

        response = jsonify({'error': 'Bad request', 'message': str(error)})
        response.status_code = 400
        return response

    return app
