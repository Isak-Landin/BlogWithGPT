from flask import Blueprint, request, current_app, render_template, jsonify
from create_form_fields import NoteForm
import pymongo

import datetime

from management_helpers.format_json_for_frontend import format_results

home_bp = Blueprint('home', __name__)


@home_bp.route("/", methods=['GET', 'POST'])
def home():
    form = NoteForm()
    if form.validate_on_submit():
        entry_content = request.form.get("content")
        formatted_date = datetime.datetime.today().strftime("%Y-%m-%d")
        current_app.db.entries.insert_one({"content": entry_content, "date": formatted_date})

    entries_with_date = [
        (
            entry["content"],
            entry["date"],
            datetime.datetime.strptime(entry["date"], "%Y-%m-%d").strftime("%b %d"),
            str(entry["_id"])
        )
        for entry in current_app.db.entries.find({}).sort("date", pymongo.DESCENDING)
    ]

    return render_template("home.html", entries=entries_with_date, form=form)


@home_bp.route("/load-default-notes", methods=['GET',])
def load_notes():
    entries = current_app.db.entries.find({}).sort("date", pymongo.DESCENDING)

    # Create formatted results
    formatted_results = format_results(entries)

    return jsonify(formatted_results)