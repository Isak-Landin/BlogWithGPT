from flask import Blueprint, request, current_app, render_template, jsonify
import pymongo
import datetime
from flask_login import login_required, current_user


from models.notes import Note
from management_helpers.format_json_for_frontend import format_results
from . import home_bp
from blueprints.edit.forms import NoteForm


@home_bp.route("/", methods=['GET', 'POST'])
@login_required
def home():
    form = NoteForm()
    print(current_user.pk)
    entries_with_date = [
        (
            entry.content,
            entry.updated_at,
            entry.updated_at.strftime("%b %d"),
            str(entry.pk)
        )
        for entry in Note.objects(user_id=str(current_user.pk), is_deleted=False).order_by('-updated_at')
    ]

    return render_template("home.html", entries=entries_with_date, form=form)


@home_bp.route("/load-default-notes", methods=['GET',])
@login_required
def load_notes():
    entries = Note.objects(user_id=str(current_user.pk), is_deleted=False).order_by('-updated_at')

    # Create formatted results
    formatted_results = format_results(entries)

    return jsonify(formatted_results)