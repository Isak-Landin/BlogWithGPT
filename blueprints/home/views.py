from flask import (
    Blueprint, request, current_app, render_template, jsonify,
    abort
)
import pymongo
import datetime
from flask_login import login_required, current_user
from bson.objectid import ObjectId
from bson.errors import InvalidId


from models.notes import Note
from management_helpers.format_json_for_frontend import format_results, format_date
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


@home_bp.route("/load-note/<mongo_id>", methods=['GET',])
@login_required
def load_note(mongo_id):
    _id = ObjectId(mongo_id)
    if not is_valid_object_id(mongo_id) or not does_entry_exist(mongo_id):
        abort(404)
    note = Note.objects(user_id=str(current_user.pk), pk=_id).first()

    if not note:
        abort(500)

    def format_response_new_note(new_note_from_entry):
        return {
            'title': new_note_from_entry.content[:30] + '...' if len(note["content"]) > 30 else note["content"],
            'date': new_note_from_entry.updated_at,
            'content': new_note_from_entry.content,
            'formattedDate': format_date(new_note_from_entry.updated_at),
            '_id': str(new_note_from_entry.pk)
        }

    try:
        formatted_note = format_response_new_note(note)
        message = 'Success'
        data = {
            'note': formatted_note,
            'message': message,
        }
    except Exception:
        message = 'Error formatting new note'
        data = {
            'message': message
        }

    response_ = data

    return response_


def is_valid_object_id(_id):
    try:
        ObjectId(_id)
        return True
    except InvalidId:
        return False


def does_entry_exist(mongo_id):
    entry = current_app.db.entries.find_one({"_id": ObjectId(mongo_id)})
    return entry is not None