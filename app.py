import os

from flask import Flask, render_template, request
import datetime
from dotenv import load_dotenv
from pymongo import MongoClient


load_dotenv()


def create_app():
    app = Flask(__name__)

    # Create a new client and connect to the server
    client: MongoClient = MongoClient(os.getenv("MONGODB_URI"))

    # make the mongoDB client our db for the app
    app.db = client.microblog

    @app.route("/", methods=['GET', 'POST'])
    def home():
        if request.method == "POST":
            entry_content = request.form.get("content")
            formatted_date = datetime.datetime.today().strftime("%Y-%m-%d")
            app.db.entries.insert_one({"content": entry_content, "date": formatted_date})

        entries_with_date = [
            (
                entry["content"],
                entry["date"],
                datetime.datetime.strptime(entry["date"], "%Y-%m-%d").strftime("%b %d")
            )
            for entry in app.db.entries.find({})
        ]

        entries_with_date = sorted(
            entries_with_date,
            key=lambda x: datetime.datetime.strptime(x[1], "%Y-%m-%d"),
            reverse=True
        )
        return render_template("home.html", entries=entries_with_date)

    @app.route("/fancy")
    def hello_world_fancy():
        return ""

    return app
