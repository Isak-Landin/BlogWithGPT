from flask import Blueprint, request, current_app, render_template, jsonify
import pymongo
import datetime
from flask_login import login_required


from management_helpers.format_json_for_frontend import format_results
from . import home_bp
from blueprints.edit.forms import NoteForm


@home_bp.route("/", methods=['GET', 'POST'])
@login_required
def home():
    form = NoteForm()

    entries_with_date = [
        (
            entry["content"],
            entry["updated_at"],
            entry["updated_at"].strftime("%b %d"),
            str(entry["_id"])
        )
        for entry in current_app.db.entries.find({}).sort("updated_at", pymongo.DESCENDING)
    ]

    return render_template("home.html", entries=entries_with_date, form=form)


@home_bp.route("/load-default-notes", methods=['GET',])
@login_required
def load_notes():
    entries = current_app.db.entries.find({}).sort("date", pymongo.DESCENDING)

    # Create formatted results
    formatted_results = format_results(entries)

    return jsonify(formatted_results)