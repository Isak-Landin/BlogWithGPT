import time

from flask import (
    request, redirect, url_for, jsonify, current_app,
    abort, Response, session
)
from flask_login import login_required, current_user

from bson.objectid import ObjectId
from bson.errors import InvalidId
import datetime

from .forms import NoteForm
from models.notes import Note
from . import edit_bp
from management_helpers.format_json_for_frontend import format_date


@edit_bp.route('/add', methods=['POST', 'GET'])
@login_required
def add():
    form = NoteForm()
    response = {'message': ''}
    if form.validate_on_submit():
        # Parse JSON data sent with the request
        content = request.form.get('content')

        # Get user_id field from user object in MongoDB
        user_id = str(current_user.pk)

        # Create a new note object
        try:
            note = Note(
                content=content,
                user_id=user_id,
                updated_at=datetime.datetime.now(),
                created_at=datetime.datetime.now()
            )
            note.save()
            response['message'] = 'Note added successfully!'
        except Exception as e:
            response = jsonify({'error': str(e)})

    # Return a Response
    return redirect(url_for('home.home'))


@edit_bp.route('/edit/<mongo_id>', methods=['PUT'])
@login_required
def edit(mongo_id):
    if not is_valid_object_id(mongo_id) or not does_entry_exist(mongo_id):
        abort(404)
    form = NoteForm()
    response = None

    if form.validate_on_submit():
        # Parse JSON data sent with the request
        data = request.get_json()

        _id = ObjectId(mongo_id)
        current_user_string = str(current_user.pk)

        # Get content of edited note request
        content = data.get('content')

        # Get the note that the user wants to edit
        note = Note.objects(user_id=current_user_string, pk=_id).first()
        if note:
            success = note.modify(content=content, updated_at=datetime.datetime.now())
            if success:
                response = jsonify({'message': 'Note edited successfully!'})
            else:
                response = jsonify({'error': 'Note not edited!'})

    # Return a Response
    if not response:
        response = jsonify({'error': 'Note not found!'})

    """ 
   # testing error message on frontend:
    response = {
        'error': 'Error',
    }
    """

    return response


# Once a note is saved, we need to access the new note and present it's new values to the user
@edit_bp.route('/<mongo_id>', methods=['GET'])
@login_required
def new_saved_note(mongo_id):
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
